import { buildMetadata } from "@/lib/seo/metadata";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TermsContent } from "@/features/legal/TermsContent";

// /legal/terms — 利用規約（SSG、index 可）。
export const metadata = buildMetadata({
  title: "利用規約",
  description: "givers.work の利用規約。禁止行為・免責・準拠法について。",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-ink">利用規約</h1>
        <div className="mt-8">
          <TermsContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
