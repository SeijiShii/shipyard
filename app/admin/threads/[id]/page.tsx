import { notFound } from "next/navigation";
import { getRepos } from "@/lib/db/repositories";
import { ThreadView } from "@/features/inquiry/ThreadView";
import { AdminThreadActions } from "@/features/admin/AdminThreadActions";

// /admin/threads/[id] — スレッド詳細 + 返信 + クローズ。認可は layout（requireOperator）。
export const dynamic = "force-dynamic";

export default async function AdminThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const repos = getRepos();
  const thread = await repos.threads.findById(id); // admin = id 経由（認証済）
  if (!thread) notFound(); // A-E4
  const messages = await repos.messages.listByThread(thread.id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold text-ink">{thread.subject ?? "（件名なし）"}</h1>
        <span className="text-sm text-ink-muted">
          {thread.status === "closed" ? "完了" : "対応中"}
        </span>
      </div>
      <div className="mt-6">
        <ThreadView messages={messages} />
      </div>
      <AdminThreadActions threadId={thread.id} status={thread.status} />
    </main>
  );
}
