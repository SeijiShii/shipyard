import type { VerifyResult } from "@/lib/spam/verify";
import type { InquirerRepo } from "@/lib/db/repositories/inquirer";
import type { ThreadRepo } from "@/lib/db/repositories/thread";
import type { MessageRepo } from "@/lib/db/repositories/message";

// 問い合わせの中核オーケストレーション（テスト可能・DI）— docs/inquiry/001 UC-I1/I2
// SEC-001 PII: 本文・メアドをログ/メール本文に出さない（通知はリンクのみ）。
// SEC-002 IDOR: thread アクセスは token 検証経由のみ（連番 id を使わない）。

export interface VerifyArgs {
  turnstileToken: string;
  honeypot: string;
  formRenderedAt: number;
  ip: string;
  email: string;
  body: string;
}

export interface CreateInquiryInput {
  email: string;
  body: string;
  subject?: string;
  honeypot: string;
  formRenderedAt: number;
  turnstileToken: string;
  ip: string;
}

export interface CreateInquiryDeps {
  verify: (args: VerifyArgs) => Promise<VerifyResult>;
  inquirers: InquirerRepo;
  threads: ThreadRepo;
  messages: MessageRepo;
  notifyThreadLink: (to: string, token: string) => Promise<unknown>;
  notifyOperator: (threadId: string) => Promise<unknown>;
}

export type CreateInquiryResult =
  | { ok: true; token: string }
  | { ok: false; status: 400 | 429; reason: string };

export async function createInquiry(
  input: CreateInquiryInput,
  deps: CreateInquiryDeps,
): Promise<CreateInquiryResult> {
  // 1. 不可視スパム対策（5 段）
  const v = await deps.verify({
    turnstileToken: input.turnstileToken,
    honeypot: input.honeypot,
    formRenderedAt: input.formRenderedAt,
    ip: input.ip,
    email: input.email,
    body: input.body,
  });
  if (!v.ok) {
    // 理由はユーザーに開示しない（I-E1）。rate limit のみ 429、他は 400。
    return { ok: false, status: v.reason === "rate_limit" ? 429 : 400, reason: v.reason };
  }

  // 2. DB（inquirer → thread[token] → message[visitor]）。token は threadRepo が spam.generateThreadToken で生成。
  const { id: inquirerId } = await deps.inquirers.upsertByEmail(input.email);
  const { id: threadId, token } = await deps.threads.create({
    inquirerId,
    subject: input.subject ?? null,
  });
  await deps.messages.add({ threadId, sender: "visitor", body: input.body });

  // 3. 通知（best-effort、リンクのみ＝本文を載せない）。失敗してもスレッド作成を巻き込まない（§5.2）。
  try {
    await deps.notifyThreadLink(input.email, token);
  } catch {
    /* best-effort */
  }
  try {
    await deps.notifyOperator(threadId);
  } catch {
    /* best-effort */
  }

  return { ok: true, token };
}

export interface AddReplyDeps {
  threads: ThreadRepo;
  messages: MessageRepo;
}

export type AddReplyResult = { ok: true } | { ok: false; status: 404 };

export async function addReply(
  token: string,
  body: string,
  deps: AddReplyDeps,
): Promise<AddReplyResult> {
  // SEC-002 IDOR: token 一致のみが到達経路。無効/不在/詐称は一律 404（列挙耐性）。
  const thread = await deps.threads.findByToken(token);
  if (!thread) return { ok: false, status: 404 };
  await deps.messages.add({ threadId: thread.id, sender: "visitor", body });
  await deps.threads.touchActivity(thread.id);
  return { ok: true };
}
