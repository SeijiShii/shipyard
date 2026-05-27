# _shared/seo ドキュメントインデックス

**最終更新**: 2026-05-27 15:35
**生成元**: /flow:concept (初期化) / /flow:tdd (実装完了)

<!-- auto-generated-start -->

## 状態: 実装完了 (2026-05-27)
Phase 1（metadata/config/robots/sitemap）+ Phase 2（JSON-LD）+ Phase 3（next/og 動的 OG）完了。単体 11 件 GREEN。noindex 分岐 100%（/t/[token] 検索除外）。

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_seo_SPEC.md | SPEC | 設計済 | 2026-05-27 | metadata/JSON-LD/sitemap/robots/動的 OG |
| 002 | 002_seo_PLAN.md | PLAN | 設計済 | 2026-05-27 | lib/seo + app/sitemap/robots/og 実装計画 |
| 003 | 003_seo_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | metadata/JSON-LD/noindex 検証 |
| 004 | (E2E スキップ) | — | N/A | — | cross-cutting |
| 101 | 101_seo_IMPL_REPORT.md | IMPL_REPORT | 実装完了 | 2026-05-27 | metadata/jsonld/sitemap/robots/og |
| 102 | 102_seo_UNIT_TEST_REPORT.md | UNIT_TEST_REPORT | 実装完了 | 2026-05-27 | 11 件 GREEN（noindex 100%） |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし。`/flow:revise` / `/flow:fix` / `/flow:claim` で生成) |

## 関連
- 親 concept: `../../concept.md` §3 SEO / §4.8 公開周知
- 被依存: landing, legal, service-status
- 実装コード: `lib/seo/` `app/{sitemap,robots,og}`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_seo_SPEC.md §1

## 機能性質タグ
- cross-cutting（SEO/OGP 基盤）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
