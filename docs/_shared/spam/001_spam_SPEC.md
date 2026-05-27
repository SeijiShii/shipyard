# _shared/spam 仕様書（横断基盤・不可視スパム対策）

> **役割**: 問い合わせフォームの不可視スパム対策スタック（Turnstile + honeypot + 送信タイミング trap + rate limit + MX/使い捨てチェック）。検証リンク往復なし（D005）。
> **タグ**: cross-cutting
> **最終更新**: 2026-05-27
> **入力**: `../../concept.md` §3.7 SEC-005/§4.3, `../db/001_db_SPEC.md`（rate_limits）, `~/.claude/flow-data/perspectives.md` O27, `./README.md`

---

## 1. 提供インターフェース
| 機能 | 提供 | 利用機能 |
|---|---|---|
| `verifySubmission(input)` | 不可視スタックを一括判定（pass/reject + 理由） | inquiry（POST /api/inquiry） |
| `generateThreadToken()` | 暗号論的乱数 token（128-bit, base64url、SEC-002） | inquiry / db.threadRepo |
<!-- spec-review R1: token 生成の単一責務はここ（spam）。db.threadRepo.create が本関数を呼んで生成、UNIQUE 衝突時は repo がリトライ（再度本関数を呼ぶ）。生成箇所を二重定義しない -->　

## 2. 入出力（verifySubmission）
入力: `{ turnstileToken, honeypot, formRenderedAt, ip, email, body }`
判定段（**全 pass で受理**、いずれか fail で reject）:
1. **honeypot**: 隠しフィールドが空でない → bot（reject、UX 無影響）
2. **送信タイミング trap**: `now - formRenderedAt < N 秒`（例 2s）→ 即時投稿 bot（reject）
3. **rate limit**: `rateLimitRepo.hitAndCount(key=hash(ip)+hash(email), window)` が上限超過 → reject（429）
   <!-- spec-review R3: 古い窓は読み取り時に window_start で無視 + 定期 cleanup（service-status の cron に相乗り or 別 cron）で N 日より古い rate_limits 行を削除。Neon 無料枠ストレージ保護 -->　
4. **Turnstile**: サーバー側で `TURNSTILE_SECRET_KEY` 検証（score/success）→ fail で reject
5. **MX / 使い捨てドメイン**: email ドメインの MX 確認 + 使い捨てブロックリスト照合 → fail で reject
出力: `{ ok: true } | { ok: false, reason }`。**理由はユーザーに詳細表示しない**（bot にヒントを与えない、汎用エラー文言）。

## 3. データモデル
`rate_limits`（_shared/db）を読み書き。使い捨てドメインリストは静的データ（lib 内 or 軽量パッケージ）。**email/ip は平文保存せずハッシュで rate_limit key 化**（SEC-001）。

## 4. バリデーション + エラーケース
| ID | 条件 | 振る舞い |
|---|---|---|
| SPAM-E1 | Turnstile API 失敗（HUB 側でなく Cloudflare 障害） | フェイルクローズ寄り（reject + 再試行案内）か フェイルオープン かは設定。MVP は **reject（安全側）** + 「時間をおいて再試行」 |
| SPAM-E2 | MX 確認タイムアウト | ベストエフォート（タイムアウトは pass 寄り、honeypot/Turnstile が主防御） |
| SPAM-E3 | rate limit 超過 | 429 + 汎用文言（「しばらくしてから」） |

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| UX | 不可視（通常ユーザーは無操作）、検証リンク往復なし | D005 |
| 公開エンドポイント保護 | O27 require（公開フォーム） | perspectives O27 |
| PII | ip/email はハッシュで rate_limit key、平文ログなし | SEC-001 |
| token | 128-bit 以上 URL-safe、衝突リトライ | SEC-002 |
- 連携: inquiry（送信判定 + token 生成）/ db（rate_limits）。Turnstile SITE_KEY はクライアント（公開可）、SECRET はサーバー。

## 6. スコープ外
- WAF / DDoS（Cloudflare 前段は §4.7 で PaaS 完結のため MVP 外）
- 機械学習ベースのコンテンツスパム判定（ヒューリスティックのみ）

## 7. 未決事項
### [論点-005] Turnstile 障害時のフェイル方針
- **影響範囲**: §4 SPAM-E1, inquiry 送信 UX
- **問い**: Cloudflare Turnstile が落ちた時、reject（安全・送信不可）か pass（可用性・他防御に依存）か
- **候補**: 案A reject（安全側、推奨）/ 案B pass（honeypot+timing+rate limit に依存）
- **推奨**: 案A（reject + 再試行案内）。理由: スパム流入より一時的送信不可の方が害が小さい。ただし Turnstile 障害は稀。
- **判断期限**: inquiry 実装時（tdd）
- **担当**: seiji

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成（不可視スタック 5 段 + token 生成） | /flow:feature |
