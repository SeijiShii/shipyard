import { EmptyState } from "@/components/ui/EmptyState";

// admin スレッド一覧 — docs/admin/001 UC-A1（last_activity 降順は repo 側）。
export interface ThreadListItem {
  id: string;
  subject: string | null;
  status: string; // 'open' | 'closed'
  lastActivityAt: Date | string;
}

function fmt(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("ja-JP");
}

function ThreadStatusTag({ status }: { status: string }) {
  const closed = status === "closed";
  return (
    <span
      className={`rounded-sm px-2 py-0.5 text-xs ${
        closed
          ? "bg-surface-subtle text-ink-muted"
          : "bg-primary-subtle text-ink"
      }`}
    >
      {closed ? "完了" : "対応中"}
    </span>
  );
}

export function ThreadList({ threads }: { threads: ThreadListItem[] }) {
  if (threads.length === 0) {
    return <EmptyState message="まだお問い合わせはありません。" />;
  }
  return (
    <ul className="flex flex-col gap-2">
      {threads.map((t) => (
        <li key={t.id}>
          <a
            href={`/admin/threads/${t.id}`}
            className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <span className="font-medium text-ink">
              {t.subject ?? "（件名なし）"}
            </span>
            <span className="ml-auto flex items-center gap-3">
              <span className="text-xs text-ink-muted">
                {fmt(t.lastActivityAt)}
              </span>
              <ThreadStatusTag status={t.status} />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
