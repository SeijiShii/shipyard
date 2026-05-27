# 実装レポート: _shared/spam

## 実装日時
2026-05-27 15:53 (JST)

## モード
feature（横断基盤・不可視スパム対策）

## 関連ドキュメント
- [001_spam_SPEC.md](./001_spam_SPEC.md) / [002_spam_PLAN.md](./002_spam_PLAN.md) / [003_spam_UNIT_TEST.md](./003_spam_UNIT_TEST.md)
- [AI_LOG セッション](../../AI_LOG/D20260527_019_tdd_continuous.md)

## 変更一覧

### Phase 1: token + 純ロジック
- `lib/spam/token.ts` — `generateThreadToken()`（128-bit base64url、**spec-review R1 の単一生成元**）
- honeypot / timing trap は verify 内の純ロジックとして実装

### Phase 2: rate-limit + email-checks
- `lib/spam/rate-limit.ts` — `rateLimitKey`（ip/email を sha256 ハッシュ化、SEC-001 U-P1）/ `windowStart`（窓量子化）/ `checkRateLimit`（repo 経由、count<=limit）
- `lib/spam/email-checks.ts` — `emailDomain` / `isDisposable`（静的ブロックリスト）/ `defaultMxResolver`（MX 確認、injectable）
- `lib/spam/disposable-domains.ts` — 使い捨てドメイン静的セット

### Phase 3: turnstile + verify（5 段合議）
- `lib/spam/turnstile.ts` — `cloudflareTurnstile`（siteverify、injectable verifier）
- `lib/spam/verify.ts` — `verifySubmission`（honeypot→timing→rate limit→Turnstile→email の 5 段、全 pass で受理）+ `GENERIC_REJECT_MESSAGE`（汎用文言、U-P2）

### R1 整合（db/token 二重定義の解消）
- `lib/db/token.ts` を `_shared/spam/token` からの re-export に変更（生成箇所を一本化。spam/token は crypto のみ依存で循環参照なし）。db 21/21 再 GREEN を確認

### 論点解決
- **[論点-005] Turnstile 障害時フェイル方針**: 推奨の **案A（fail-closed = reject + 再試行案内）を既定**として採用（`turnstileFailClosed` で切替可、可逆）。最終確認は inquiry 実装時/seiji。

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | Turnstile/MX/rateLimitRepo/now をすべて injectable に（実依存なし 100% テスト）。reason を内部コード union 化し `GENERIC_REJECT_MESSAGE` を分離（U-P2）。db/token を R1 に従い re-export 化 |
| 計画から省略した変更 | 実 Turnstile（test キー always-pass）結合は Release。rate_limits 古い窓の cleanup cron（spec-review R3）は service-status cron に相乗りで別途配線 |
| 想定外の問題 | なし。MX timeout は pass 寄り（SPAM-E2）、Turnstile 障害は fail-closed（論点-005 案A）で安全側 |

## PR Description
### タイトル
_shared/spam: 不可視スパム対策 5 段 + token 単一生成元
### 概要
問い合わせフォームの不可視スパム対策（honeypot/timing/rate limit/Turnstile/MX・使い捨て）を一括判定。検証リンク往復なし（D005）。ip/email はハッシュ化（SEC-001）、reject 理由は汎用文言。token 生成を spam に一本化（R1）。
### 変更内容
- verifySubmission（5 段合議、各段 fail で reject）+ 汎用 reject 文言
- generateThreadToken（128-bit、db/token は re-export に統合）
- Turnstile/MX injectable、rate limit key は sha256
### テスト
- 単体 17 件、全 GREEN。全体 105/105（100%）、typecheck クリーン。5 段分岐 + PII ハッシュ 100%。
