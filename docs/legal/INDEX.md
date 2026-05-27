# legal ドキュメントインデックス

**最終更新**: 2026-05-27 16:17
**生成元**: /flow:concept (初期化) / /flow:tdd (unit 実装完了)

<!-- auto-generated-start -->

## 状態: unit 実装完了 (2026-05-27)
PrivacyContent/TermsContent + /legal/privacy・/legal/terms ページ完了。単体 5 件 GREEN。cookieless/外部AI送信なし/取得項目=メール+本文のみが §6/SEC-001 と整合。Footer/seo を /legal/* に reconcile。**文面は公開前に最終確認**。E2E（004）は /flow:e2e。

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_legal_SPEC.md | SPEC | 設計済 | 2026-05-27 | privacy/terms（特商法/Cookie 不要） |
| 002 | 002_legal_PLAN.md | PLAN | 設計済 | 2026-05-27 | SSG page + MDX 原稿 |
| 003 | 003_legal_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | 必須見出し + §6 整合 |
| 004 | 004_legal_E2E_TEST.md | E2E_TEST | 設計済（未実行） | 2026-05-27 | フッタ導線（/flow:e2e） |
| 101 | 101_legal_IMPL_REPORT.md | IMPL_REPORT | 実装完了 | 2026-05-27 | privacy/terms 本文 + ページ + reconcile |
| 102 | 102_legal_UNIT_TEST_REPORT.md | UNIT_TEST_REPORT | 実装完了 | 2026-05-27 | 5 件 GREEN（§6 整合 + index 可） |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし。`/flow:revise` / `/flow:fix` / `/flow:claim` で生成) |

## 関連
- 親 concept: `../concept.md` §1.3.1 legal 行 / §9 法務
- 依存: _shared/ui（Footer）, _shared/seo
- 実装コード: `app/(public)/legal/*` `content/legal/`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_legal_SPEC.md

## 機能性質タグ
- feature（静的、法務）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
