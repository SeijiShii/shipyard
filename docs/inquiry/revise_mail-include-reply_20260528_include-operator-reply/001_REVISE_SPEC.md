# inquiry 変更仕様書 (mail-include-reply — 運用者返信本文をメールに含める)

> **改修種別**: 機能拡張 (mail テンプレ拡張 + シグネチャ拡張)
> **issue / slug**: `mail-include-reply` / `include-operator-reply`
> **基準 SPEC**: [`../001_inquiry_SPEC.md`](../001_inquiry_SPEC.md)
> **最終更新**: 2026-05-28
> **タグ**: feature (mail)
> **AI_LOG**: [D20260528_017_revise_inquiry_mail-include-reply](../../AI_LOG/D20260528_017_revise_inquiry_mail-include-reply.md)

---

## 1. 変更概要

運用者 (admin) が訪問者の問い合わせに返信した際、訪問者宛 reply notification mail に**運用者返信本文を含める** ([論点-006] reconcile 案 c)。これにより訪問者はサイトに戻らずメールだけで対応内容を確認できる (concept §1.1 UC#5 前提変更受け入れ)。SEC-001 (PII ログ漏洩防止) との両立 = 運用者返信のみ含め、訪問者の問い合わせ本文 / 過去履歴は含めない (Resend mail log への漏洩面最小化)。

## 2. 変更前 vs 変更後

### 2.1 UC 変更

| UC ID | 変更前 | 変更後 | 理由 |
|---|---|---|---|
| UC#5 (concept §1.1) | 訪問者はリンクでサイトに戻ってスレッド確認 → 追記 | 訪問者は**メールで運用者返信本文を読める**、サイトに戻るのは optional (任意導線として残存) | 「問い合わせ人はサイトに来ない」前提変更 ([論点-006]) |
| UC-A2 (admin SPEC) | 運用者が返信 → 訪問者にリンクのみメール送信 | 運用者が返信 → 訪問者に**返信本文 + optional link** メール送信 | UC#5 連動変更 |

### 2.2 入出力変更

| 対象 | 変更前 | 変更後 | 互換性 |
|---|---|---|---|
| `sendReplyNotification(deps, { to, token })` | url のみ含むメール送信 | `sendReplyNotification(deps, { to, token, body })` body を mail 本文に含めて送信 | TS シグネチャ拡張 (引数追加)、internal API のため後方互換考慮不要 |
| `replyNotificationEmail({ url })` | 「リンクのみ」mail (subject + 短い lead + link) | `replyNotificationEmail({ url, body })` body を html/text に含める (subject + lead + 運用者返信本文 + optional link + 「サイトで返信してください」案内) | テンプレ関数引数追加 |
| `AdminReplyDeps.notifyReply(to, token)` | リンクのみ通知 | `notifyReply(to, token, body)` body 引数追加 | service 層シグネチャ拡張、本 PJ 内のみ呼び出し |
| `POST /api/admin/threads/[id]/reply` | (HTTP 契約変更なし、内部実装変更のみ) | 同左、外部から見える挙動 = 訪問者宛 mail に本文含まれる | HTTP 契約 ✅ 互換維持 |

### 2.3 データモデル変更

| エンティティ | 変更内容 | マイグレーション要否 |
|---|---|---|
| (なし) | DB schema 変更なし、message テーブル + thread テーブル無変更 | ❌ 不要 |

### 2.4 バリデーション・エラー変更

| 対象 | 変更前 | 変更後 |
|---|---|---|
| A-E3 (admin reply 入力検証) | adminReplySchema (Zod) で body 必須 + 長さ制限 | **変更なし** (既存 schema が validate 済 body をそのまま mail に渡す) |
| 新規: mail 本文 XSS 対策 (SEC-003) | (該当なし、link のみ) | `replyNotificationEmail` で `escapeHtml(body)` を html ブランチで適用 (既存 `escapeHtml(url)` パターン踏襲) |
| MAIL-E1 best-effort retry | 既存 retry 1 回 | **変更なし** (送信失敗時も admin reply 操作を巻き込まない、`features/admin/service.ts:14` の try/catch 維持) |

## 3. 影響範囲

| 対象 | 影響度 | 説明 |
|---|---|---|
| `lib/email/templates/replyNotification.ts` | 高 | 直接対象 — body 引数追加 + html/text 拡張 |
| `lib/email/send.ts` (`sendReplyNotification`) | 高 | シグネチャ拡張 — body propagate |
| `features/admin/service.ts` (`adminReply`、`AdminReplyDeps`) | 高 | `notifyReply` シグネチャ拡張 + body 渡し |
| `app/api/admin/threads/[id]/reply/route.ts` | 中 | DI 配線変更 — `notifyReply: (to, token, body) => sendReplyNotification({ mailer }, { to, token, body })` |
| `lib/email/email.test.ts` | 中 | 既存 U-2 / U-P1 (リンクのみ) の更新 + 新規 U-IR1〜U-IR3 追加 |
| `features/admin/admin.test.tsx` | 中 | 既存 admin reply test 拡張 + body propagation 検証追加 |
| `concept.md §3.7 SEC-001` | 低 | NFR 記述に **「訪問者本人宛 reply mail は対象外 (本人への新規情報 outbound、ログ漏洩でない)」** の明示注記追加 (revise PLAN ではなく後段 concept update で対応) |

## 4. 後方互換性

- **互換維持**: ✅
- 理由:
  - HTTP API 契約 (POST /api/admin/threads/[id]/reply) は変更なし、HTTP request body / response も同じ
  - 訪問者の観点では mail 本文情報量が増えるのみ (link は維持、サイト復帰は引き続き可能)
  - 既存スレッド UI (`/t/<token>`) は維持、訪問者がサイトに戻ることは optional
  - internal TS シグネチャ拡張 (sendReplyNotification + notifyReply) は本 PJ 内のみ呼び出し = 全 caller を本 revise で同時更新

## 5. ロールバック方針

- **コード revert で戻せる**: ✅
- **DB マイグレーションのロールバック**: ❌ 不要 (schema 変更なし)
- **手順**: `git revert <commit hash>` で 4 ファイル変更を巻き戻し、本番再デプロイ → 訪問者宛 mail は元の「リンクのみ」に戻る (data loss なし)
- **副作用**: 既に送信済の運用者返信本文を含む mail は受信者の inbox に残る (Resend 経由送信完了済、取り消し不可) = 訪問者には不可逆だが運用上問題なし (本人宛、運用者意図通り)

## 6. リリース戦略

- **方式**: 一括
- **フィーチャーフラグ名**: 不要
- **理由**:
  - 改修範囲が小規模 (4 ファイル、テスト 5-6 ケース追加) で段階展開のリスク管理不要
  - 訪問者観点では mail 本文情報量が増えるだけ = 段階展開不要
  - 単一運用者 (seiji) PJ なので A/B test や rollout 段階不要
- **ロールアウト計画**:
  1. shipyard PJ Phase 1 = template + send.ts 拡張 + 既存 test 更新 (`/flow:tdd` Phase 1)
  2. shipyard PJ Phase 2 = service + route 配線 + admin test 拡張 (`/flow:tdd` Phase 2)
  3. テスト green 確認 (172 → 177+ tests GREEN 想定)
  4. ローカル動作確認 = `/contact` 送信 → admin から手動返信 → seiji の Resend sandbox mail で運用者返信本文を含むメール受信確認
  5. 本番デプロイ前に Phase 3 release 内で実機確認 (本番 Clerk + 本番 Resend)

## 7. 詳細仕様 (新仕様)

### 7.1 詳細 UC (新仕様)

#### UC#5 (改修版): 訪問者がメールで運用者返信を読む (sitebacks optional)

- **トリガー**: 運用者が `/admin/threads/<id>` で返信送信 → POST /api/admin/threads/[id]/reply → adminReply service → notifyReply → sendReplyNotification → Resend
- **メール内容**:
  - subject: 「返信が届きました」(既存維持)
  - lead: 「お問い合わせに返信が届きました。」(既存維持)
  - **本文 (新規)**: 運用者返信本文 (HTML は escapeHtml 経由、text は plain)
  - optional link: 「サイトで会話の続きを見る (任意)」(既存 URL 維持、文言調整)
  - 案内 (新規): 「このメールへの返信は受け付けていません。続きはサイトの返信フォームから送信してください。」(訪問者の reply 受信不可を明示、Resend inbound 不要)
- **訪問者操作**:
  - メールで運用者返信を読む = 主要導線 ([論点-006] 前提)
  - サイト復帰 = optional (link クリック → /t/<token> でスレッド UI 表示 = 既存維持)
  - メール返信 → 受信不可 (NX 経由は MX 設定で対応、本 PJ では Resend inbound 未配線)
- **例外**: mail 送信失敗 = best-effort retry 1 回後諦め、admin reply 操作は成功扱い (既存)

### 7.2 入出力 (新仕様)

#### 7.2.1 内部関数シグネチャ

```ts
// lib/email/templates/replyNotification.ts
export function replyNotificationEmail(
  { url, body }: { url: string; body: string }
): { subject: string; html: string; text: string }

// lib/email/send.ts
export async function sendReplyNotification(
  deps: SendDeps,
  { to, token, body }: { to: string; token: string; body: string }
): Promise<EmailResult>

// features/admin/service.ts
export interface AdminReplyDeps {
  // ...
  notifyReply: (to: string, token: string, body: string) => Promise<unknown>;
}
```

#### 7.2.2 HTTP API

| メソッド | パス | 入力 | 出力 | 認証 |
|---|---|---|---|---|
| POST | `/api/admin/threads/[id]/reply` | `{ body: string }` (既存 adminReplySchema) | `{ ok: true }` (200) / `{ error }` (400/404) | Clerk + allowlist (既存 requireOperator) |

(HTTP 契約変更なし、internal の mail 本文に body を含めるのみ)

### 7.3 データモデル (新仕様)

(変更なし — message テーブル + thread テーブルは既存維持)

### 7.4 バリデーション・エラー (新仕様)

- A-E1〜A-E4 (既存): **変更なし**
- A-E5 mail 送信失敗 best-effort (既存): **変更なし** (try/catch + admin reply 巻き込まない)
- **新規 A-E6**: mail 本文 XSS (SEC-003) — `replyNotificationEmail` 内で `escapeHtml(body)` を html ブランチに適用 (text ブランチは plain なので不要)
- **新規 A-E7**: mail 本文長すぎ (Resend 上限 or 訪問者 inbox 制限) → 既存 adminReplySchema の長さ制限がそのまま適用 (Zod max length、existing) = 別途新規 validation 不要

### 7.5 機能固有 NFR + 連携 (新仕様)

| 項目 | 目標 | 根拠 |
|---|---|---|
| mail 送信成功率 | 既存維持 (best-effort、admin reply 操作を巻き込まない) | A-E5 (既存) |
| **SEC-001 整合** (新規) | 訪問者本人宛 reply mail は SEC-001 対象外 (本人への新規情報 outbound、ログ漏洩でない)。Sentry/Analytics/サーバ stdout への本文出力は引き続き禁止 | concept §3.7 SEC-001 + 本 revise 案 (c) |
| **SEC-003 整合** (新規) | mail 本文の html ブランチで `escapeHtml(body)` 適用、XSS 防止 | concept §3.7 SEC-003 + 既存 `escapeHtml(url)` パターン |
| mail 文字エンコーディング | UTF-8 (Resend デフォルト)、絵文字含む運用者返信を正確に配信 | 既存維持 |

連携: `lib/email/` (template + send + util escape) / `features/admin/` (service + replySchema) / `app/api/admin/threads/[id]/reply/` (route 配線)

## 8. タグ別追加項目

- **feature (mail)**: 視覚レビュー (O34) は対象外 (mail UI、ブラウザ scope 外)。Resend sandbox での実機受信確認は Phase 3 release 内で実施。

## 9. 未決事項

> 現時点で論点なし (2026-05-28、SEC-001 衝突は本 revise で案 (c) を採用して reconcile 済、訪問者本人宛 mail のため SEC-001 対象外と判定)。

## 10. 更新履歴

| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 — [論点-006] 案 (c) reconcile、運用者返信本文のみ含める方針確定 | /flow:revise |
