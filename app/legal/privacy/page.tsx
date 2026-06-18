import { buildMetadata } from "@/lib/seo/metadata";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PrivacyContent } from "@/features/legal/PrivacyContent";

// /legal/privacy — プライバシーポリシー（SSG、index 可）。
export const metadata = buildMetadata({
  title: "プライバシーポリシー",
  description:
    "givers.work のプライバシーポリシー。取得する情報・利用目的・Cookie 不使用について。",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-ink">
          プライバシーポリシー
        </h1>
        <div className="mt-8">
          <PrivacyContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
