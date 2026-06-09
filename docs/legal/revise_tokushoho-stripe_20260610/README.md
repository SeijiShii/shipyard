# 改修: 特定商取引法に基づく表記の追加 + 業態整合（寄付PF→マイクロサービス運営）

- **issue / slug**: tokushoho-stripe
- **実施日**: 2026-06-10
- **対象機能**: ../README.md（legal）
- **基準 SPEC**: ../001_legal_SPEC.md
- **改修要望**:
  1. Stripe 決済アカウント審査に提示する**特定商取引法に基づく表記**ページを shipyard に追加。
  2. shipyard を seiji の個人事業（マイクロサービス運営）の**公式ホームページ**と位置づけ、旧 givers（寄付募集プラットフォーム）の業態から実態へ整合させる。
  3. 旧 GIVErS では Stripe がプラットフォーム型アカウントだったが、新業態では一般的な決済（マーチャント）アカウントのため特商法の細部が異なる。
  4. 特商法ページ完成後、`givers.work` apex ドメインを shipyard に向ける（現状 shipyard は `shipyard.givers.work`）。← DNS 切替は本番反映後の別ステップ（ユーザー手動）
  5. shipyard のページに **"powered by givers.work"** の文言を入れる。
- **業態（ユーザー確定 2026-06-10）**: 各種マイクロサービスを展開し、**公開済みサービスへの「作者応援寄付」を募る**ことを主業態とする（未公開サービスへのクラウドファンディングではない）。一部サービスで快適利用のための**追加オプションを販売**。**課金は単発のみ**（サブスクなし）。
- **状態**: 設計中

## このフォルダに置くドキュメント

- `001_REVISE_SPEC.md` — 変更仕様書（変更前 vs 変更後）
- `002_REVISE_PLAN.md` — 変更計画書（ファイル変更 + 新規 + 削除）
- `003_REVISE_UNIT_TEST.md` — 単体テスト計画
- `004_REVISE_E2E_TEST.md` — E2E テスト計画
- `101_REVISE_IMPL_REPORT.md` — 実装レポート（`/flow:tdd`）以降

## 関連

- 旧 GIVErS 特商法（流用元・差分基準）: `<giving_platform>/backend/legal/ja/commerce-law.md`
- concept §1.2 スコープ / §9 法務 / §4.7 ドメイン（本改修で更新）
- AI_LOG: `../../AI_LOG/D20260610_001_revise_legal_tokushoho-stripe.md`
- 高度モデルレビュー: `/dev-review` 推奨
