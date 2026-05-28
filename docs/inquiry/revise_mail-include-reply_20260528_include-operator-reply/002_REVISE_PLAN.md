# inquiry 変更計画書 (mail-include-reply)

> **入力**: [`./001_REVISE_SPEC.md`](./001_REVISE_SPEC.md), [`../../concept.md`](../../concept.md) §1.1 / §3.7, 既存 `lib/email/` + `features/admin/`
> **最終更新**: 2026-05-28

---

## 1. 既存ファイル変更一覧

| ファイル | 変更内容 (概要) | リスク | 関連 SPEC § |
|---|---|---|---|
| `lib/email/templates/replyNotification.ts` | 引数を `{ url }` → `{ url, body }` に拡張。html ブランチに `escapeHtml(body)` で運用者返信本文を含める段落追加 + 末尾に「このメールへの返信は受け付けていません。続きはサイトの返信フォームから」案内追加。text ブランチに plain body + 案内追加。コメント `// 返信通知メール — リンクのみ。本文プレビューは含めない（SEC-001、U-2/U-P1）。` を `// 返信通知メール — 運用者返信本文を含める ([論点-006] 案 c、訪問者本人宛=SEC-001 対象外)。escapeHtml で SEC-003 防御。` に更新 | 中 (テンプレ拡張、既存 test U-2/U-P1 が破綻するので test も同 commit で更新) | §2.2, §7.4 |
| `lib/email/send.ts` (`sendReplyNotification`) | シグネチャを `{ to, token }` → `{ to, token, body }` に拡張、`replyNotificationEmail({ url, body })` を呼ぶ | 低 (1 関数のシグネチャ拡張、本 PJ 内 caller 1 箇所のみ) | §2.2, §7.2.1 |
| `features/admin/service.ts` (`AdminReplyDeps` + `adminReply`) | `notifyReply: (to, token) => ...` を `notifyReply: (to, token, body) => ...` に拡張。`adminReply` 内 `await deps.notifyReply(inquirer.email, thread.token, body)` に変更。コメント `// 問い合わせ者への返信通知（リンクのみ、本文を載せない＝SEC-001）。best-effort。` を `// 返信通知 ([論点-006] 案 c、本人宛=SEC-001 対象外で運用者返信本文を含める)。best-effort。` に更新 | 低 (型拡張のみ、SEC-001 コメント更新で意図明示) | §2.2, §7.2.1 |
| `app/api/admin/threads/[id]/reply/route.ts` | `notifyReply: (to, token) => sendReplyNotification({ mailer }, { to, token })` を `notifyReply: (to, token, body) => sendReplyNotification({ mailer }, { to, token, body })` に変更 | 低 (DI 配線 1 行) | §2.2 |
| `lib/email/email.test.ts` (Phase 3) | 既存 U-2 / U-P1 (リンクのみ、本文プレビューを含まない) を **更新** → 「運用者返信本文を含む」検証に。U-IR1〜U-IR3 新規追加 (body 引数 + escapeHtml + 案内文) | 中 (既存 test 更新 = 旧方針 ¬B 1 件削除 + 新方針 +3 件) | §2.4, §7.4 + 003 |
| `features/admin/admin.test.tsx` (Phase 3) | 既存 adminReply test を **更新** → notifyReply 呼び出し引数に body が含まれることを検証 (`expect(notifyReply).toHaveBeenCalledWith(email, token, body)`)。U-IR4 (body propagation) 新規追加 | 低 | §2.4 + 003 |

## 2. 新規ファイル一覧

| ファイル | 責務 | 依存 | LOC 見積 |
|---|---|---|---|
| (なし) | — | — | — |

## 3. 削除ファイル一覧

| ファイル | 削除理由 | 代替 |
|---|---|---|
| (なし) | — | — |

## 4. マイグレーション要否

- DB スキーマ変更: ❌ 不要 (message + thread テーブル無変更)
- 既存データ変換: ❌ 不要
- 設定ファイル変更: ❌ 不要 (Resend env 既存維持)
- ストレージパス変更: ❌ 不要

→ **Phase 5 REVISE_MIGRATION は生成しない**。

## 5. 実装 Phase 分割

### Phase 1 (RED→GREEN→IMPROVE) — テンプレ + send 基盤

- 対象:
  - `lib/email/templates/replyNotification.ts` (body 引数 + html/text 拡張 + 案内文)
  - `lib/email/send.ts` (sendReplyNotification シグネチャ拡張)
  - `lib/email/email.test.ts` 既存 U-2/U-P1 更新 + U-IR1〜U-IR3 追加
- ゴール: email 関連 unit test green (既存維持 + 新規 +3)

### Phase 2 (RED→GREEN→IMPROVE) — service + route 配線

- 対象:
  - `features/admin/service.ts` (AdminReplyDeps シグネチャ拡張 + adminReply 内 body 渡し + コメント更新)
  - `app/api/admin/threads/[id]/reply/route.ts` (DI 配線 1 行)
  - `features/admin/admin.test.tsx` 既存 adminReply test 更新 + U-IR4 追加
- ゴール: admin 関連 unit test green (既存維持 + 新規 +1)、全 172 → 177 tests GREEN 想定

### Phase 3 (任意、release 内で実施)
- ローカル動作確認 = `/contact` 送信 → `/admin` から手動返信 → Resend sandbox mail 受信で運用者返信本文確認 (本セッション外、ユーザー手動 or 別 release session)

## 6. 依存関係順序

```mermaid
graph TD
  A[Phase 1.1 replyNotification.ts] --> B[Phase 1.2 send.ts]
  B --> C[Phase 1.3 email.test.ts 更新]
  C --> D[Phase 2.1 service.ts]
  D --> E[Phase 2.2 route.ts]
  E --> F[Phase 2.3 admin.test.tsx 更新]
  F --> G[Phase 3 ローカル受信確認 (任意)]
```

- Phase 1 完了で email layer 完結、Phase 2 で admin layer 配線。Phase 2 は Phase 1 の sendReplyNotification シグネチャに依存。

## 7. ロールアウト計画

| ステップ | 内容 | 期日 | 検証方法 |
|---|---|---|---|
| 1 | 本 revise 設計 commit (本セッション、D20260528_017) | 2026-05-28 | git log + AI_LOG |
| 2 | `/flow:tdd revise_mail-include-reply_*` で Phase 1 + Phase 2 実装 | 設計直後 | 全 unit test green (172 → 177+) |
| 3 | ローカル送信確認 (`/contact` → admin reply → seiji の Resend mail 受信) | Phase 2 後 | seiji の inbox に運用者返信本文を含む mail 到達確認 |
| 4 | 本番デプロイ前に Phase 3 release 内で本番 Resend で同様確認 | release 時 | 本番 Resend からの mail 受信確認 |

## 8. リスク・注意点

- **escapeHtml の網羅性**: `lib/email/util.ts` の `escapeHtml` が HTML5 entities 全網羅か確認 (既存 url 用に使われているため一定の信頼性あるが、body は url より長く複雑な文字列 = 改行 / quote / `<>` / `&` 等の混在を test で担保)
- **改行の扱い**: 運用者返信本文に改行が含まれる場合、html では `<br>` 変換 or `<pre>` でラップが必要 (現状 `${lead}` は段落のみ、本文 = 改行保持必須)。実装方針: html では本文を `<pre style="white-space:pre-wrap;font-family:inherit">` でラップ (改行 + 自動折り返し)、text は plain で改行そのまま
- **訪問者の reply 受信不可案内**: mail 末尾に明示的に「このメールへの返信は受け付けていません」案内を入れ、訪問者が誤って mail に reply して noreply@... に行く事故を防止 (現状の `MAIL_FROM` = noreply、ユーザーが reply しても bounce or 黒洞)
- **既存 test 破壊リスク**: 既存 U-2 (sendReplyNotification シグネチャ) / U-P1 (本文プレビューを含まない) の test が破綻する = 同 commit で test 更新必須、CI green 維持
- **SEC-003 (XSS)**: body は admin 入力 = trusted user (Clerk + allowlist) のため XSS 攻撃ベクトルとしては低リスクだが、念のため escapeHtml 適用 = defense-in-depth

## 9. 完了の定義 (DoD)

- [ ] Phase 1 全 unit test green (replyNotification body 引数 + sendReplyNotification + 案内文)
- [ ] Phase 2 全 unit test green (adminReply body propagation)
- [ ] 全 PJ unit test 172 → 177+ GREEN 維持
- [ ] ローカル動作確認: `/contact` → admin reply → seiji の Resend sandbox mail に運用者返信本文 + 案内文 + optional link を含む mail 到達
- [ ] (任意) `/dev-review` 通過
- [ ] concept §3.7 SEC-001 に「訪問者本人宛 reply mail は対象外」明示追記 (本 revise commit 直後 or 別 commit、concept update)

## 10. 更新履歴

| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 — [論点-006] 案 (c) reconcile | /flow:revise |
