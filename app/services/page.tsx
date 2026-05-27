import { getRepos } from "@/lib/db/repositories";
import { getCachedStatus } from "@/lib/hub/cache";
import { StatusList } from "@/features/service-status/StatusList";
import { buildMetadata } from "@/lib/seo/metadata";

// /services — 稼働一覧ページ（cache のみ、HUB を叩かない）。
export const metadata = buildMetadata({ title: "稼働状況", path: "/services" });
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const rows = await getCachedStatus({ repo: getRepos().statusCache });
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-ink">稼働状況</h1>
      <p className="mt-2 text-ink-muted">いま動いているサービスの様子です。</p>
      <div className="mt-8">
        <StatusList services={rows} />
      </div>
    </main>
  );
}
