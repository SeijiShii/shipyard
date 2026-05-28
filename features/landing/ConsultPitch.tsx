import { Button } from "@/components/ui/button";
import { consultPitchCopy } from "./copy";

// コンサル打ち出し + CTA→/contact（charter §2.2 煽らない / O31）。
// コピーは ./copy.ts に集約 (revise_messaging-shift_20260528「共に考える」スタンス、/flow:wording で仕上げ)。
export function ConsultPitch() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <h2 className="text-2xl font-semibold text-ink">{consultPitchCopy.heading}</h2>
      <p className="mt-3 leading-relaxed text-ink-muted">{consultPitchCopy.body}</p>
      <div className="mt-6">
        <a href="/contact">
          <Button variant="secondary">{consultPitchCopy.cta}</Button>
        </a>
      </div>
    </section>
  );
}
