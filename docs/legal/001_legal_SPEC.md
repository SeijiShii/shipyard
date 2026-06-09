# legal 機能仕様書

> **役割**: プライバシーポリシー / 利用規約の公開ページ。フッタから導線。
> **タグ**: feature
> **最終更新**: 2026-05-27
> **入力**: `../concept.md` §9 法務 / §3.7 SEC-001 / §6, `../_shared/{ui,seo}/001_*`, `./README.md`

---

## 1. 詳細 UC

### UC-LG1: プライバシーポリシーを読む（concept §9.1 必須）
- **トリガー**: フッタ「プライバシーポリシー」or `/legal/privacy`
- **処理**: 静的コンテンツ表示（取得項目=メール+本文 / 利用目的 / 保管期間 / 第三者提供 / 開示・削除請求窓口 / cookieless アナリティクス利用 / 外部送信 = なし）
- **出力**: 読みやすい長文（design SoT body 16px/1.7）

### UC-LG2: 利用規約を読む（concept §9.1 推奨）
- **トリガー**: フッタ「利用規約」or `/legal/terms`
- **処理**: 静的（問い合わせ利用上の責任 / 免責 / 禁止行為 / 準拠法）

## 2. 入出力
| パス | 種別 | 内容 |
|---|---|---|
| `/legal/privacy` | SSG | プライバシーポリシー |
| `/legal/terms` | SSG | 利用規約 |
副作用なし（表示のみ）。

## 3. データモデル
なし。コンテンツは MDX or 静的 React（`docs/legal/` の原稿を起点）。

## 4. バリデーション + エラーケース
なし（静的）。404 は Next.js デフォルト。

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| 内容整合 | §9.2 個人情報保護法 / §6 cookieless / SEC-001 と矛盾しない | concept §9 |
| SEO | index 可（公開ページ）、buildMetadata（seo） | §9.3 |
| 導線 | フッタ（全ページ、_shared/ui Footer） | §9.3 |
- 連携: _shared/ui（Footer リンク）/ _shared/seo（metadata）。
- **特商法表記 (2026-06-10 追加, revise tokushoho-stripe)**: 当初「不要」としたが、業態整合により `/legal/commerce` を新設（作者応援寄付 + 有料追加オプション、Stripe 審査提示先）。詳細仕様は `revise_tokushoho-stripe_20260610/001_REVISE_SPEC.md`、UC-LG3 として追加。

## 6. タグ別追加
feature（静的 UI）。consent banner 不要（cookieless、§6）。

## 7. スコープ外
- ~~特定商取引法表記~~ → **2026-06-10 スコープ内化** (revise tokushoho-stripe、`/legal/commerce`)
- Cookie ポリシー（cookieless のため不要、§9.1）
- 多言語（特商法 EN 版は別 revise、§論点-002）

## 8. 未決事項
現時点で論点なし (2026-05-27)。
> 文面は §9.3 テンプレ + 自前ドラフト。公開前に最終確認（個人情報取得項目 = メール + 本文のみ）。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
