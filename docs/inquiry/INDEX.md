# inquiry ドキュメントインデックス

**最終更新**: 2026-05-27 16:11
**生成元**: /flow:concept (初期化) / /flow:tdd (unit 実装完了)

<!-- auto-generated-start -->

## 状態: unit 実装完了 (2026-05-27)
core service（createInquiry/addReply）+ schema + storage + ThreadView + contact/t[token] 画面 + API 2 本 完了。単体 14 件 GREEN。**IDOR/XSS/PII/spam 分岐 100%**。実 Turnstile/Resend/Neon 結合 + E2E（004）は後続。

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_inquiry_SPEC.md | SPEC | 設計済 | 2026-05-27 | スレッド送信/表示/reply（SEC-001/002/003） |
| 002 | 002_inquiry_PLAN.md | PLAN | 設計済 | 2026-05-27 | contact/t[token]/API/SubmitFlow |
| 003 | 003_inquiry_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | spam/IDOR/XSS/PII 分岐 |
| 004 | 004_inquiry_E2E_TEST.md | E2E_TEST | 設計済（未実行） | 2026-05-27 | journey + IDOR/XSS（/flow:e2e） |
| 101 | 101_inquiry_IMPL_REPORT.md | IMPL_REPORT | 実装完了 | 2026-05-27 | service/schema/画面/API（IDOR/XSS/PII） |
| 102 | 102_inquiry_UNIT_TEST_REPORT.md | UNIT_TEST_REPORT | 実装完了 | 2026-05-27 | 14 件 GREEN（IDOR/XSS/PII/spam 100%） |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| (なし。`/flow:revise` / `/flow:fix` / `/flow:claim` で生成) |

## 関連
- 親 concept: `../concept.md` §1.3.1 inquiry 行 / §3.7 SEC-001/002/003 / §5.2
- 依存: _shared/db, _shared/spam, _shared/email, _shared/ui
- 被依存: admin（同 thread/message を操作）, landing（CTA 遷移元）
- 実装コード: `app/(public)/{contact,t/[token]}` `app/api/inquiry/*` `features/inquiry/`（§1.4）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_inquiry_SPEC.md（§1 UC / §5 SEC）

## 機能性質タグ
- feature, stateful（thread status）, auth-required（token IDOR）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
