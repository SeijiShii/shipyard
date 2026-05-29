import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { operatorEmails } from "./config";
import {
  isOperator,
  isProtectedAdminPath,
  requireOperator,
  type OperatorSession,
} from "./operator";

// docs/_shared/auth/003_auth_UNIT_TEST.md — allowlist + 認可 + 保護パス（Clerk mock = 実キー不要）

const orig = process.env.OPERATOR_EMAILS;
beforeEach(() => {
  process.env.OPERATOR_EMAILS = "seiji@example.com, Ops@Example.com";
});
afterEach(() => {
  process.env.OPERATOR_EMAILS = orig;
});

const resolver = (session: OperatorSession | null) => async () => session;

describe("operatorEmails / isOperator (U-1, U-E3, U-B1)", () => {
  it("U-B1: 複数/空白/大文字小文字を正規化", () => {
    expect(operatorEmails()).toEqual(["seiji@example.com", "ops@example.com"]);
    process.env.OPERATOR_EMAILS = "";
    expect(operatorEmails()).toEqual([]);
  });

  it("U-1: allowlist 内メール（大文字小文字無視）→ true", () => {
    expect(isOperator("seiji@example.com")).toBe(true);
    expect(isOperator("OPS@example.com")).toBe(true);
  });

  it("U-E3: 空/不正/allowlist 外 → false", () => {
    expect(isOperator(null)).toBe(false);
    expect(isOperator(undefined)).toBe(false);
    expect(isOperator("")).toBe(false);
    expect(isOperator("stranger@example.com")).toBe(false);
  });
});

describe("requireOperator (U-2, U-E1, U-E2)", () => {
  it("U-2: 認証済 + allowlist 内 → ok", async () => {
    const res = await requireOperator(
      resolver({ userId: "u_1", email: "seiji@example.com" }),
    );
    expect(res).toEqual({
      ok: true,
      session: { userId: "u_1", email: "seiji@example.com" },
    });
  });

  it("U-E1: 未認証 → 401", async () => {
    const res = await requireOperator(resolver(null));
    expect(res).toEqual({ ok: false, status: 401 });
  });

  it("U-E2: 認証済だが allowlist 外 → 403（詳細非開示）", async () => {
    const res = await requireOperator(
      resolver({ userId: "u_2", email: "stranger@example.com" }),
    );
    expect(res).toEqual({ ok: false, status: 403 });
  });

  it("認証済だが email なし → 403", async () => {
    const res = await requireOperator(resolver({ userId: "u_3", email: null }));
    expect(res).toEqual({ ok: false, status: 403 });
  });
});

describe("isProtectedAdminPath (U-B2)", () => {
  it("admin/api/admin は保護対象", () => {
    expect(isProtectedAdminPath("/admin")).toBe(true);
    expect(isProtectedAdminPath("/admin/threads/1")).toBe(true);
    expect(isProtectedAdminPath("/api/admin/reply")).toBe(true);
  });

  it("訪問者導線は保護対象外（認証ゼロ維持、D004）", () => {
    for (const p of [
      "/",
      "/contact",
      "/t/abc123",
      "/services",
      "/legal",
      "/privacy",
    ]) {
      expect(isProtectedAdminPath(p)).toBe(false);
    }
  });
});
