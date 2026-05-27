// 利用規約本文 — docs/legal/001 §9。※ 公開前に最終確認のうえ施行（SPEC §8）。
export function TermsContent() {
  return (
    <div className="flex flex-col gap-6 leading-relaxed text-ink">
      <p className="text-ink-muted">
        本サイト（shipyard）のご利用にあたっては、以下の規約に同意いただいたものとみなします。
      </p>

      <section>
        <h2 className="text-lg font-semibold">お問い合わせ利用上の責任</h2>
        <p className="mt-1 text-ink-muted">
          お問い合わせフォームは、適切な目的の範囲でご利用ください。いただいた内容には可能な範囲で対応します。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">禁止行為</h2>
        <p className="mt-1 text-ink-muted">
          法令に違反する行為、他者の権利を侵害する行為、サイトの運営を妨げる行為、不正アクセスや
          スパム送信などはお控えください。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">免責</h2>
        <p className="mt-1 text-ink-muted">
          本サイトに掲載する稼働状況などの情報は、正確性・最新性を保証するものではありません。
          ご利用により生じた損害について、運営者は責任を負いかねます。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">準拠法</h2>
        <p className="mt-1 text-ink-muted">
          本規約は日本法に準拠し、解釈されるものとします。
        </p>
      </section>
    </div>
  );
}
