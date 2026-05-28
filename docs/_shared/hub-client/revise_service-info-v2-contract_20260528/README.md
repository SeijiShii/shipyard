# 改修: O48 service-info v2 (favicon-projection) 契約 retrofit

- **issue / slug**: `service-info-v2-contract` (起点 = AUDIT_20260528_2000 §3.2 [AUDIT-perspective-001])
- **実施日**: 2026-05-28
- **対象機能**: `../README.md` (_shared/hub-client、ただし service-info producer は `lib/hub/service-info.ts` で標準 feature 境界外、本 revise で同 folder 配下に取り込む)
- **基準 SPEC**: `../001_hub-client_SPEC.md` (consumer 側、service-info producer は未掲載 = 本 revise で初の SPEC 化)
- **改修要望**: AUDIT_20260528_2000 (release-pre 必須監査、High 1 件) の唯一の High finding を撃ち落とす。perspectives.md O48 (CF-20260528-010 + CF-20260528-019) で v2 改訂された contract に shipyard producer 側 (`lib/hub/service-info.ts` + `app/api/hub/service-info/route.ts` + .env*) を追従させる。具体: (1) `HUB_SHARED_SECRET` → `HUB_SERVICE_INFO_SECRET` rename (全サービス共通シークレットへ統一)、(2) ServiceInfo に `iconUrl?: string` 追加 (favicon-projection)、(3) `schemaVersion=2` bump、(4) test 拡張 + PREREQUISITES/concept §6 同期
- **状態**: 設計中

## このフォルダに置くドキュメント

- `001_REVISE_SPEC.md` — 変更仕様書 (変更前 vs 変更後)
- `002_REVISE_PLAN.md` — 変更計画書 (ファイル変更 + 新規 + 削除)
- `003_REVISE_UNIT_TEST.md` — 単体テスト計画 (追加 / 修正 / 削除)
- `004_REVISE_E2E_TEST.md` — E2E テスト計画 (変更 UC + リグレッション、ただし service-info は HUB から pull される endpoint のため E2E は最小)
- `101_REVISE_IMPL_REPORT.md` — 実装レポート (/flow:tdd)
- `102_REVISE_UNIT_TEST_REPORT.md` — 単体テストレポート (/flow:tdd)

## 関連

- 過去の改修: なし (本 revise が _shared/hub-client 初の改修)
- AUDIT レポート: `../../AUDIT_20260528_2000.md` §3.2 [AUDIT-perspective-001]
- perspectives.md SoT: `~/.claude/flow-data/perspectives.md` O48 (`required_signals: [HUB_SERVICE_INFO_SECRET, /api/hub/service-info, iconUrl]`)
- 学習ログ: CF-20260528-010 (汎用 `required_signals` 先行採用) + CF-20260528-019 (O48 v2 favicon-projection 改訂)
- 高度モデルレビュー: 小規模 retrofit のため `/flow:spec-review` skip (ユーザー判断、本 revise 内 auto-pick で軽量レビュー済)
