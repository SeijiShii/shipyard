// プライバシーポリシー本文 — docs/legal/001 §9 / concept §6 / SEC-001
// 取得項目はメール + お問い合わせ本文のみ。Cookie を使わず、本文を外部 AI に送らない。
// ※ 公開前に最終確認のうえ施行（SPEC §8）。
export function PrivacyContent() {
  return (
    <div className="flex flex-col gap-6 leading-relaxed text-ink">
      <p className="text-ink-muted">
        本サイト（shipyard）における個人情報の取り扱いについて、以下のとおり定めます。
      </p>

      <section>
        <h2 className="text-lg font-semibold">取得する情報</h2>
        <p className="mt-1 text-ink-muted">
          お問い合わせの際にいただく <strong>メールアドレス</strong> と{" "}
          <strong>お問い合わせ本文</strong> のみを取得します。これら以外の個人情報（氏名・住所・電話番号など）は取得しません。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">利用目的</h2>
        <p className="mt-1 text-ink-muted">
          いただいた情報は、お問い合わせへの対応のためにのみ利用します。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">保管期間</h2>
        <p className="mt-1 text-ink-muted">
          対応の完了後、保管の必要がなくなった時点で適切に削除します。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">第三者提供・外部送信</h2>
        <p className="mt-1 text-ink-muted">
          法令に基づく場合を除き、第三者へ提供することはありません。また、お問い合わせ本文を
          外部の AI サービスへ送信することはありません。メール通知のための送信を除き、入力内容を
          外部サービスへ共有しません。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">アクセス解析（Cookie を使いません）</h2>
        <p className="mt-1 text-ink-muted">
          本サイトは Cookie による追跡や広告を行いません。アクセス解析を行う場合も、Cookie を使わない
          方式（cookieless）で、個人を特定しません。
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">開示・訂正・削除のご請求</h2>
        <p className="mt-1 text-ink-muted">
          ご自身の情報の開示・訂正・削除をご希望の場合は、お問い合わせフォームよりご連絡ください。
        </p>
      </section>
    </div>
  );
}
