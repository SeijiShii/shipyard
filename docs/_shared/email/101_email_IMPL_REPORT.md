# 実装レポート: _shared/email

## 実装日時
2026-05-27 15:39 (JST)

## モード
feature（横断基盤・メール送信）

## 関連ドキュメント
- [001_email_SPEC.md](./001_email_SPEC.md) / [002_email_PLAN.md](./002_email_PLAN.md) / [003_email_UNIT_TEST.md](./003_email_UNIT_TEST.md)
- [AI_LOG セッション](../../AI_LOG/D20260527_019_tdd_continuous.md)

## 変更一覧

### Phase 1: client + send（injectable）
- `lib/email/client.ts` — `Mailer` interface + `EmailMessage` + `resendMailer()` アダプタ（実 Resend は runtime のみ）
- `lib/email/send.ts` — `sendThreadLink` / `sendReplyNotification` / `sendNewInquiryNotification` + `deliver`（1 回リトライ、best-effort で `EmailResult` を返し例外を投げない）
- `lib/email/util.ts` — `maskEmail`（PII マスク、SEC-001）+ `escapeHtml`

### Phase 2: テンプレ 3 種（HTML + text、design SoT トーン）
- `lib/email/templates/threadLink.ts` — スレッドリンク（isNew で文言差、リンクのみ）
- `lib/email/templates/replyNotification.ts` — 返信通知（リンクのみ、本文プレビュー非含有）
- `lib/email/templates/newInquiry.ts` — 運用者宛新着通知（admin リンクのみ、本文/メアド非含有）

### 最終（Release 工程）
- 実 Resend キーでの dev 送信確認（test mode、宛先=自分）は Release（実キー必須、Class C/B）へ繰延

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | `EmailResult`（`{ok:true,id}` \| `{ok:false,error}`）で best-effort を型表現（SPEC「{id} or 失敗」を具体化、呼び出し側を例外で巻き込まない）。`maskEmail`/`escapeHtml` を util に分離 |
| 計画から省略した変更 | テンプレを `.tsx`（react-email）でなく `.ts` の HTML 文字列ビルダで実装（react-email/レンダリング依存を避け、純粋にテスト可能）。SITE_URL は `lib/seo/config.siteUrl()` を再利用 |
| 想定外の問題 | なし。実送信は実キー必須のため Release |

## PR Description
### タイトル
_shared/email: Resend ラッパ（injectable、PII 非混入、best-effort）
### 概要
問い合わせのスレッドリンク / 返信通知 / 運用者新着通知のメール送信基盤。Resend を injectable interface 化し実キー不要で CI green。本文はリンクのみで PII（問い合わせ本文・メアド）を載せない。
### 変更内容
- send 3 関数（best-effort、1 回リトライ、EmailResult 返却で呼び出し側を巻き込まない）
- テンプレ 3 種（HTML+text、リンクのみ）、PII マスク util
### テスト
- 単体 7 件、全 GREEN。全体 67/67（100%）、typecheck クリーン。PII 非混入（U-P1/P2）100%。
