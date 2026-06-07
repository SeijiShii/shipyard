# service-status ドキュメントインデックス

**最終更新**: 2026-05-27 15:59
**生成元**: /flow:concept (初期化) / /flow:tdd (unit 実装完了)

<!-- auto-generated-start -->

## 状態: unit 実装完了 (2026-05-27)
Phase 1（StatusList + uptime）+ Phase 2（/api/services + /api/cron + services page）+ Phase 3（vercel cron）完了。単体 7 件 GREEN。安全サブセット/secret 分岐 100%。**E2E（004）は /flow:e2e（P4.5）で実行予定**。

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_service-status_SPEC.md | SPEC | 設計済 | 2026-05-27 | 稼働一覧 + /api/services + cron |
| 002 | 002_service-status_PLAN.md | PLAN | 設計済 | 2026-05-27 | StatusList/API/cron/uptime |
| 003 | 003_service-status_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | 表示/cache/secret/安全サブセット |
| 004 | 004_service-status_E2E_TEST.md | E2E_TEST | 設計済（未実行） | 2026-05-27 | journey + Level1/2（/flow:e2e） |
| 101 | 101_service-status_IMPL_REPORT.md | IMPL_REPORT | 実装完了 | 2026-05-27 | StatusList/API/cron/uptime |
| 102 | 102_service-status_UNIT_TEST_REPORT.md | UNIT_TEST_REPORT | 実装完了 | 2026-05-27 | 7 件 GREEN（安全サブセット/secret 100%） |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| [revise_service-icons_20260528_icon-from-service-hub/](./revise_service-icons_20260528_icon-from-service-hub/) | revise | service-icons | 設計完了 (実装待ち) | service-hub から iconUrl 受信 → StatusList で icon 表示 + フォールバック (CF-016 連動改修対象 = service-hub PJ) | [INDEX](./revise_service-icons_20260528_icon-from-service-hub/INDEX.md) |
| [claim_C20260608-001_20260608_realtime-refresh-gap/](./claim_C20260608-001_20260608_realtime-refresh-gap/) | claim | C20260608-001 | 判定完了 → revise | HUB 3件登録なのに shipyard 2件表示 (naze-bako 欠落) → 仕様検討漏れ判定 | — |
| [revise_C20260608-001_20260608_realtime-refresh-gap/](./revise_C20260608-001_20260608_realtime-refresh-gap/) | revise | C20260608-001 | 設計完了 (実装待ち) | read-through refresh (最終同期日時ベース TTL 1h、cron 非依存) + 最終同期日時「{日時}現在」表示 | [INDEX](./revise_C20260608-001_20260608_realtime-refresh-gap/INDEX.md) |

## 関連
- 親 concept: `../concept.md` §1.3.1 service-status 行 / §5.2
- 依存: _shared/hub-client, _shared/db, _shared/ui
- 被依存: landing（埋込）
- 実装コード: `features/service-status/` `app/api/{services,cron}`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_service-status_SPEC.md

## 機能性質タグ
- feature（UI、稼働一覧）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
