# _shared/db ドキュメントインデックス

**最終更新**: 2026-05-27 12:35
**生成元**: /flow:concept (初期化)

<!-- auto-generated-start -->

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_db_SPEC.md | SPEC | 設計済 | 2026-05-27 | 5 表スキーマ + repository IF（token IDOR） |
| 002 | 002_db_PLAN.md | PLAN | 設計済 | 2026-05-27 | lib/db 実装計画（schema/client/repo、3 Phase） |
| 003 | 003_db_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | repository CRUD + IDOR + 制約テスト |
| 004 | (E2E スキップ) | — | N/A | — | cross-cutting、統合は feature 側 E2E |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし。`/flow:revise` / `/flow:fix` / `/flow:claim` で生成) |

## 関連
- 親 concept: `../../concept.md` §1.3.2 _shared/db 行 / §5 データ設計 / §3.7 NFR
- 被依存: inquiry, admin, service-status, spam（全て db を利用）
- 実装コード: `lib/db/`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- スキーマ詳細 → 001_db_SPEC.md §2
- 実装計画 → 002_db_PLAN.md

## 機能性質タグ
- cross-cutting, stateful（thread status）, auth-required（token IDOR、SEC-002）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
