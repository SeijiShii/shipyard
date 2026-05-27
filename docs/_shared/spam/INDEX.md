# _shared/spam ドキュメントインデックス

**最終更新**: 2026-05-27 12:35
**生成元**: /flow:concept (初期化)

<!-- auto-generated-start -->

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_spam_SPEC.md | SPEC | 設計済 | 2026-05-27 | 不可視スタック 5 段 + token（§7 論点-005） |
| 002 | 002_spam_PLAN.md | PLAN | 設計済 | 2026-05-27 | verify/turnstile/email/rate-limit/token |
| 003 | 003_spam_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | 5 段防御 + PII ハッシュ + token |
| 004 | (E2E スキップ) | — | N/A | — | cross-cutting |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし。`/flow:revise` / `/flow:fix` / `/flow:claim` で生成) |

## 関連
- 親 concept: `../../concept.md` §3.7 SEC-005 / §4.3
- 依存: _shared/db（rate_limits）
- 被依存: inquiry
- 実装コード: `lib/spam/`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_spam_SPEC.md §1-§2

## 機能性質タグ
- cross-cutting（不可視スパム対策、O27）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
