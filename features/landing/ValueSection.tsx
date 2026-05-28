import { valueSectionCopy } from "./copy";

// 提供価値セクション — concept §1.1。誠実・控えめ（煽らない）。
// コピーは ./copy.ts に集約 (revise_messaging-shift_20260528、3 つ目の項目で「共に考える」スタンスを担う)。
export function ValueSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="grid gap-6 sm:grid-cols-3">
        {valueSectionCopy.map((v) => (
          <div key={v.title}>
            <h3 className="font-semibold text-ink">{v.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{v.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
