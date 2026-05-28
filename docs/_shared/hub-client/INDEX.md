# _shared/hub-client ドキュメントインデックス

**最終更新**: 2026-05-28 20:15
**生成元**: /flow:concept (初期化) / /flow:tdd (実装完了) / /flow:revise (service-info v2 retrofit 設計)

<!-- auto-generated-start -->

## 状態: 実装完了 (2026-05-27)
Phase 1（contract Zod + mock）+ Phase 2（client）+ Phase 3（cache）完了。単体 12 件 GREEN。安全サブセット strip / フォールバック分岐 100%。Cron route は service-status で配線、実 HUB 結合は [論点-001] 解決後。

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_hub-client_SPEC.md | SPEC | 設計済 | 2026-05-27 | HUB status contract + cache + fallback |
| 002 | 002_hub-client_PLAN.md | PLAN | 設計済 | 2026-05-27 | Zod + client + cache + mock |
| 003 | 003_hub-client_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | 安全サブセット strip + フォールバック |
| 004 | (E2E スキップ) | — | N/A | — | cross-cutting |
| 101 | 101_hub-client_IMPL_REPORT.md | IMPL_REPORT | 実装完了 | 2026-05-27 | contract/client/cache/mock |
| 102 | 102_hub-client_UNIT_TEST_REPORT.md | UNIT_TEST_REPORT | 実装完了 | 2026-05-27 | 12 件 GREEN（strip/fallback 100%） |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| [revise_service-info-v2-contract_20260528/](./revise_service-info-v2-contract_20260528/) | revise | service-info-v2-contract (AUDIT-perspective-001) | 設計完了 (tdd 待ち) | O48 v2 favicon-projection 契約 retrofit: HUB_SHARED_SECRET → HUB_SERVICE_INFO_SECRET rename + iconUrl 追加 + schemaVersion=2 bump | [INDEX](./revise_service-info-v2-contract_20260528/INDEX.md) |

## 関連
- 親 concept: `../../concept.md` §6 / §5.2 / §8 [論点-001]
- 依存: _shared/db（service_status_cache）
- 被依存: service-status
- 実装コード: `lib/hub/`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- contract → 001_hub-client_SPEC.md §2

## 機能性質タグ
- cross-cutting（HUB クライアント、[論点-001] contract 内包）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
