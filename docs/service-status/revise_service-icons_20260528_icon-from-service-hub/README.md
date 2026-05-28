# 改修: service-icons (service-hub から各サービスのアイコン情報を受け取り表示)

- **issue / slug**: `service-icons` / `icon-from-service-hub`
- **実施日**: 2026-05-28
- **対象機能**: [../README.md](../README.md)
- **基準 SPEC**: [../001_service-status_SPEC.md](../001_service-status_SPEC.md)
- **改修要望**: service-hub から各サービスの iconUrl を受け取り、shipyard の稼働サービス一覧 (LP トップ「いま動いているサービス」セクション、`/services` 等) に表示する機能を追加。視覚的識別性向上 + 信頼感強化 (concept §1.1 UC#1)。
- **状態**: 設計完了 → 実装待ち (`/flow:tdd` で 101-103 生成、Phase 5 MIGRATION は drizzle で apply)

## CF-20260528-016 (F) 対外契約変更フラグ = YES

- **producer 側 = service-hub PJ**: 公開 status API レスポンスに `iconUrl` フィールド追加が**前提**。service-hub PJ で別 `/flow:revise service-icons` 起動が必要 (同 issue id 推奨)。
- **consumer 側 = 本 PJ shipyard (本セッション)**: contract 改訂受け入れ + DB schema 拡張 (Phase 5 MIGRATION) + StatusList component 拡張。
- **本 PJ の前提依存**: service-hub の contract 改訂が完了してから shipyard tdd 実装着手。または並行で shipyard 側設計 + dummy contract で先行可。

## このフォルダに置くドキュメント

- `001_REVISE_SPEC.md` — 変更仕様書 (UC-S1 before/after + iconUrl 追加 + フォールバック仕様)
- `002_REVISE_PLAN.md` — 変更計画書 (contract / schema / repo / cache / StatusList の 5 ファイル変更 + Phase 1/2 分割)
- `003_REVISE_UNIT_TEST.md` — 単体テスト計画 (icon 表示 + フォールバック + contract test 追加)
- `004_REVISE_E2E_TEST.md` — E2E テスト計画 (変更 UC + リグレッション、[論点-005] Playwright scaffold 待ちで実行は別途)
- `005_REVISE_MIGRATION.md` — マイグレーション計画 (drizzle で `iconUrl text` カラム追加 + 逆操作 SQL)
- `101_REVISE_IMPL_REPORT.md` — 実装レポート (`/flow:tdd` で生成、未生成)
- `102_REVISE_UNIT_TEST_REPORT.md` — 単体テストレポート (同上、未生成)

## 関連

- 元 feature: [`D20260527_014_feature_service-status.md`](../../AI_LOG/D20260527_014_feature_service-status.md)
- 直前 fix: commit 7e775a1 (hub-client contract drift 修正、同 contract への追加変更)
- AI_LOG: [D20260528_009_revise_service-status_service-icons](../../AI_LOG/D20260528_009_revise_service-status_service-icons.md)
- 連動改修対象: service-hub PJ (別 repo / 別 `/flow:revise` 起動が前提)
