# 実装前準備チェックリスト

**最終更新**: 2026-05-27 12:35
**集約元**: §4.3 リソース選定 / §6 外部連携 / §9 法務 / §4.5 ローカル開発 / §4.4 コスト / perspectives O25 / O27 / O29
**生成元**: /flow:concept

> 開発運用者向け実装前準備チェックリスト。状態列は `<!-- user-edit -->` 区間で手動更新可。
> `<!-- auto-generated -->` 区間は concept 実行のたびに最新化される。

<!-- auto-generated-start -->

## 1. 外部 API キー（環境変数 `.env.local`）

| サービス | 環境変数名 | 用途 | 取得 URL | プラン / 無料枠 |
|---|---|---|---|---|
| Resend | `RESEND_API_KEY` | 返信通知 / 新着通知メール | resend.com | Free 3,000 通/月（ドメイン認証必要） |
| Cloudflare Turnstile | `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | 不可視スパム判定 | dash.cloudflare.com → Turnstile | Free 1M req/月 |
| Clerk | `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | 運用者(admin)認証 | clerk.com | Free 10k MAU |
| Sentry | `SENTRY_DSN` | エラー監視 | sentry.io | Free 5,000 events/月 |
| service-hub status | `HUB_STATUS_URL`（+ 必要なら `HUB_STATUS_API_KEY`） | 稼働一覧取得 | （HUB 側で発行、[論点-001]） | read-only |

## 2. BaaS / インフラアカウント（§4.3）

| サービス | 用途 | 取得 URL | プラン | 制限 |
|---|---|---|---|---|
| **Neon** | DB（shipyard 専用 DB） | neon.tech | Free | 0.5 GB、10 DB |
| **Vercel** | ホスティング + Cron + Web Analytics | vercel.com | Hobby (Free) | 100 GB 帯域、Cron、cookieless Analytics |
| `DATABASE_URL` | Neon 接続文字列（env） | Neon ダッシュボード | — | pooled connection 推奨 |

## 3. ドメイン（公開 PJ、§4.7）

### 3.1 既存ドメインの活用（推奨）
| 項目 | 内容 |
|---|---|
| 既存ドメイン | `<domain>`（取得済み） |
| 本サービスの URL | `shipyard.<domain>`（サブドメ） |
| DNS 設定 | Vercel が指示する CNAME を既存 DNS に追加 |
| 撤退時 | DNS レコード 1 行削除で完結 |

### 3.3 PaaS 提供デフォルトドメイン（検証段階）
| サービス | デフォルトドメイン | 用途 |
|---|---|---|
| Vercel | `shipyard.vercel.app` | 検証段階で十分、本番カスタムドメイン化は後でも OK |

## 4. 認証プロバイダ設定（運用者のみ、perspectives O05）

| 項目 | 取得方法 | 必要性 | 備考 |
|---|---|---|---|
| Clerk App 作成 | clerk.com → New Application | admin 保護 | Publishable / Secret Key を .env.local に |
| allowlist 設定 | Clerk ダッシュボードで seiji のメールのみ許可 | 単一運用者 | restricted sign-up |
| ※ 訪問者側は認証なし | — | — | メアド + トークン URL のみ |

## 5. 決済プロバイダ設定
- **不要**（本サイトでの課金なし、コンサルは lead-gen のみ）

## 6. 法務書類準備（§9）

| 書類 | 必要性 | 配置 URL | 作成方法 |
|---|---|---|---|
| プライバシーポリシー | 必須（メール + 本文収集） | `/legal/privacy` | テンプレ + 自前ドラフト（`/flow:feature legal`） |
| 利用規約 | 推奨 | `/legal/terms` | 同上 |
| 特定商取引法表記 | 不要 | — | 有償取引なし |
| Cookie 同意バナー | 不要 | — | cookieless アナリティクス採用 |

## 7. 監視・アナリティクス（perspectives O01 / O02）

| サービス | 用途 | 取得 URL | プラン |
|---|---|---|---|
| Sentry | エラー監視 | sentry.io | Free |
| Vercel Web Analytics | 流入 / クリック計測（cookieless） | Vercel プロジェクト設定で有効化 | Hobby 無料 |

## 8. メール送信プロバイダ（perspectives O07）

| サービス | 用途 | プラン | 注記 |
|---|---|---|---|
| Resend | 返信通知 / 新着通知 | Free 3,000 通/月 | 送信元ドメイン認証（SPF/DKIM）が必要 |

## 9. ボット対策（perspectives O27）

| サービス | 用途 | プラン |
|---|---|---|
| Cloudflare Turnstile | 不可視 CAPTCHA（問い合わせフォーム） | Free 1M req/月 |
| （補助）honeypot / 送信タイミング trap / rate limit / MX・使い捨てチェック | 自前実装 | — |

## 10. ローカル開発環境準備（§4.5）

| 項目 | コマンド / 手順 |
|---|---|
| Node.js | nvm / asdf で管理（Next.js 対応版） |
| Neon dev ブランチ | Neon ダッシュボードで dev ブランチ作成、`DATABASE_URL` 取得 |
| Drizzle migrate | `npm run db:migrate` |
| Turnstile test キー | Cloudflare 提供の always-pass test キーを local で使用 |
| Resend test | test API キーで宛先=自分に送信確認 |
| `.env.example` 作成 | §1, §2, §4, §7, §8 のキー名をダミー値付きで列挙 |
| `.env.local` 作成 | コピー → 実値、`.gitignore` 確認 |
| Git pre-commit hook | gitleaks / detect-secrets で秘密情報のコミット防止 |

## 11. コスト試算（§4.4 由来）
- **初期コスト**: $0（全サービス無料枠）
- **月額目安**: $0（lead-gen、本サイト課金なし）
- **無料枠超過アラート**: Resend 通数 / Vercel 帯域 / Neon ストレージを 80% で通知（§4.6.2）

## 12. 実装着手前 最終チェックリスト

- [ ] §1-§9 の必須項目すべて取得済み（状態列 ✅）
- [ ] `.env.example` 作成、必須キー全定義
- [ ] `.gitignore` に `.env*.local` / `.env` 追加（O25）
- [ ] 法務書類ドラフト作成（公開前最終確認用）
- [ ] [論点-001] HUB status contract を HUB 側に依頼 or モックで開発開始
- [ ] `preferences.md` に採用ベンダー記録（将来 PJ のため）
- [ ] `/flow:secure --phase=design` で L1 設計レビュー実施
- [ ] CI に `npm audit` / Dependabot 組み込み

<!-- auto-generated-end -->

<!-- user-edit-start -->

## ユーザー手動メモ（auto-generated で保護）

### 取得状況（状態列）

| 項目 | 状態 | 取得日 / 備考 |
|---|---|---|
| RESEND_API_KEY | ❌ | |
| TURNSTILE キー | ❌ | |
| CLERK キー | ❌ | |
| Neon DATABASE_URL | ❌ | |
| SENTRY_DSN | ❌ | |
| HUB_STATUS_URL | ❌ | [論点-001] HUB 側実装待ち |

<!-- user-edit-end -->
