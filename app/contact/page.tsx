import { buildMetadata } from "@/lib/seo/metadata";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/features/inquiry/ContactForm";

// /contact — 問い合わせフォーム（landing CTA の遷移先）。
export const metadata = buildMetadata({ title: "お問い合わせ", path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold text-ink">お問い合わせ</h1>
        <p className="mt-2 text-ink-muted">
          ご相談・ご質問はこちらから。送信後、このページからやり取りを続けられます。
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
