# _shared/ui ドキュメントインデックス

**最終更新**: 2026-05-27 15:30
**生成元**: /flow:concept (初期化) / /flow:tdd (実装完了)

<!-- auto-generated-start -->

## 状態: 実装完了 (2026-05-27)
Phase 1（トークン+Button/Input/Textarea）+ Phase 2（StatusCard/Badge/status マップ/Header/Footer）+ Phase 3（InfoButton/EmptyState/ProgressFeedback/Dock SVG）完了。単体 20 件 GREEN。
視覚レビュー（design SoT §9）は画面実装後に `/flow:design --review-only`（Phase 3 gate）。

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_ui_SPEC.md | SPEC | 設計済 | 2026-05-27 | コンポーネント inventory（design SoT 由来） |
| 002 | 002_ui_PLAN.md | PLAN | 設計済 | 2026-05-27 | Tailwind トークン + shadcn/ui + 自作 SVG |
| 003 | 003_ui_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | render/role/text + a11y + status マップ |
| 004 | (E2E スキップ) | — | N/A | — | cross-cutting、視覚レビューは Phase 3 design --review-only |
| 101 | 101_ui_IMPL_REPORT.md | IMPL_REPORT | 実装完了 | 2026-05-27 | 12 コンポーネント + status マップ + cn |
| 102 | 102_ui_UNIT_TEST_REPORT.md | UNIT_TEST_REPORT | 実装完了 | 2026-05-27 | 20 件 GREEN（role/text + a11y + 分岐100%） |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし。`/flow:revise` / `/flow:fix` / `/flow:claim` で生成) |

## 関連
- 親 concept: `../../concept.md` §4.2 / `../../design/design-system.md`（スタイル SoT）
- 被依存: 全機能（UI 基盤）
- 実装コード: `components/` `tailwind.config.ts`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- スタイル SoT → ../../design/design-system.md
- コンポーネント詳細 → 001_ui_SPEC.md §1

## 機能性質タグ
- cross-cutting（UI 基盤）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
