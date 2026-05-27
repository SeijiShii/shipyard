import { siteUrl } from "@/lib/seo/config";
import type { Mailer, EmailMessage } from "./client";
import { maskEmail } from "./util";
import { threadLinkEmail } from "./templates/threadLink";
import { replyNotificationEmail } from "./templates/replyNotification";
import { newInquiryEmail } from "./templates/newInquiry";

// メール送信オーケストレーション — docs/_shared/email/001_email_SPEC.md
// best-effort: 失敗しても例外を投げず result を返す（呼び出し側=スレッド作成を巻き込まない、§5.2）。

const RETRIES = 1; // 1 回リトライ（初回 + 1 = 最大 2 試行、MAIL-E1）

export type EmailResult = { ok: true; id: string } | { ok: false; error: string };

export interface SendDeps {
  mailer: Mailer;
  from?: string;
  operatorEmail?: string;
}

function from(deps: SendDeps): string {
  return deps.from ?? process.env.MAIL_FROM ?? "shipyard <noreply@shipyard.example.com>";
}

async function deliver(mailer: Mailer, msg: EmailMessage): Promise<EmailResult> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const { id } = await mailer.send(msg);
      return { ok: true, id };
    } catch (err) {
      lastErr = err;
    }
  }
  // 失敗はマスクした error を返す（ログにメアド平文を出さない、U-P2）。
  const message = lastErr instanceof Error ? lastErr.message : String(lastErr);
  return { ok: false, error: maskEmail(message) };
}

export async function sendThreadLink(
  deps: SendDeps,
  { to, token, isNew }: { to: string; token: string; isNew: boolean },
): Promise<EmailResult> {
  const url = `${siteUrl()}/t/${token}`;
  const { subject, html, text } = threadLinkEmail({ url, isNew });
  return deliver(deps.mailer, { from: from(deps), to, subject, html, text });
}

export async function sendReplyNotification(
  deps: SendDeps,
  { to, token }: { to: string; token: string },
): Promise<EmailResult> {
  const url = `${siteUrl()}/t/${token}`;
  const { subject, html, text } = replyNotificationEmail({ url });
  return deliver(deps.mailer, { from: from(deps), to, subject, html, text });
}

export async function sendNewInquiryNotification(
  deps: SendDeps,
  { threadId }: { threadId: string },
): Promise<EmailResult> {
  const operator = deps.operatorEmail ?? process.env.OPERATOR_EMAIL ?? "";
  const adminUrl = `${siteUrl()}/admin/threads/${threadId}`;
  const { subject, html, text } = newInquiryEmail({ adminUrl });
  return deliver(deps.mailer, { from: from(deps), to: operator, subject, html, text });
}
