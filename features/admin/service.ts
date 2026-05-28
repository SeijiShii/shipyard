import type { ThreadRepo } from "@/lib/db/repositories/thread";
import type { MessageRepo } from "@/lib/db/repositories/message";
import type { InquirerRepo } from "@/lib/db/repositories/inquirer";

// admin の返信/クローズ中核（テスト可能・DI）— docs/admin/001 UC-A2/A3
// 認可（Clerk + allowlist = requireOperator）は route 側。本サービスは認可済の操作を担う。

export interface AdminReplyDeps {
  threads: ThreadRepo;
  messages: MessageRepo;
  inquirers: InquirerRepo;
  // 返信通知 ([論点-006] 案 c、本人宛=SEC-001 対象外で運用者返信本文を含める、D20260528_017)。best-effort。
  notifyReply: (to: string, token: string, body: string) => Promise<unknown>;
}

export type AdminReplyResult = { ok: true } | { ok: false; status: 404 };

export async function adminReply(
  threadId: string,
  body: string,
  deps: AdminReplyDeps,
): Promise<AdminReplyResult> {
  const thread = await deps.threads.findById(threadId); // admin = id 経由（認証済）
  if (!thread) return { ok: false, status: 404 }; // A-E4
  await deps.messages.add({ threadId: thread.id, sender: "operator", body });
  await deps.threads.touchActivity(thread.id);
  // 返信通知（問い合わせ者へ、リンクのみ・best-effort、A-E5）
  const inquirer = await deps.inquirers.findById(thread.inquirerId);
  if (inquirer?.email) {
    try {
      await deps.notifyReply(inquirer.email, thread.token, body);
    } catch {
      /* best-effort: メール失敗で返信追加を巻き込まない */
    }
  }
  return { ok: true };
}

export interface AdminCloseDeps {
  threads: ThreadRepo;
}
export type AdminCloseResult = { ok: true } | { ok: false; status: 404 };

export async function adminClose(
  threadId: string,
  deps: AdminCloseDeps,
): Promise<AdminCloseResult> {
  const thread = await deps.threads.findById(threadId);
  if (!thread) return { ok: false, status: 404 };
  await deps.threads.setStatus(thread.id, "closed"); // UC-A3 stateful
  return { ok: true };
}
