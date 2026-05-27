// 提供価値セクション — concept §1.1。誠実・控えめ（煽らない）。
const VALUES = [
  {
    title: "実際に動いている",
    body: "見せかけではなく、いま動いているサービスをそのまま公開しています。",
  },
  {
    title: "週1ペースのものづくり",
    body: "小さく作って公開する、を続けています。",
  },
  {
    title: "相談できる",
    body: "開発や仕組みづくりのご相談を受け付けています。",
  },
];

export function ValueSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      <div className="grid gap-6 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title}>
            <h3 className="font-semibold text-ink">{v.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{v.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
