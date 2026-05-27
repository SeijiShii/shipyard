import { describe, it, expect, vi } from "vitest";
import { generateThreadToken } from "./token";
import { isDisposable, emailDomain } from "./email-checks";
import { rateLimitKey, windowStart, checkRateLimit } from "./rate-limit";
import { verifySubmission, GENERIC_REJECT_MESSAGE, type VerifyInput, type VerifyDeps } from "./verify";
import type { RateLimitRepo } from "@/lib/db/repositories/rateLimit";
import type { TurnstileVerifier } from "./turnstile";

// docs/_shared/spam/003_spam_UNIT_TEST.md — 5 段防御 + token + PII（実 Turnstile/MX 不要 mock）

function repoWithCount(count: number): RateLimitRepo {
  return { hitAndCount: vi.fn(async () => count) } as unknown as RateLimitRepo;
}
const passTurnstile: TurnstileVerifier = { verify: async () => ({ success: true }) };
const failTurnstile: TurnstileVerifier = { verify: async () => ({ success: false }) };
const errTurnstile: TurnstileVerifier = {
  verify: async () => {
    throw new Error("cloudflare down");
  },
};
const mxOk = async () => true;
const mxNone = async () => false;

const NOW = new Date("2026-05-27T12:00:00Z");
function validInput(over: Partial<VerifyInput> = {}): VerifyInput {
  return {
    turnstileToken: "tk",
    honeypot: "",
    formRenderedAt: NOW.getTime() - 10_000, // 10 秒前 = 人間らしい
    ip: "203.0.113.5",
    email: "user@example.com",
    body: "問い合わせ本文",
    ...over,
  };
}
function deps(over: Partial<VerifyDeps> = {}): VerifyDeps {
  return {
    repo: repoWithCount(1),
    turnstile: passTurnstile,
    mxResolver: mxOk,
    now: NOW,
    ...over,
  };
}

describe("generateThreadToken (U-2, U-B1)", () => {
  it("base64url, 長さ≥22, 毎回ユニーク", () => {
    const a = generateThreadToken();
    const b = generateThreadToken();
    expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(a.length).toBeGreaterThanOrEqual(22);
    expect(a).not.toBe(b);
  });
});

describe("email-checks", () => {
  it("emailDomain 抽出", () => {
    expect(emailDomain("a@Example.com")).toBe("example.com");
    expect(emailDomain("invalid")).toBeNull();
  });
  it("U-E5 素材: 使い捨てドメイン判定", () => {
    expect(isDisposable("x@mailinator.com")).toBe(true);
    expect(isDisposable("x@example.com")).toBe(false);
  });
});

describe("rate-limit (U-3, U-P1)", () => {
  it("U-P1: key が ip/email を平文で含まない（ハッシュ化）", () => {
    const key = rateLimitKey("203.0.113.5", "user@example.com");
    expect(key).not.toContain("203.0.113.5");
    expect(key).not.toContain("user@example.com");
    expect(key).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
  });
  it("windowStart は windowMs で量子化", () => {
    const w = windowStart(new Date("2026-05-27T12:03:45Z"), 600_000);
    expect(w.toISOString()).toBe("2026-05-27T12:00:00.000Z");
  });
  it("U-3: 上限内は ok、超過で ok:false", async () => {
    expect(await checkRateLimit(repoWithCount(3), { ip: "i", email: "e", now: NOW, limit: 5, windowMs: 1000 })).toEqual({ ok: true, count: 3 });
    expect(await checkRateLimit(repoWithCount(6), { ip: "i", email: "e", now: NOW, limit: 5, windowMs: 1000 })).toEqual({ ok: false, count: 6 });
  });
});

describe("verifySubmission 5 段 (U-1, U-E1〜E7)", () => {
  it("U-1: 全段 pass → ok:true", async () => {
    expect(await verifySubmission(validInput(), deps())).toEqual({ ok: true });
  });
  it("U-E1: honeypot 非空 → reject", async () => {
    const r = await verifySubmission(validInput({ honeypot: "bot" }), deps());
    expect(r).toEqual({ ok: false, reason: "honeypot" });
  });
  it("U-E2: timing trap（<2s）→ reject", async () => {
    const r = await verifySubmission(validInput({ formRenderedAt: NOW.getTime() - 500 }), deps());
    expect(r).toEqual({ ok: false, reason: "timing" });
  });
  it("U-E3: rate limit 超過 → reject", async () => {
    const r = await verifySubmission(validInput(), deps({ repo: repoWithCount(99), rateLimit: 5 }));
    expect(r).toEqual({ ok: false, reason: "rate_limit" });
  });
  it("U-E4: turnstile fail → reject", async () => {
    const r = await verifySubmission(validInput(), deps({ turnstile: failTurnstile }));
    expect(r).toEqual({ ok: false, reason: "turnstile" });
  });
  it("U-E5: 使い捨てドメイン → reject", async () => {
    const r = await verifySubmission(validInput({ email: "x@mailinator.com" }), deps());
    expect(r).toEqual({ ok: false, reason: "disposable_email" });
  });
  it("U-E6: MX なし → reject", async () => {
    const r = await verifySubmission(validInput(), deps({ mxResolver: mxNone }));
    expect(r).toEqual({ ok: false, reason: "no_mx" });
  });
  it("U-E7: Turnstile API 障害 → 既定 fail-closed reject（論点-005 案A）", async () => {
    const r = await verifySubmission(validInput(), deps({ turnstile: errTurnstile }));
    expect(r).toEqual({ ok: false, reason: "turnstile_unavailable" });
  });
  it("論点-005: failClosed=false なら API 障害でも通過", async () => {
    const r = await verifySubmission(validInput(), deps({ turnstile: errTurnstile, turnstileFailClosed: false }));
    expect(r).toEqual({ ok: true });
  });
  it("SPAM-E2: MX resolver が throw でも pass 寄り", async () => {
    const mxThrow = async () => {
      throw new Error("dns timeout");
    };
    expect(await verifySubmission(validInput(), deps({ mxResolver: mxThrow }))).toEqual({ ok: true });
  });
});

describe("U-P2: ユーザー向け文言は汎用", () => {
  it("GENERIC_REJECT_MESSAGE は内部理由コードを含まない", () => {
    for (const code of ["honeypot", "turnstile", "rate_limit", "disposable_email", "no_mx"]) {
      expect(GENERIC_REJECT_MESSAGE).not.toContain(code);
    }
    expect(GENERIC_REJECT_MESSAGE.length).toBeGreaterThan(0);
  });
});
