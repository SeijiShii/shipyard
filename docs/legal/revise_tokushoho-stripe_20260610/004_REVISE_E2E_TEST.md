# legal E2E テスト計画（特商法表記の追加 + 業態整合）

> **入力**: `./001_REVISE_SPEC.md`, `../../concept.md` §1.1, 既存 `../../004_legal_E2E_TEST.md`
> **最終更新**: 2026-06-10
> **備考**: shipyard の E2E は [論点-005]（Playwright scaffold）により post-release / 機能担保は unit + 本番疎通で代替する方針（SCENARIO Phase 5）。本書は scaffold 整備時 or 手動スモークの観点定義。

---

## 1. 変更 UC シナリオ

### UC-LG3: 特定商取引法に基づく表記を読む
| シナリオ ID | 前提 | 操作ステップ | 期待結果 |
|---|---|---|---|
| E-CM1 | 公開・未認証 | 任意ページのフッタ「特定商取引法に基づく表記」をクリック | `/legal/commerce` に遷移し、事業者情報（QUADii / 四伊清司 / 住所 / 連絡先）と料金・支払・返金が表示される |
| E-CM2 | 公開・未認証 | `/legal/commerce` に直アクセス | 200 表示、Header/Footer あり、noindex でない |
| E-CM3 | （手動スモーク） | 本番 `https://shipyard.givers.work/legal/commerce` を表示 | Stripe 審査担当が閲覧可能な状態で全項目表示 |

## 2. リグレッションシナリオ（既存 UC、重要度高）

| UC | シナリオ ID | 確認観点 |
|---|---|---|
| UC-LG1 | E-RG1 | フッタ「プライバシー」→ `/legal/privacy` 表示が維持 |
| UC-LG2 | E-RG2 | フッタ「利用規約」→ `/legal/terms` 表示が維持 |
| 全ページ | E-RG3 | フッタに "powered by givers.work" が全ページで表示される（landing / contact / legal / service-status 等） |

## 3. 移行検証シナリオ（マイグレーションある時）

該当なし（DB マイグレーションなし）。

## 4. 環境要件差分

| 項目 | 前回 | 今回 | 理由 |
|---|---|---|---|
| （なし） | — | — | 追加の環境変数・サービス不要 |

## 5. 期待 KPI

| 指標 | 目標 |
|---|---|
| `/legal/commerce` 表示 | 200 / 全法定項目表示 |
| Stripe 審査 | 当該 URL 提示で事業者情報要件を満たす |

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-10 | 初版作成 | /flow:revise |
