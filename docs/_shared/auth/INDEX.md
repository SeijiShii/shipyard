# _shared/auth ドキュメントインデックス

**最終更新**: 2026-05-27 12:35
**生成元**: /flow:concept (初期化)

<!-- auto-generated-start -->

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_auth_SPEC.md | SPEC | 設計済 | 2026-05-27 | Clerk + allowlist（admin のみ、SEC-002） |
| 002 | 002_auth_PLAN.md | PLAN | 設計済 | 2026-05-27 | middleware + requireOperator |
| 003 | 003_auth_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | allowlist/認可分岐 + 訪問者通過 |
| 004 | (E2E スキップ) | — | N/A | — | cross-cutting |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし。`/flow:revise` / `/flow:fix` / `/flow:claim` で生成) |

## 関連
- 親 concept: `../../concept.md` §3.7 SEC-002 / §6 Clerk / §1.2 公開分離
- 被依存: admin
- 実装コード: `middleware.ts` `lib/auth/`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_auth_SPEC.md §1

## 機能性質タグ
- cross-cutting, auth-required（admin RBAC）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
