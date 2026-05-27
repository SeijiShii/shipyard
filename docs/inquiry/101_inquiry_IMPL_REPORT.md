# 実装レポート: inquiry

## 実装日時
2026-05-27 16:11 (JST)

## モード
feature（核心機能・stateful・auth-required IDOR）

## 関連ドキュメント
- [001_inquiry_SPEC.md](./001_inquiry_SPEC.md) / [002_…_PLAN.md](./002_inquiry_PLAN.md) / [003_…_UNIT_TEST.md](./003_inquiry_UNIT_TEST.md) / [004_…_E2E_TEST.md](./004_inquiry_E2E_TEST.md)（E2E は /flow:e2e）
- [AI_LOG セッション](../AI_LOG/D20260527_019_tdd_continuous.md)

## 変更一覧

### 中核（テスト可能・DI）
- `features/inquiry/schema.ts` — Zod（email/body/subject、body 上限 5000、SEC-003）
- `features/inquiry/service.ts` — `createInquiry`（spam 5 段 → db → 通知 best-effort）/ `addReply`（**token 検証=IDOR**、無効/詐称は一律 404）
- `features/inquiry/storage.ts` — localStorage に token 保存（メール不達時の保険、§5.2）
- `features/inquiry/ThreadView.tsx` — 本文を**プレーンテキスト**表示（React エスケープ=XSS 防止、SEC-003、dangerouslySetInnerHTML 不使用）

### 画面・API（thin wiring）
- `features/inquiry/ContactForm.tsx` — フォーム（honeypot/formRenderedAt/Turnstile widget + ProgressFeedback O45 + localStorage）
- `features/inquiry/ReplyForm.tsx` — 追記フォーム（token reply API）
- `app/contact/page.tsx` — 問い合わせ画面 / `app/t/[token]/page.tsx` — スレッド表示（findByToken→notFound、noindex、open 時のみ ReplyForm）
- `app/api/inquiry/route.ts` — POST（Zod → spam.verify → createInquiry、reject は汎用文言 I-E1）
- `app/api/inquiry/[token]/reply/route.ts` — POST（token 検証 → addReply）

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | セキュリティ中核（createInquiry/addReply）を service.ts に抽出し DI 化（実 Turnstile/Resend/DB なしで IDOR/PII/spam 分岐を 100% unit）。ReplyForm を分離 |
| 計画から省略した変更 | route group `(public)` は作らず flat（`app/contact`, `app/t/[token]`）。Turnstile widget は data 属性 + hidden input（CF スクリプト連携は Release）。実 Turnstile/Resend/Neon 結合は Release。Phase 3.5 bootstrap（SDK 配線）は env + Release |
| 想定外の問題 | なし。IDOR は「token 経由のみ（findByToken）、id 経路を一切設けない」で構造的に担保。XSS は React デフォルトエスケープ + dangerouslySetInnerHTML 不使用。PII は通知に body を渡さない（リンクのみ） |

## PR Description
### タイトル
inquiry: 問い合わせスレッド（token IDOR + 不可視スパム + プレーンテキスト + best-effort 通知）
### 概要
メアド + token URL でアクセスする問い合わせスレッド。送信は spam 5 段 → DB → 通知（best-effort）。スレッドは token 検証経由のみ（IDOR）、本文はプレーンテキスト（XSS）、本文/メアドはログ・メール本文に出さない（PII）。
### 変更内容
- createInquiry（spam→db→通知）/ addReply（token 検証 404）/ Zod / localStorage
- contact フォーム（honeypot/timing/Turnstile + 段階文言）/ /t/[token]（noindex）+ ReplyForm
### テスト
- 単体 14 件、全 GREEN。全体 131/131（100%）、typecheck クリーン。IDOR/XSS/PII/spam 分岐 100%。E2E（004）は /flow:e2e。
