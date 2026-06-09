// 特定商取引法に基づく表記 本文 — docs/legal/revise_tokushoho-stripe_20260610/001_REVISE_SPEC.md §7.6
// 業態: 公開済みマイクロサービスへの「作者応援寄付」+ 一部サービスの有料「追加オプション」販売（単発のみ、サブスクなし）。
// ※ 事業者の屋号・所在地・電話・メールは特商法の法定公開項目であり、SEC-001 (PII 秘匿) の対象外（特商法が公開を要求する情報）。
// ※ 公開前に最終確認のうえ施行（SPEC §9 未決事項）。

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-border py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="font-medium text-ink">{label}</dt>
      <dd className="text-ink-muted">{children}</dd>
    </div>
  );
}

export function CommerceContent() {
  return (
    <div className="flex flex-col gap-8 leading-relaxed text-ink">
      <p className="text-ink-muted">
        特定商取引法に基づき、以下のとおり表示します。
      </p>

      <section>
        <h2 className="text-lg font-semibold">販売事業者</h2>
        <dl className="mt-2">
          <Row label="事業者名（屋号）">QUADii</Row>
          <Row label="代表者">四伊清司</Row>
          <Row label="所在地">
            〒101-0024 東京都千代田区神田和泉町1番地6-16 ヤマトビル405
          </Row>
          <Row label="電話番号">050-1792-0316</Row>
          <Row label="メールアドレス">quadii.shii@gmail.com</Row>
          <Row label="お問い合わせ">
            <a href="/contact" className="underline hover:text-ink">
              お問い合わせフォーム
            </a>
          </Row>
        </dl>
      </section>

      <section>
        <h2 className="text-lg font-semibold">サービス内容・料金</h2>
        <dl className="mt-2">
          <Row label="サービス内容">
            運営者が公開している各種 Web サービス（マイクロサービス）の提供。ならびに、公開済みサービスに対する
            <strong>作者応援寄付</strong>の受付、および一部サービスにおける有料の
            <strong>追加オプション</strong>の販売です。第三者のプロジェクトを仲介するものではなく、運営者自身のサービスに関するものです。
          </Row>
          <Row label="作者応援寄付の金額">
            支援者が任意に選択した金額（可変）。決済前の最終確認画面に表示されます。寄付に対する物品・役務等のリターンはありません（未公開サービスへ出資する
            クラウドファンディングではありません。公開済みサービスへの任意の応援です）。
          </Row>
          <Row label="追加オプションの価格">
            各サービスのページに、税込価格で表示します。
          </Row>
          <Row label="商品代金以外の必要料金">
            なし（インターネット接続料・通信料はお客様のご負担となります）。運営手数料はいただきません。
          </Row>
          <Row label="お支払い方法">
            クレジットカード・デビットカード（Stripe 経由）。
          </Row>
          <Row label="お支払い時期">
            その都度の決済（単発）です。決済時に即時お支払いいただきます。
          </Row>
          <Row label="提供時期">
            追加オプション: 決済完了後すみやかに有効化します。作者応援寄付: 対価提供を伴わない任意の応援のため、決済完了をもって受付完了となります。
          </Row>
          <Row label="動作環境">本サービスは Web ブラウザ上で提供されます。</Row>
        </dl>
      </section>

      <section>
        <h2 className="text-lg font-semibold">キャンセル・返金について</h2>
        <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-ink-muted">
          <li>
            追加オプション等のデジタルサービスは、その性質上、提供開始後の返金は原則としてお受けできません。
          </li>
          <li>
            決済の過誤・重複、または提供に重大な不具合があった場合は、お問い合わせフォームよりご連絡ください。確認のうえ、
            Stripe を通じて返金等の対応を行います。
          </li>
          <li>
            作者応援寄付は任意の応援であり、原則として返金の対象外です（誤決済・重複の場合は上記に準じて対応します）。
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">その他</h2>
        <p className="mt-2 text-ink-muted">
          本表記は運営者（QUADii）に関するものです。詳細については
          <a href="/legal/terms" className="underline hover:text-ink">
            利用規約
          </a>
          および
          <a href="/legal/privacy" className="underline hover:text-ink">
            プライバシーポリシー
          </a>
          をご参照ください。
        </p>
      </section>
    </div>
  );
}
