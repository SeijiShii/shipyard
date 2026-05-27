# inquiry 実装計画書

> **入力**: `./001_inquiry_SPEC.md`, `../_shared/{db,spam,email,ui}/*`
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `app/(public)/contact/page.tsx` | 問い合わせフォーム画面（Turnstile widget + honeypot + formRenderedAt） | ui, spam(client) | 80 |
| `app/(public)/t/[token]/page.tsx` | スレッド表示 + 追記（token 検証後、プレーンテキスト） | ui, db | 90 |
| `app/api/inquiry/route.ts` | POST 送信（Zod → spam.verify → db 作成 → email） | spam, db, email | 90 |
| `app/api/inquiry/[token]/reply/route.ts` | 追記（token 検証 → message 追加） | db | 50 |
| `features/inquiry/schema.ts` | Zod スキーマ（email/body/subject） | — | 30 |
| `features/inquiry/SubmitFlow.tsx` | 送信 → ProgressFeedback 段階 → スレッド表示 + localStorage | ui | 70 |

## 2. 実装 Phase 分割
- **Phase 1**: schema（Zod）+ contact フォーム UI（honeypot/formRenderedAt/Turnstile widget）
- **Phase 2**: POST /api/inquiry（Zod → spam.verify → db → email、best-effort）
- **Phase 3**: /t/[token] 表示 + reply（token 検証=IDOR、プレーンテキスト=XSS）
- **Phase 4**: SubmitFlow（ProgressFeedback O45 + localStorage 保存・復帰）
- **Phase 3.5**: app/api bootstrap（SDK 配線: Turnstile/Resend/Neon、scripts/dev.sh、CI yaml）は本機能 or 専用 Phase で（O35/O36/O37）

## 3. 依存関係順序
```
schema → contact UI + spam(client) → /api/inquiry(spam/db/email) → /t/[token](db) → SubmitFlow
```

## 4. 既存ファイルへの影響
- landing の CTA→/contact。admin が同 thread/message を操作。

## 5. リスク・注意点
- **IDOR（SEC-002）**: /t/[token] と reply API は必ず token 一致をサーバー検証。連番 id を URL/レスポンスに出さない。
- **XSS（SEC-003）**: 本文は React のデフォルトエスケープ（プレーンテキスト）、`dangerouslySetInnerHTML` 禁止。
- **PII（SEC-001）**: 本文/メアドをログ・メール本文・Analytics に出さない。
- spam reject 理由は汎用文言（bot にヒント与えない）。
- email 失敗でスレッド作成を巻き込まない（best-effort）。

## 6. 完了の定義
- [ ] 送信 → spam pass → スレッド即表示（token URL + localStorage）
- [ ] /t/[token] が token 検証（IDOR）、本文プレーンテキスト（XSS）
- [ ] Zod 全入力検証、spam 5 段、通知 best-effort
- [ ] ProgressFeedback 段階（O45、嘘進捗なし）
- [ ] PII 非混入 test 担保 / E2E green

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
