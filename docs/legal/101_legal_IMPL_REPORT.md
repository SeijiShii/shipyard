# 実装レポート: legal

## 実装日時
2026-05-27 16:17 (JST)

## モード
feature（静的 UI・法務）

## 関連ドキュメント
- [001_legal_SPEC.md](./001_legal_SPEC.md) / [002_…_PLAN.md](./002_legal_PLAN.md) / [003_…_UNIT_TEST.md](./003_legal_UNIT_TEST.md)
- [AI_LOG セッション](../AI_LOG/D20260527_019_tdd_continuous.md)

## 変更一覧

### Phase 1+2: 本文 + ページ
- `features/legal/PrivacyContent.tsx` — プライバシーポリシー本文（取得項目=メール+本文のみ / 利用目的 / 保管 / 第三者提供・外部送信なし / cookieless / 開示請求窓口）
- `features/legal/TermsContent.tsx` — 利用規約本文（利用責任 / 禁止行為 / 免責 / 準拠法）
- `app/legal/privacy/page.tsx` / `app/legal/terms/page.tsx` — SSG + buildMetadata（index 可）+ Header/Footer

### 整合性 reconcile（drift 修正）
- Footer（_shared/ui）と seo `PUBLIC_PATHS` のリンクが `/privacy` `/terms` だったが、legal 設計 SoT は `/legal/privacy` `/legal/terms`。**設計 SoT に合わせて Footer リンク + PUBLIC_PATHS を `/legal/*` に修正**（+ Footer テスト期待値更新）。sitemap/robots も自動追従。

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | Footer/seo の URL drift を legal 設計に合わせて reconcile（/privacy→/legal/privacy）。MDX ではなく静的 React コンテンツ component で実装（SPEC §3「MDX or 静的 React」、@next/mdx 依存を回避し純粋テスト可能） |
| 計画から省略した変更 | route group `(public)` は作らず flat（`app/legal/privacy`, `app/legal/terms`、URL は設計どおり /legal/*）。content/*.mdx は作らず component 化 |
| 想定外の問題 | 法務文面は draft。**公開前に最終確認のうえ施行**（SPEC §8、取得項目=メール+本文のみを再確認）。consent banner / 特商法 / Cookie ポリシーは不要（cookieless・無償、§9.1） |

## PR Description
### タイトル
legal: プライバシーポリシー / 利用規約（/legal/*、cookieless 整合）
### 概要
フッタ導線の法務 2 ページ。取得項目はメール + 本文のみ、Cookie 不使用・外部 AI 送信なしを明記（§6/SEC-001 整合）。index 可。
### 変更内容
- PrivacyContent / TermsContent（静的）+ /legal/privacy・/legal/terms ページ
- Footer/seo の URL を /legal/* に reconcile
### テスト
- 単体 5 件、全 GREEN。全体 136/136（100%）、typecheck クリーン。内容整合（cookieless/外部AI送信なし/取得項目）+ index 可を検証。文面は公開前に最終確認。
