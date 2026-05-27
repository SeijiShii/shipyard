import { Button } from "@/components/ui/button";

// ヒーロー（リード文 + CTA、O41 入口理解）— design SoT §7。文言は /flow:wording で仕上げ。
export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-4xl font-semibold leading-tight text-ink">
        週1ペースで作っている、動いているサービスたち
      </h1>
      <p className="mt-4 text-lg text-ink-muted">
        個人開発のマイクロサービスの今をまとめた場所です。AI 駆動開発のご相談も承ります。
      </p>
      <div className="mt-8">
        <a href="/contact">
          <Button variant="primary">ご相談はこちら</Button>
        </a>
      </div>
    </section>
  );
}
