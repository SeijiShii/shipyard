# admin ドキュメントインデックス

**最終更新**: 2026-05-27 16:23
**生成元**: /flow:concept (初期化) / /flow:tdd (unit 実装完了)

<!-- auto-generated-start -->

## 状態: unit 実装完了 (2026-05-27)
service(reply/close) + layout ガード + 一覧/詳細ページ + reply/close API 完了。単体 10 件 GREEN。認可（requireOperator 401/403）/PII/404/best-effort 100%。threadRepo.findById を db に追加（admin id 経路）。**E2E（004）+ 実 Clerk は後続**。

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_admin_SPEC.md | SPEC | 設計済 | 2026-05-27 | Clerk gate 一覧/詳細/返信/close |
| 002 | 002_admin_PLAN.md | PLAN | 設計済 | 2026-05-27 | layout ガード + API |
| 003 | 003_admin_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | 認可分岐 + PII + reply |
| 004 | 004_admin_E2E_TEST.md | E2E_TEST | 設計済（未実行） | 2026-05-27 | journey + 認可 block（/flow:e2e） |
| 101 | 101_admin_IMPL_REPORT.md | IMPL_REPORT | 実装完了 | 2026-05-27 | service/layout ガード/一覧/詳細/API |
| 102 | 102_admin_UNIT_TEST_REPORT.md | UNIT_TEST_REPORT | 実装完了 | 2026-05-27 | 10 件 GREEN（認可/PII/404 100%） |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし。`/flow:revise` / `/flow:fix` / `/flow:claim` で生成) |

## 関連
- 親 concept: `../concept.md` §1.3.1 admin 行 / §3.7 SEC-001/002
- 依存: _shared/auth, _shared/db, _shared/email, _shared/ui
- 関連: inquiry（同 thread/message、訪問者側）
- 実装コード: `app/admin/*` `app/api/admin/*` `features/admin/`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_admin_SPEC.md

## 機能性質タグ
- feature, auth-required（Clerk+allowlist）, stateful

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
