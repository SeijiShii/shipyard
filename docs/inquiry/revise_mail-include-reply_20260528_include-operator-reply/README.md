# 改修: inquiry mail-include-reply (運用者返信本文をメールに含める、[論点-006] reconcile 案 c)

- **issue / slug**: `mail-include-reply` / `include-operator-reply`
- **実施日**: 2026-05-28
- **対象機能**: [../README.md](../README.md)
- **基準 SPEC**: [../001_inquiry_SPEC.md](../001_inquiry_SPEC.md)
- **改修要望**: concept §1.1 UC#5 前提変更 (「問い合わせ人はこちらの対応を確認するためにこのサイトには来ない」) を受け、運用者→訪問者宛 reply notification mail に**運用者返信本文を含める**。訪問者はサイトに戻らずメールだけで対応内容を読める ([論点-006])。
- **状態**: 実装完了 (2026-05-28、Phase 1 commit `540e0d5` + Phase 2 commit `7f8f5e8`、174/174 tests GREEN)

## 設計判断 (D20260528_017 reconcile)

**案 (c) 採用** (本セッション SEC-001 衝突確認の結果、case Class C):
- メール本文 = **運用者返信本文のみ** + サイト復帰 optional link + 「サイトで返信してください」案内
- 訪問者本人の問い合わせ本文 / 過去履歴は**含めない** (Resend mail log への過剰漏洩回避)
- SEC-001 整合: 訪問者本人宛 mail = 新規情報の outbound = SEC-001 (PII ログ漏洩防止) 違反でない
- 案 (b) 過去履歴含めは却下 (Resend log への漏洩面拡大、本人宛なら理論的には許容だが運用面で過剰)
- 案 (d) SEC-001 厳格保持 ([論点-006] 諦め) は却下 (UC#5 前提変更を受け入れない)

## このフォルダに置くドキュメント

- `001_REVISE_SPEC.md` — 変更仕様書 (UC#5 + reply mail 本文 + SEC-001 整合説明)
- `002_REVISE_PLAN.md` — 変更計画書 (4 ファイル変更、新規/削除 0)
- `003_REVISE_UNIT_TEST.md` — 単体テスト計画 (replyNotificationEmail body 引数 + sendReplyNotification + adminReply propagation)
- `004_REVISE_E2E_TEST.md` — E2E テスト計画 (admin reply → 訪問者宛 mail に本文含む)
- `005_REVISE_MIGRATION.md` — **生成しない** (DB schema 変更なし、ロジック追加のみ)
- `101_REVISE_IMPL_REPORT.md` — 実装レポート (/flow:tdd で生成、未生成)
- `102_REVISE_UNIT_TEST_REPORT.md` — 単体テストレポート (同上、未生成)

## 関連

- 元 feature: `../001_inquiry_SPEC.md` + `../101_inquiry_IMPL_REPORT.md`
- 起源 [論点-006]: `../../concept.md §8` (line 524、status=open → 本 revise で reconcile)
- AI_LOG: `../../AI_LOG/D20260528_017_revise_inquiry_mail-include-reply.md`
- 関連実装: `lib/email/send.ts:49 sendReplyNotification` / `lib/email/templates/replyNotification.ts` / `features/admin/service.ts:14 (SEC-001 コメント)` / `app/api/admin/threads/[id]/reply/route.ts`
