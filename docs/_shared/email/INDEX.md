# _shared/email ドキュメントインデックス

**最終更新**: 2026-05-27 15:39
**生成元**: /flow:concept (初期化) / /flow:tdd (実装完了)

<!-- auto-generated-start -->

## 状態: 実装完了 (2026-05-27)
Phase 1（client+send injectable）+ Phase 2（テンプレ 3 種）完了。単体 7 件 GREEN。PII 非混入 100%（リンクのみ、ログマスク）。実送信は Release（実キー必須）。

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_email_SPEC.md | SPEC | 設計済 | 2026-05-27 | Resend send 3 関数 + テンプレ（PII 非混入） |
| 002 | 002_email_PLAN.md | PLAN | 設計済 | 2026-05-27 | lib/email injectable + テンプレ |
| 003 | 003_email_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | mock send + PII 検証 |
| 004 | (E2E スキップ) | — | N/A | — | cross-cutting |
| 101 | 101_email_IMPL_REPORT.md | IMPL_REPORT | 実装完了 | 2026-05-27 | client/send/templates（injectable, best-effort） |
| 102 | 102_email_UNIT_TEST_REPORT.md | UNIT_TEST_REPORT | 実装完了 | 2026-05-27 | 7 件 GREEN（PII 非混入 100%） |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし。`/flow:revise` / `/flow:fix` / `/flow:claim` で生成) |

## 関連
- 親 concept: `../../concept.md` §6 外部連携 / §3.7 SEC-001
- 被依存: inquiry, admin
- 実装コード: `lib/email/`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_email_SPEC.md §1

## 機能性質タグ
- cross-cutting（メール送信基盤）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
