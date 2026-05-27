# _shared/spam 実装計画書

> **入力**: `./001_spam_SPEC.md`, `../db/001_db_SPEC.md`
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | LOC |
|---|---|---|
| `lib/spam/verify.ts` | verifySubmission（5 段の合議） | 90 |
| `lib/spam/turnstile.ts` | Turnstile サーバー検証（injectable） | 40 |
| `lib/spam/email-checks.ts` | MX 確認 + 使い捨てドメインブロック | 50 |
| `lib/spam/rate-limit.ts` | rateLimitRepo ラッパ（窓計算 + key hash） | 40 |
| `lib/spam/token.ts` | generateThreadToken（crypto base64url 128-bit） | 20 |
| `lib/spam/disposable-domains.ts` | 使い捨てドメインリスト（静的 or 軽量 dep） | データ |

## 2. 実装 Phase 分割
- **Phase 1**: token（純 crypto、テスト容易）+ honeypot/timing（純ロジック）
- **Phase 2**: rate-limit（db repo 連携）+ email-checks（MX は injectable、使い捨て静的）
- **Phase 3**: turnstile（injectable、mock で検証）+ verify（5 段合議統合）
- **最終**: 実 Turnstile test キー（always-pass）で結合（Phase 3/Release）

## 3. 依存関係順序
```
token / honeypot+timing → rate-limit(db) / email-checks → turnstile → verify(統合)
```

## 4. 既存ファイルへの影響
- inquiry の POST /api/inquiry が verifySubmission + generateThreadToken を呼ぶ。

## 5. リスク・注意点
- ip/email はハッシュ化して rate_limit key（平文保存しない、SEC-001）。
- Turnstile/MX は injectable で実依存なし CI green（O35）。
- [論点-005] Turnstile 障害時フェイル方針（推奨 reject）を verify に設定値で持つ。
- 理由をユーザーに詳細表示しない（bot にヒントを与えない、汎用文言）。

## 6. 完了の定義
- [ ] verify 5 段が全 pass で受理、各段 fail で reject
- [ ] token 128-bit URL-safe + 衝突リトライ（SEC-002）
- [ ] ip/email ハッシュ化（SEC-001）を test 担保
- [ ] 実 Turnstile/MX 不要で CI green（mock）

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
