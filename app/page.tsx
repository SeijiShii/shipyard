import { getRepos } from "@/lib/db/repositories";
import { loadStatusSafe } from "@/lib/service-status/load";
import { buildMetadata } from "@/lib/seo/metadata";
import { websiteJsonLd, personJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StatusList } from "@/features/service-status/StatusList";
import { newestFetchedAt } from "@/lib/service-status/syncedAt";
import { Hero } from "@/features/landing/Hero";
import { ValueSection } from "@/features/landing/ValueSection";
import { ConsultPitch } from "@/features/landing/ConsultPitch";

// トップ（LP）— docs/landing/001。ヒーロー → 稼働一覧 → 価値 → コンサル。
export const metadata = buildMetadata({ path: "/" });
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 稼働一覧は cache のみ（HUB を叩かない）。DB 不可でも EmptyState で graceful（L-E1）。
  const services = await loadStatusSafe(() => getRepos().statusCache);
  const syncedAt = newestFetchedAt(services);
  return (
    <>
      <JsonLd data={[websiteJsonLd(), personJsonLd()]} />
      <Header />
      <main>
        <Hero />
        <section className="mx-auto max-w-3xl px-6 py-8">
          <h2 className="mb-4 text-xl font-semibold text-ink">
            いま動いているサービス
          </h2>
          <StatusList services={services} syncedAt={syncedAt} />
        </section>
        <ValueSection />
        <ConsultPitch />
      </main>
      <Footer />
    </>
  );
}
