# 改修: 稼働一覧のリアルタイム鮮度（read-through refresh + 最終同期日時表示）

- **issue / slug**: C20260608-001 / realtime-refresh-gap
- **実施日**: 2026-06-08
- **対象機能**: ../README.md（service-status）
- **基準 SPEC**: ../001_service-status_SPEC.md
- **起点クレーム**: ../claim_C20260608-001_20260608_realtime-refresh-gap/001_TRIAGE.md
- **改修要望**: HUB 3 件登録なのに shipyard 2 件表示（naze-bako 欠落）。日次 cron（Vercel Hobby 制約）では realtime 価値提案を満たせない → 読み取り経路に read-through refresh（最終同期日時ベース TTL 1h）+ 最終同期日時「{日時}現在」表示を追加。
- **後方互換**: ✅（レスポンス additive、スキーマ無変更）
- **マイグレーション**: 不要
- **状態**: 設計完了

## このフォルダに置くドキュメント
- `001_REVISE_SPEC.md` — 変更仕様（変更前 vs 変更後）
- `002_REVISE_PLAN.md` — 変更計画（3 Phase）
- `003_REVISE_UNIT_TEST.md` — 単体テスト計画
- `004_REVISE_E2E_TEST.md` — E2E テスト計画
- （`005_REVISE_MIGRATION.md` は不要 = スキーマ無変更）

## 関連
- 起点クレーム: ../claim_C20260608-001_20260608_realtime-refresh-gap/
- 高度モデルレビュー: `/dev-review` 推奨
