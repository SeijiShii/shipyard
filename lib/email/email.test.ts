import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Mailer, EmailMessage } from "./client";
import { maskEmail } from "./util";
import {
  sendThreadLink,
  sendReplyNotification,
  sendNewInquiryNotification,
} from "./send";

// docs/_shared/email/003_email_UNIT_TEST.md — injectable Resend mock + PII 非混入（実キー不要）

const origSiteUrl = process.env.SITE_URL;
beforeEach(() => {
  process.env.SITE_URL = "https://shipyard.test";
});
afterEach(() => {
  process.env.SITE_URL = origSiteUrl;
  vi.restoreAllMocks();
});

function mockMailer(impl?: (msg: EmailMessage) => Promise<{ id: string }>): {
  mailer: Mailer;
  send: ReturnType<typeof vi.fn>;
} {
  const send = vi.fn(impl ?? (async () => ({ id: "msg_1" })));
  return { mailer: { send }, send };
}

const INQUIRY_BODY = "ここに問い合わせ本文が入る（漏れてはいけない）";

describe("sendThreadLink (U-1)", () => {
  it("正しい to/subject/リンク(/t/{token})で送信、isNew で文言差", async () => {
    const { mailer, send } = mockMailer();
    const res = await sendThreadLink(
      { mailer, from: "shipyard <no@shipyard.test>" },
      { to: "user@example.com", token: "TKN123", isNew: true },
    );
    expect(res).toEqual({ ok: true, id: "msg_1" });
    const msg = send.mock.calls[0][0] as EmailMessage;
    expect(msg.to).toBe("user@example.com");
    expect(msg.subject).toBe("お問い合わせを受け付けました");
    expect(msg.html).toContain("https://shipyard.test/t/TKN123");
    expect(msg.text).toContain("https://shipyard.test/t/TKN123");

    const { mailer: m2, send: s2 } = mockMailer();
    await sendThreadLink(
      { mailer: m2 },
      { to: "u@e.com", token: "T2", isNew: false },
    );
    expect((s2.mock.calls[0][0] as EmailMessage).subject).toBe(
      "お問い合わせのスレッド",
    );
  });
});

describe("sendReplyNotification (U-2, U-P1)", () => {
  it("リンクのみ、本文プレビュー非含有", async () => {
    const { mailer, send } = mockMailer();
    await sendReplyNotification(
      { mailer },
      { to: "user@example.com", token: "RT9" },
    );
    const msg = send.mock.calls[0][0] as EmailMessage;
    expect(msg.subject).toBe("返信が届きました");
    expect(msg.html).toContain("/t/RT9");
    expect(msg.html).not.toContain(INQUIRY_BODY);
    expect(msg.text).not.toContain(INQUIRY_BODY);
  });
});

describe("sendNewInquiryNotification (U-3)", () => {
  it("宛先=OPERATOR_EMAIL、admin リンク、本文/メアド最小限", async () => {
    const { mailer, send } = mockMailer();
    await sendNewInquiryNotification(
      { mailer, operatorEmail: "ops@shipyard.test" },
      { threadId: "th_42" },
    );
    const msg = send.mock.calls[0][0] as EmailMessage;
    expect(msg.to).toBe("ops@shipyard.test");
    expect(msg.html).toContain("/admin/threads/th_42");
    expect(msg.html).not.toContain(INQUIRY_BODY);
    // 問い合わせ者のメアドは含めない
    expect(msg.html).not.toContain("@example.com");
  });
});

describe("リトライと best-effort (U-E1, U-E2)", () => {
  it("U-E1: 1 回リトライ後に成功", async () => {
    const send = vi
      .fn<(msg: EmailMessage) => Promise<{ id: string }>>()
      .mockRejectedValueOnce(new Error("rate limited"))
      .mockResolvedValue({ id: "ok_after_retry" });
    const res = await sendThreadLink(
      { mailer: { send } },
      { to: "u@e.com", token: "T", isNew: true },
    );
    expect(res).toEqual({ ok: true, id: "ok_after_retry" });
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("U-E1/E2: 全失敗でも例外を投げず ok:false を返す（呼び出し側を巻き込まない）", async () => {
    const send = vi.fn(async () => {
      throw new Error("resend down");
    });
    const res = await sendThreadLink(
      { mailer: { send } },
      { to: "u@e.com", token: "T", isNew: true },
    );
    expect(res.ok).toBe(false);
    expect(send).toHaveBeenCalledTimes(2); // 初回 + 1 リトライ
  });
});

describe("PII マスク (U-P2)", () => {
  it("maskEmail がメアド平文を伏せる", () => {
    expect(maskEmail("send to alice@example.com failed")).toBe(
      "send to [email] failed",
    );
  });

  it("失敗 error にメアドが含まれてもマスクされる", async () => {
    const send = vi.fn(async () => {
      throw new Error("bounce for victim@example.com");
    });
    const res = await sendReplyNotification(
      { mailer: { send } },
      { to: "victim@example.com", token: "T" },
    );
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).not.toContain("@example.com");
      expect(res.error).toContain("[email]");
    }
  });
});
