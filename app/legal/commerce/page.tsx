import { buildMetadata } from "@/lib/seo/metadata";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommerceContent } from "@/features/legal/CommerceContent";

// /legal/commerce — 特定商取引法に基づく表記（SSG、index 可）。Stripe 事業者審査の提示先。
export const metadata = buildMetadata({
  title: "特定商取引法に基づく表記",
  description:
    "QUADii（givers.work）の特定商取引法に基づく表記。事業者情報・料金・お支払い方法・返金について。",
  path: "/legal/commerce",
});

export default function CommercePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-ink">
          特定商取引法に基づく表記
        </h1>
        <div className="mt-8">
          <CommerceContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
