import { Button } from "@/components/ui/button";
import { heroCopy } from "./copy";

// ヒーロー（リード文 + CTA、O41 入口理解）— design SoT §7。
// コピーは ./copy.ts に集約 (revise_messaging-shift_20260528、文言仕上げは /flow:wording)。
export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="text-4xl font-semibold leading-tight text-ink">
        {heroCopy.heading}
      </h1>
      <p className="mt-4 text-lg text-ink-muted">{heroCopy.lead}</p>
      <div className="mt-8">
        <a href="/contact">
          <Button variant="primary">{heroCopy.cta}</Button>
        </a>
      </div>
    </section>
  );
}
