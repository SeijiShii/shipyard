import { getRepos } from "@/lib/db/repositories";
import { loadStatusSafe } from "@/lib/service-status/load";
import { StatusList } from "@/features/service-status/StatusList";
import { newestFetchedAt } from "@/lib/service-status/syncedAt";
import { buildMetadata } from "@/lib/seo/metadata";

// /services — 稼働一覧ページ（cache のみ、HUB を叩かない）。DB 不可でも EmptyState（S-E1）。
export const metadata = buildMetadata({ title: "稼働状況", path: "/services" });
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const rows = await loadStatusSafe(() => getRepos().statusCache);
  const syncedAt = newestFetchedAt(rows);
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-ink">稼働状況</h1>
      <p className="mt-2 text-ink-muted">いま動いているサービスの様子です。</p>
      <div className="mt-8">
        <StatusList services={rows} syncedAt={syncedAt} />
      </div>
    </main>
  );
}
