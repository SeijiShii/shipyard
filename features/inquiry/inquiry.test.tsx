import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { inquirySchema, replySchema, BODY_MAX } from "./schema";
import { createInquiry, addReply, type CreateInquiryDeps, type AddReplyDeps } from "./service";
import { saveThread, savedThreads } from "./storage";
import { ThreadView } from "./ThreadView";
import { ContactForm } from "./ContactForm";
import type { InquirerRepo } from "@/lib/db/repositories/inquirer";
import type { ThreadRepo, Thread } from "@/lib/db/repositories/thread";
import type { MessageRepo } from "@/lib/db/repositories/message";
import type { VerifyResult } from "@/lib/spam/verify";

// docs/inquiry/003 — schema / service(IDOR/PII/spam) / storage / XSS（実キー不要 mock）

function createDeps(verifyResult: VerifyResult) {
  const inquirers = { upsertByEmail: vi.fn(async () => ({ id: "inq_1" })) } as unknown as InquirerRepo;
  const threads = {
    create: vi.fn(async () => ({ id: "th_1", token: "TOK_ABC" })),
    findByToken: vi.fn(),
    touchActivity: vi.fn(async () => {}),
  } as unknown as ThreadRepo;
  const messages = { add: vi.fn(async () => ({ id: "msg_1" })) } as unknown as MessageRepo;
  const notifyThreadLink = vi.fn(async () => ({ ok: true }));
  const notifyOperator = vi.fn(async () => ({ ok: true }));
  const deps: CreateInquiryDeps = {
    verify: vi.fn(async () => verifyResult),
    inquirers,
    threads,
    messages,
    notifyThreadLink,
    notifyOperator,
  };
  return { deps, threads, messages, inquirers, notifyThreadLink, notifyOperator };
}

const validInput = {
  email: "user@example.com",
  body: "問い合わせ本文です",
  subject: "件名",
  honeypot: "",
  formRenderedAt: Date.now() - 10_000,
  turnstileToken: "tk",
  ip: "203.0.113.5",
};

describe("schema (U-2, U-E2, U-X2)", () => {
  it("U-2: 正しい email/body/subject を通す", () => {
    expect(inquirySchema.safeParse(validInput).success).toBe(true);
  });
  it("U-E2: 不正 email / 空 body は reject", () => {
    expect(inquirySchema.safeParse({ ...validInput, email: "not-email" }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...validInput, body: "   " }).success).toBe(false);
  });
  it("U-X2: body 上限超過は reject", () => {
    expect(inquirySchema.safeParse({ ...validInput, body: "a".repeat(BODY_MAX + 1) }).success).toBe(false);
  });
  it("reply schema は body 必須", () => {
    expect(replySchema.safeParse({ body: "返信" }).success).toBe(true);
    expect(replySchema.safeParse({ body: "" }).success).toBe(false);
  });
});

describe("createInquiry (U-1, U-E1, U-E5, U-P1)", () => {
  it("U-1: spam pass → thread+message 作成、token 返却", async () => {
    const { deps, threads, messages } = createDeps({ ok: true });
    const res = await createInquiry(validInput, deps);
    expect(res).toEqual({ ok: true, token: "TOK_ABC" });
    expect(threads.create).toHaveBeenCalledWith({ inquirerId: "inq_1", subject: "件名" });
    expect(messages.add).toHaveBeenCalledWith({
      threadId: "th_1",
      sender: "visitor",
      body: "問い合わせ本文です",
    });
  });

  it("U-E1: spam reject → status（rate_limit=429, 他=400）, 理由非開示は呼び出し側で", async () => {
    const r1 = await createInquiry(validInput, createDeps({ ok: false, reason: "turnstile" }).deps);
    expect(r1).toEqual({ ok: false, status: 400, reason: "turnstile" });
    const r2 = await createInquiry(validInput, createDeps({ ok: false, reason: "rate_limit" }).deps);
    expect(r2.ok).toBe(false);
    if (!r2.ok) expect(r2.status).toBe(429);
  });

  it("U-E1: spam reject 時は DB 作成しない", async () => {
    const { deps, threads, messages } = createDeps({ ok: false, reason: "honeypot" });
    await createInquiry(validInput, deps);
    expect(threads.create).not.toHaveBeenCalled();
    expect(messages.add).not.toHaveBeenCalled();
  });

  it("U-E5: 通知が throw してもスレッド作成は成功（best-effort）", async () => {
    const { deps, notifyThreadLink } = createDeps({ ok: true });
    (notifyThreadLink as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("resend down"));
    const res = await createInquiry(validInput, deps);
    expect(res).toEqual({ ok: true, token: "TOK_ABC" });
  });

  it("U-P1: 通知に本文を渡さない（リンクのみ、SEC-001）", async () => {
    const { deps, notifyThreadLink, notifyOperator } = createDeps({ ok: true });
    await createInquiry(validInput, deps);
    // notifyThreadLink(to=email, token) / notifyOperator(threadId) — body は一切渡らない
    expect(notifyThreadLink).toHaveBeenCalledWith("user@example.com", "TOK_ABC");
    expect(notifyOperator).toHaveBeenCalledWith("th_1");
    const allArgs = JSON.stringify([
      ...(notifyThreadLink as ReturnType<typeof vi.fn>).mock.calls,
      ...(notifyOperator as ReturnType<typeof vi.fn>).mock.calls,
    ]);
    expect(allArgs).not.toContain("問い合わせ本文です");
  });
});

describe("addReply (U-3, U-E3, U-E4 — IDOR)", () => {
  function replyDeps(thread: Thread | null) {
    const threads = {
      findByToken: vi.fn(async () => thread),
      touchActivity: vi.fn(async () => {}),
    } as unknown as ThreadRepo;
    const messages = { add: vi.fn(async () => ({ id: "m" })) } as unknown as MessageRepo;
    return { deps: { threads, messages } as AddReplyDeps, threads, messages };
  }

  it("U-3: 有効 token → message 追加 + touchActivity", async () => {
    const { deps, threads, messages } = replyDeps({ id: "th_9" } as Thread);
    const res = await addReply("GOOD_TOKEN", "返信本文", deps);
    expect(res).toEqual({ ok: true });
    expect(messages.add).toHaveBeenCalledWith({ threadId: "th_9", sender: "visitor", body: "返信本文" });
    expect(threads.touchActivity).toHaveBeenCalledWith("th_9");
  });

  it("U-E3/U-E4: 無効/詐称 token は 404（findByToken null、id 経路なし）", async () => {
    const { deps, messages } = replyDeps(null);
    const res = await addReply("WRONG_OR_FORGED", "x", deps);
    expect(res).toEqual({ ok: false, status: 404 });
    expect(messages.add).not.toHaveBeenCalled();
  });
});

describe("storage (U-4)", () => {
  beforeEach(() => window.localStorage.clear());
  it("saveThread が token を保存し重複しない", () => {
    saveThread("T1");
    saveThread("T1");
    saveThread("T2");
    expect(savedThreads()).toEqual(["T1", "T2"]);
  });
});

describe("ThreadView XSS (U-X1)", () => {
  it("<script> 等はエスケープされプレーンテキスト表示（実行されない）", () => {
    const { container } = render(
      <ThreadView messages={[{ id: "1", sender: "visitor", body: "<script>alert(1)</script> & <b>x</b>" }]} />,
    );
    // 本文がテキストとして見える = エスケープ済
    expect(screen.getByText(/<script>alert\(1\)<\/script>/)).toBeInTheDocument();
    // 実際の script / b 要素は生成されない（dangerouslySetInnerHTML 不使用）
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("b")).toBeNull();
  });
});

describe("ContactForm 構造", () => {
  it("honeypot(hidden) + email/body 入力 + 送信ボタン", () => {
    const { container } = render(<ContactForm />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("お問い合わせ内容")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "送信する" })).toBeInTheDocument();
  });
});
