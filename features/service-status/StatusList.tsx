import { StatusCard } from "@/components/status/StatusCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatSyncedAt } from "@/lib/service-status/syncedAt";

// 稼働一覧 component（landing 埋込 + /services）— docs/service-status/001 UC-S1
// 0 件/取得不可は EmptyState（技術詳細を出さない、L-E1/S-E1）。
// revise_C20260608-001: 最終同期日時を「{日時}現在」形式で表示（0 件時は非表示）。

export interface StatusListItem {
  slug: string;
  name: string;
  url?: string | null;
  status: string;
  since?: string | null;
  iconUrl?: string | null; // service-icons revise (passthrough to StatusCard、表示集約は StatusCard)
  summary?: string | null; // summary-projection [論点-010] (passthrough to StatusCard)
}

export function StatusList({
  services,
  now,
  syncedAt,
}: {
  services: StatusListItem[];
  now?: Date;
  syncedAt?: Date | string | null;
}) {
  if (services.length === 0) {
    return (
      <EmptyState message="準備中です。動いているサービスをまもなく掲載します。" />
    );
  }
  const syncedDate =
    syncedAt == null
      ? null
      : syncedAt instanceof Date
        ? syncedAt
        : new Date(syncedAt);
  const syncedLabel = formatSyncedAt(syncedDate);
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col gap-3">
        {services.map((s) => (
          <li key={s.slug}>
            <StatusCard service={s} now={now} />
          </li>
        ))}
      </ul>
      {syncedLabel && (
        <p className="text-right text-xs text-ink-muted">{syncedLabel}</p>
      )}
    </div>
  );
}
