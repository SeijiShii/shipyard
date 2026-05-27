import { Button } from "@/components/ui/button";

// コンサル打ち出し + CTA→/contact（charter §2.2 煽らない / O31）。
export function ConsultPitch() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h2 className="text-2xl font-semibold text-ink">AI 駆動開発のご相談</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">
        これらのサービスは AI を活用した開発で、週1ペースで作っています。
        同じような開発や仕組みづくりについて、お気軽にご相談ください。
      </p>
      <div className="mt-6">
        <a href="/contact">
          <Button variant="secondary">お問い合わせへ</Button>
        </a>
      </div>
    </section>
  );
}
