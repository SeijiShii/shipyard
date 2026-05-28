# 実装レポート: inquiry/revise_mail-include-reply

## 実装日時
2026-05-28 19:50 (JST)

## モード
revise

## 関連ドキュメント
- [001_REVISE_SPEC.md](./001_REVISE_SPEC.md)
- [002_REVISE_PLAN.md](./002_REVISE_PLAN.md)
- [003_REVISE_UNIT_TEST.md](./003_REVISE_UNIT_TEST.md)
- [004_REVISE_E2E_TEST.md](./004_REVISE_E2E_TEST.md)
- (005_REVISE_MIGRATION.md 不要、DB schema 変更なし)
- [AI_LOG](../../AI_LOG/D20260528_018_tdd_inquiry_revise_mail-include-reply.md)

## 注意事項
本レポートのファイルパスは実装日時時点のもの。

## 変更一覧

### Phase 1: email layer (commit `540e0d5`)

| ファイル | 変更 |
|---|---|
| `lib/email/templates/replyNotification.ts` | 引数 `{ url }` → `{ url, body }` 拡張、html ブランチに `<pre style="white-space:pre-wrap;font-family:inherit;margin:1em 0;padding:1em;background:#f3f1ec;border-radius:4px">${escapeHtml(body)}</pre>` で body をラップ (SEC-003 XSS 防御 + 改行保持)、text ブランチに body plain + 末尾「このメールへの返信は受け付けていません。続きはサイトの返信フォームから」案内追加 (R4 / 案内)。コメント更新 (SEC-001 → [論点-006] 案 c 本人宛=対象外) |
| `lib/email/send.ts` | `sendReplyNotification` シグネチャ `{ to, token }` → `{ to, token, body }` 拡張、内部 `replyNotificationEmail({ url, body })` 呼び出し |
| `lib/email/email.test.ts` | 旧 U-P1 (リンクのみ、本文プレビュー非含有) 削除 → U-IR3 (本文 + link + 案内文含む) 反転、U-IR2 (XSS escapeHtml `<script>` テスト) 追加、U-IR6 (改行保持 html pre wrap + text \n) 追加、既存 PII mask U-P2 sendReplyNotification 呼び出しに body 引数追加 |

### Phase 2: admin layer (commit `7f8f5e8`)

| ファイル | 変更 |
|---|---|
| `features/admin/service.ts` | `AdminReplyDeps.notifyReply` シグネチャ `(to, token) => ...` → `(to, token, body) => ...` 拡張、`adminReply` 内 `await deps.notifyReply(inquirer.email, thread.token, body)` に変更。コメント更新 (SEC-001 → [論点-006] 案 c) |
| `app/api/admin/threads/[id]/reply/route.ts` | DI 配線 1 行: `notifyReply: (to, token, body) => sendReplyNotification({ mailer }, { to, token, body })` |
| `features/admin/admin.test.tsx` | 旧 U-P1 (本文を渡さない、SEC-001) を反転 → U-IR4 (body propagation 検証)、既存 U-2 の notifyReply assertion を 3 引数 (to, token, body) に更新 |

## 実装計画からの差分

| 項目 | 内容 |
|---|---|
| 計画にない追加変更 | (なし) PLAN §1 通り 4 ファイル変更 + test 2 ファイル拡張 |
| 計画から省略した変更 | (なし) |
| 想定外の問題と対処 | (1) 既存 PII mask test U-P2 (line 167) で sendReplyNotification 呼び出しに body 引数追加が必要 (PLAN §1 未明示)、対応で body="return" を引数追加 = TS シグネチャ拡張に伴う既存 test の機械的更新 |

## PR Description

### タイトル
inquiry: 運用者返信本文を訪問者宛 reply mail に含める (revise_mail-include-reply、[論点-006])

### 概要
concept §1.1 UC#5 前提変更 (「問い合わせ人はサイトに来ない」) を受け、訪問者宛 reply notification mail に運用者返信本文を含める。spec-review (SEC-001 vs [論点-006] 衝突確認) で案 (c) 採用 = 運用者返信本文のみ、訪問者の問い合わせ本文/過去履歴は含めない (Resend log 漏洩面最小化)。escapeHtml で SEC-003 防御、訪問者本人宛 mail のため SEC-001 対象外と整理。

### 変更内容
- email template + send シグネチャ拡張 (body 引数追加)
- admin service + route DI 配線拡張 (body propagation)
- test: 旧 U-P1 反転 (本文を渡さない → body propagation 検証)、U-IR2/3/4/6 新規

### テスト
- 172 → 174 tests GREEN (+2、SEC-001 関連旧テスト削除分含む)
- SEC-003 XSS 防御 U-IR2 で機械担保
- 改行保持 U-IR6 で機械担保
- 動作確認 (Phase 3): ローカル `/contact` → admin reply → seiji の Resend mail 受信で運用者返信本文 + 案内 + link 確認 (ユーザー手動、Phase 3 release 前)
