import { StatusCard } from "@/components/status/StatusCard";
import { EmptyState } from "@/components/ui/EmptyState";

// 稼働一覧 component（landing 埋込 + /services）— docs/service-status/001 UC-S1
// 0 件/取得不可は EmptyState（技術詳細を出さない、L-E1/S-E1）。

export interface StatusListItem {
  slug: string;
  name: string;
  url?: string | null;
  status: string;
  since?: string | null;
}

export function StatusList({
  services,
  now,
}: {
  services: StatusListItem[];
  now?: Date;
}) {
  if (services.length === 0) {
    return <EmptyState message="準備中です。動いているサービスをまもなく掲載します。" />;
  }
  return (
    <ul className="flex flex-col gap-3">
      {services.map((s) => (
        <li key={s.slug}>
          <StatusCard service={s} now={now} />
        </li>
      ))}
    </ul>
  );
}
