# shipyard

> **一行で言うと**: 運用中の自作マイクロサービス群をリアルタイム稼働状況で一般公開し、「ちゃんと動いている」信頼を土台に、AI 活用の正解が見えない人と「共に考える相談相手」として出会う公開ショーケース + 相談導線。

| 項目 | 内容 |
|---|---|
| ユーザー | サービスを見に来た一般の訪問者（AI 活用に悩む個人・小規模事業者 / SNS・検索流入の潜在相談者）+ 運用者（seiji、問い合わせに返信する側） |
| 解決する課題 | AI の進歩が速く「自分のビジネスにどう取り込めばいいか分からない」と悩む人が多い一方、先進的な開発者も「絶対の正解」は持っていない。動いているサービス群で実装力の信頼を作り、「答えを売る」のではなく「正解の見えない世界で共に考える相談相手」と出会う |
| 提供価値 | リアルタイム稼働状況による「本当に動いている」実装力の信頼 + 週1ペースで AI 駆動開発を回しているメイカーの実践実績 + 「正解の分からない世界で共に考え・共に悩む」スタンス + 気軽に相談できる問い合わせ導線 |
| 現フェーズ | 企画（concept 更新 — メッセージング転換 2026-05-28） |
| 最終更新 | 2026-05-28 |

---

## 1. プロダクト概要

shipyard は、seiji が運用している自作マイクロサービス群を一般向けに公開するショーケースサイト兼相談導線。中核は「いま実際に動いているサービス一覧」をリアルタイムの稼働状況（up/down）付きで見せることで、「口先だけでなくちゃんと動いているものがある」という実装力の信頼を訪問者に与えること。その信頼を土台に、メイカー（seiji）自身のスタンス —「週1ペースで AI 駆動開発を回しているが、それが 1〜2 年後も通用するかは分からないし、AI 活用の絶対の正解は誰にも分かっていない。だから『AI 駆動でアプリを作ってビジネスを成功させましょう』とは主張しない。正解の見えない世界で **共に考え・共に悩み**、相談者のビジネスの強みを生かす相手として手伝いたい」— を素直に打ち出す。問い合わせフォーム（サイト内スレッド形式）は、コンサル案件の lead 獲得装置ではなく、「これからを共に考えてほしい」と感じた人との出会いの導線として位置付ける。

稼働情報は別サービス **service-hub**（内部観測 HUB、非公開・Clerk gate）が公開する読み取り専用 API `GET /api/public/status` の安全サブセット（slug / 表示名 / URL / up・down / 稼働開始日）のみを消費する。HUB の財務・コスト・離脱率などの内部指標や PaaS トークンとは絶対に同居・公開しない。shipyard 自体は HUB とは別 repo・別デプロイ・別サブドメインで運用し、撤退時は DNS 1 行削除でほぼ完結する軽量構成を取る。

### 1.1 主要ユースケース
1. **稼働一覧を見て信頼する**: 訪問者がトップで「いま動いているサービス一覧」をリアルタイム up/down 付きで見て、「本当に運用されている」と確認する。
2. **個別サービスへ遷移する**: 訪問者が気になったサービスのリンクから実サービスへ移動する。
3. **メイカーのスタンスを読んで共感する**: 訪問者が LP で「何者か（週1ペースで AI 駆動開発を回している実践者）／何ができるか（実装力は動いているサービス一覧が裏付け）／どんなスタンスで関わるか（『AI 駆動で成功させましょう』とは言わない。正解の分からない世界で **共に考え・共に悩む** 相談相手として手伝う）」を理解し、「これからを共に考えてほしい」と感じる。
4. **問い合わせスレッドを立てる**: 共感した訪問者がメールアドレス + 本文を入力して問い合わせを送信 → 不可視スパム対策を通過 → サイト内にスレッドが即生成・表示され、トークン URL で後から戻れる。
5. **サイト内で会話が続く**: 運用者（seiji）が admin で返信 → 訪問者にメール通知 → 訪問者がリンク or ブラウザ保持でスレッドに戻り追記、というやり取りがサイト内で継続する。
6. **検索・SNS から流入する**: OGP/SEO 経由で検索・SNS シェアから新規訪問者が入口（「これは何？」が分かるトップ）に到達する。

### 1.2 スコープ
**含むもの**:
- 稼働サービス一覧（HUB status API の read-only 消費 + キャッシュ + リアルタイム up/down 表示 + 各サービスへのリンク）
- LP（提供価値 / メイカー紹介 / AI コンサルの打ち出し / OGP / SEO）
- 問い合わせ機能（サイト内スレッド形式・メアド必須・不可視スパム対策・返信通知メール）
- 運用者 admin（Clerk gate、問い合わせスレッド一覧 / 返信）
- 法務ページ（プライバシーポリシー / 利用規約）

**含まないもの（明示除外）**:
- HUB の内部指標（財務 / コスト / 離脱率 / PaaS トークン）の表示・保持 — **絶対除外**
- 本サイトでの課金・決済（コンサルは lead-gen のみ、成約・請求は別チャネル）
- 訪問者（問い合わせ側）のアカウント登録・ログイン（メアド + トークン URL で足りる）
- 外部 AI サービスの呼び出し（shipyard 自体は AI を叩かない。§6 参照）
- 特定商取引法表記（有償サービスではないため不要。§9 参照）

### 1.3 ドキュメントフォルダ分割設計

> **重要**: ここで設計するのは `docs/` 配下の**ドキュメント置き場**の構造であって、実装コード (`src/` 等) の構造ではない（§1.4 参照）。

#### 1.3.1 機能フォルダ（業務ドメイン別、機能設計コマンドの実行単位）

| フォルダ (docs/ 配下) | 含む機能 | 担当する画面 / API | 依存 | 優先度 | 基盤 |
|---|---|---|---|---|---|
| docs/landing/ | LP（提供価値 / メイカー紹介 / コンサル打ち出し / 入口の「これは何？」） | `/`（トップ）、OGP メタ | _shared/ui, _shared/seo | 3 | ❌ |
| docs/service-status/ | 稼働サービス一覧の取得・キャッシュ・表示・リンク | `/`内セクション or `/services`、`GET /api/services`（自前、キャッシュ配信） | _shared/hub-client, _shared/ui | 3 | ❌ |
| docs/inquiry/ | 問い合わせスレッド（送信フォーム / 不可視スパム対策 / スレッド表示 / 訪問者の追記 / 返信通知） | `/contact`、`/t/[token]`（スレッド）、`POST /api/inquiry`、`POST /api/inquiry/[token]/reply` | _shared/db, _shared/spam, _shared/email, _shared/ui | 3 | ❌ |
| docs/admin/ | 運用者コンソール（問い合わせ一覧 / スレッド返信、Clerk gate） | `/admin/*`、`POST /api/admin/threads/[id]/reply` | _shared/db, _shared/auth, _shared/email, _shared/ui | 4 | ❌ |
| docs/legal/ | プライバシーポリシー / 利用規約（公開ページ） | `/legal/privacy`、`/legal/terms` | _shared/ui, _shared/seo | 3 | ❌ |

#### 1.3.2 横断フォルダ（機能をまたぐ技術設計）

| フォルダ (docs/ 配下) | 責務 | 含む設計 | 依存 | 優先度 | 基盤 |
|---|---|---|---|---|---|
| docs/_shared/db/ | DB スキーマ・マイグレーション（Neon + Drizzle） | threads / messages / inquirers / rate_limit / service_status_cache テーブル、制約、インデックス | (なし) | 1 | ✅ |
| docs/_shared/ui/ | UI 基盤（shadcn/ui + Tailwind + テーマ） | デザイントークン適用、共通コンポーネント | (なし) | 1 | ✅ |
| docs/_shared/seo/ | SEO/OGP 基盤 | メタタグ / 構造化データ(JSON-LD) / sitemap / 動的 OG 画像 | (なし) | 1 | ✅ |
| docs/_shared/hub-client/ | service-hub status API クライアント + キャッシュ | contract 型 / fetch / Neon キャッシュ書込 / 定期更新(Cron) / HUB ダウン時フォールバック | _shared/db | 2 | ✅ |
| docs/_shared/email/ | メール送信（Resend ラッパ） | 返信通知メール / 新着通知メール / スレッドリンク埋め込み | (なし) | 1 | ✅ |
| docs/_shared/spam/ | 不可視スパム対策 | Turnstile 検証 / honeypot / 送信タイミング trap / rate limit(Neon) / MX・使い捨てドメインチェック | _shared/db | 2 | ✅ |
| docs/_shared/auth/ | 運用者認証（Clerk、operator/admin のみ） | Clerk 設定 / allowlist(seiji) / admin ルート保護 | (なし) | 1 | ✅ |

#### 1.3.3 依存・優先度・基盤の定義
- **依存**: そのフォルダが先に必要とする他フォルダ。空は `(なし)`。循環依存なし。
- **優先度**: topological sort 順（小さいほど先）。優先度 1 = 依存なし、2 = 1 のみに依存、3+ = それ以降。
- **基盤**: 横断は全て ✅。機能フォルダは他から参照されないため ❌。

#### 1.3.4 優先度算出結果（topological sort）
```
優先度 1（依存なし・基盤）: _shared/db, _shared/ui, _shared/seo, _shared/email, _shared/auth
優先度 2（P1 に依存・基盤）: _shared/hub-client (← db), _shared/spam (← db)
優先度 3（機能）: landing (← ui,seo), service-status (← hub-client,ui), inquiry (← db,spam,email,ui), legal (← ui,seo)
優先度 4（機能）: admin (← db,auth,email,ui)
```
循環依存: なし。

> この依存・優先度は auto-pick（Class A）で算出した。修正したい箇所があれば concept.md を直接編集するか次回 `/flow:concept` で指摘可。

#### 1.3.5 命名規約
- 機能フォルダ: ケバブケース業務名（`service-status`, `inquiry`, `admin`, `landing`, `legal`）
- 横断フォルダ: `_shared/<技術領域>/`

### 1.4 実装コードフォルダ構成（たたき台）

> Q11 で確定した **Next.js (App Router) + TypeScript** に整合したテンプレート。あくまでたたき台、実装フェーズで詳細化。機能境界の名前は §1.3 機能フォルダと揃える。

```
app/                         # Next.js App Router
  (public)/
    page.tsx                 # landing（トップ）
    services/                # service-status（一覧、トップ内 or 独立）
    contact/                 # inquiry（送信フォーム）
    t/[token]/               # inquiry（スレッド表示・追記）
    legal/
      privacy/
      terms/
  admin/                     # admin（Clerk gate）
    threads/
  api/
    services/route.ts        # キャッシュ済 status 配信
    inquiry/route.ts         # 問い合わせ送信
    inquiry/[token]/reply/route.ts
    admin/threads/[id]/reply/route.ts
    cron/refresh-status/route.ts  # HUB status 定期取得（Vercel Cron）
features/                    # 機能単位ロジック（§1.3 と命名統一）
  landing/
  service-status/
  inquiry/
  admin/
lib/
  db/                        # _shared/db（Drizzle schema + client）
  hub-client/                # _shared/hub-client
  email/                     # _shared/email（Resend）
  spam/                      # _shared/spam（Turnstile + honeypot + rate limit + MX）
  auth/                      # _shared/auth（Clerk helpers）
  seo/                       # _shared/seo（OGP / JSON-LD / sitemap）
components/                  # _shared/ui（shadcn/ui + 共通部品）
types/                       # 共通型（hub-client contract 等）
```

#### 1.4.2 §1.3 ドキュメントフォルダとの対応
- 機能は名前を揃える（`docs/inquiry/` ↔ `features/inquiry/` + `app/(public)/contact/`）
- 横断は `docs/_shared/<領域>/` ↔ `lib/<領域>/`（ui は `components/`）

## 2. 前提条件・制約
- **業務前提**: service-hub が `GET /api/public/status`（安全サブセット）を提供する前提（HUB 側実装は別タスク。§8 [論点-001]）。未実装の間はモック contract で開発。
- **アーキテクチャ前提（既決）**: HUB とは別 repo / 別デプロイ / 別サブドメイン。HUB の財務データ・PaaS トークンと同居しない。HUB status は read-only 消費 + キャッシュして叩きすぎない。
- **公開前提**: 訪問者は認証なし（メアド + トークン URL）。運用者のみ Clerk 認証。
- **技術制約**: 無料枠厳守（目標 $0/月）。撤退容易性最優先（DNS 1 行削除 + Vercel/Neon 削除）。
- **体制・予算・納期**: 個人開発、週1ペース。無料枠内。短期で MVP 公開。

## 3. 非機能要件

> 公開 LP + 軽量スレッド機能の性質に合わせた項目構成。

| 項目 | 目標値 | 根拠 |
|---|---|---|
| 性能（初回表示） | LCP < 2.5s、トップは SSG/ISR で配信、Core Web Vitals 合格 | wants「初回表示の軽さ」、SEO 評価 |
| 可用性 | HUB ダウン時もキャッシュした最終既知ステータスを表示（graceful degradation）、静的部分は常時表示 | HUB 依存を単一障害点にしない |
| セキュリティ | 不可視スパム対策（Turnstile + honeypot + timing + rate limit + MX/使い捨てチェック）、PII 最小（メール + 本文のみ）、admin は Clerk gate、HUB トークン/内部指標と非同居 | wants スパム対策・PII 配慮・アーキ分離 |
| SEO/共有性 | OGP（`og:image` 動的生成）、構造化データ(JSON-LD)、sitemap.xml、検索インデックス | wants「共有・検索される前提」 |
| プライバシー | 問い合わせ者のメール + 本文を保存 → プライバシーポリシー必須。アナリティクスは cookieless（consent banner 不要） | §9 法務、メール収集 |
| 運用・監視 | Sentry エラー監視（無料）、自前コストログ + 無料枠超過アラート、撤退手順文書化 | §4.6 / §4.7 |

<!-- auto-generated-start -->
### 3.7 セキュリティ要件（auto-added by /flow:secure, 2026-05-27）

L1 設計レビュー（`docs/SECURITY_REVIEW_20260527.md`）で検出した Critical/High を要件化:

- **[SEC-001] PII ログ漏洩防止（法令必須, O26）**: Sentry `beforeSend` で email / 問い合わせ本文 / トークンをマスク。エラーメッセージに DB 内容・本文を含めない。Vercel Web Analytics イベントに PII を入れない（cookieless + anonymous ID のみ）。
- **[SEC-002] 認可 / IDOR 防止（O23）**: thread.token は暗号論的乱数（128-bit 以上、URL-safe）。全 thread/message 取得・追記エンドポイントで token 一致をサーバー側検証（連番 id を URL に露出しない）。`/admin/*` + admin API は Clerk + allowlist(seiji) で RBAC。
- **[SEC-003] 入力検証 / XSS 防止（O24）**: API 入力は Zod スキーマで検証（email 形式・本文長上限）。問い合わせ本文は表示時にプレーンテキスト扱い（`dangerouslySetInnerHTML` 禁止、Markdown 許可時は `rehype-sanitize`）。HUB status URL は env 固定で SSRF 低リスク。
- **（対応済み, O27）レート制限 / ボット対策**: 問い合わせは不可視スタック（Turnstile + honeypot + timing + rate limit + MX/使い捨てチェック）で対応済み（§4.3 / `_shared/spam`）。
- **（対応済み, O25）秘密情報**: `.env*.local` を `.gitignore` 除外、秘密はサーバー側 env のみ、公開値は Turnstile SITE_KEY / Clerk PUBLISHABLE_KEY のみ（§4.5.3 / §10.7）。
<!-- auto-generated-end -->

## 4. 全体アーキテクチャ

```
                  ┌──────────────────────────────────────────┐
   訪問者(一般) ─▶ │ shipyard.<domain>  (Vercel / Next.js)      │
                  │  ├─ landing (SSG/ISR)                       │
                  │  ├─ service-status ◀── /api/services (cache)│
                  │  ├─ inquiry (form → thread, token URL)      │
                  │  └─ legal                                   │
   運用者(seiji) ▶ │  └─ /admin/* (Clerk gate)                   │
                  └───┬───────────────┬───────────────┬─────────┘
                      │ read-only      │ persist       │ send
                      ▼                ▼               ▼
          service-hub          Neon(Postgres)        Resend
       GET /api/public/status  threads/messages/    (返信通知/
       (安全サブセットのみ)      inquirers/rate_limit/  新着通知)
       ※財務/トークン非同居     service_status_cache
                                                      Turnstile
                                                   (不可視スパム判定)
```

### 4.1 主要コンポーネント
| 名前 | 責務 | 技術領域 (具体名は例示) |
|---|---|---|
| Web アプリ | LP / 稼働一覧 / 問い合わせ / admin の配信 | Next.js App Router (例: SSG/ISR/Route Handler) |
| status キャッシュ | HUB status を定期取得し保存・配信 | サーバーレス関数 + 定期実行 (例: Vercel Cron) + DB テーブル |
| 問い合わせ永続化 | スレッド / メッセージ / 問い合わせ者 / レート制限 | リレーショナル DB (例: Neon Postgres + Drizzle) |
| スパム判定 | 不可視 CAPTCHA + honeypot + timing + rate limit + メールチェック | 例: Cloudflare Turnstile + サーバー側検証 |
| 通知 | 返信通知 / 新着通知メール | トランザクションメール (例: Resend) |
| 運用者認証 | admin ルート保護（単一運用者） | 認証プロバイダ (例: Clerk、allowlist) |

### 4.2 技術スタック（方向性）
- フロント: SSR/SSG 可能な React フレームワーク（採用: **Next.js App Router** + TypeScript）— SEO/OGP 必須のため Vite SPA から override（§7 D20260527-007）
- UI: コンポーネントライブラリ + ユーティリティ CSS（採用: shadcn/ui + Tailwind）
- データ層: リレーショナル DB + 型安全 ORM（採用: Neon Postgres + Drizzle）
- 外部連携: service-hub status API（read-only 消費）、Resend（メール）、Turnstile（スパム）
- 認証: 運用者のみ（採用: Clerk）
- インフラ: ホスティング一体型 PaaS（採用: Vercel Hobby、サブドメ運用）
- 監視・ログ: エラー監視（採用: Sentry Free）+ 自前コストログ + cookieless アナリティクス（採用: Vercel Web Analytics）

### 4.3 リソース選定たたき台

> **注**: pricing は変動する。採用判断時は必ず最新の公式 pricing を確認。以下は概念設計時点の桁感（USD 月額）。

| カテゴリ | 推奨具体名 | 代替候補 | 選定根拠 | 想定単価 (USD/月、桁感) |
|---|---|---|---|---|
| フロント FW | Next.js (App Router) + React + TS | Remix / Astro | SEO/OGP/SSR 必須、Vercel ネイティブ、Route Handler 一体（preferences §2.1 React+TS は維持） | $0 ※ 2026-05 時点想定、最新 pricing 要確認 |
| UI | shadcn/ui + Tailwind | Radix + 自前 | preferences §2.14 採用 4（強選好）、ミニマル路線に好適 | $0 ※ 同上 |
| DB | Neon (Postgres) | Supabase(連発不適) / PlanetScale | preferences §3.1、サービスごと DB 分離、無料 10 DB | $0（Free 0.5GB）※ 同上 |
| ORM | Drizzle | Prisma | preferences §2.13 採用 3、Neon 親和・型安全 | $0 ※ 同上 |
| 運用者認証 | Clerk | Auth.js / Lucia | preferences §2.4 採用 3、admin 単一運用者の allowlist が簡潔 | $0（Free 10k MAU、運用者 1 名）※ 同上 |
| メール送信 | Resend | SendGrid / Postmark | preferences §2.18、無料 3,000 通/月、DX 良好 | $0（Free）※ 同上 |
| スパム対策 | Cloudflare Turnstile | reCAPTCHA v3 / hCaptcha | 不可視・プライバシー配慮・consent 不要、O27 推奨 | $0（Free 1M req/月）※ 同上 |
| ホスティング | Vercel Hobby | Cloudflare Pages | preferences §2.5 採用 4、サブドメ運用容易、Cron 統合 | $0（Hobby）※ 同上 |
| 定期実行 | Vercel Cron | GitHub Actions cron | status 定期取得、ホスティング統合 | $0 ※ 同上 |
| アナリティクス | Vercel Web Analytics | Plausible / Umami | cookieless・consent banner 不要、流入計測、Hobby 無料 | $0（Hobby 含む）※ 同上 |
| 監視 | Sentry (Free) | — | preferences §2.6 採用 4、5,000 events/月 | $0（Free）※ 同上 |
| CI/CD | GitHub Actions + Vercel Preview | — | preferences §2.8 採用 4 | $0 ※ 同上 |
| ドメイン | 既存ドメインのサブドメ `shipyard.<domain>` | — | O29、撤退リスク最小（DNS 1 行削除）、追加コストゼロ | $0（既存ドメイン年額のみ）※ 同上 |

### 4.4 想定コストサマリ

| 区分 | 月額目安 (USD) | 内訳の例 |
|---|---|---|
| 個人・無料枠 | **$0** | Neon Free + Vercel Hobby + Clerk Free + Resend Free + Turnstile Free + Sentry Free（ドメインは既存サブドメで追加ゼロ） |
| PoC・社内検証 | $0〜$10 | 上記 + 監視/メール軽量超過分（あれば） |
| スモール商用 (DAU 〜100) | $20〜$50 | 想定外（本 PJ は lead-gen、課金なし） |

**本プロジェクトのレンジ**: **個人・無料枠（$0）**。根拠: lead-gen のみで本サイト課金なし、トラフィックは個人ポートフォリオ規模 + SNS バズ時スパイク。**無料枠厳守、上限到達時は §4.3 の代替候補に切替判断**（特に Resend 通数 / Vercel 帯域 / Neon ストレージを監視）。

### 4.5 ローカル開発環境計画

#### 4.5.1 開発スタイル
**選定**: サーバーレス emulation（ハイブリッド寄り）
**理由**: Next.js + Vercel 構成。アプリ本体はホストで `next dev`、DB は Neon のクラウド dev ブランチ（または Neon local proxy）を使用。重いコンテナ群は不要。

#### 4.5.2 必要サービス（ローカル起動対象）
| サービス | 役割 | ローカル起動方式 | ポート | 永続化 |
|---|---|---|---|---|
| Next.js dev server | アプリ本体 | `next dev` | 3000 | host-fs |
| Neon (dev ブランチ) | DB | クラウド dev ブランチに接続（Drizzle migrate） | — | クラウド |
| service-hub (モック or 実) | status API | モック JSON or 実 HUB の dev URL | — | (なし) |
| Resend (test mode) | メール | API キー（test）で送信、宛先は自分 | — | (なし) |
| Turnstile (test keys) | スパム | Cloudflare 提供の always-pass test キー | — | (なし) |

#### 4.5.3 環境変数・シークレット管理
- **`.env.example`**: 必須キー一覧（ダミー値 + コメント）。Git コミット可。
- **`.env.local`**: 実値。Git コミット禁止（`.gitignore` 必須）。
- **シークレット管理方針**: 平文 `.env.local`（個人開発）。pre-commit で gitleaks/detect-secrets 推奨（O25）。
- **平文コミット禁止**: `DATABASE_URL` / `CLERK_SECRET_KEY` / `RESEND_API_KEY` / `TURNSTILE_SECRET_KEY` / `HUB_STATUS_URL`（公開だがまとめて env 管理）。

#### 4.5.4 起動・停止・リセットコマンド（抽象表現 + 例）
| 操作 | 抽象表現 | 例 |
|---|---|---|
| 起動 | dev サーバー起動 | `./scripts/dev.sh` または `npm run dev` |
| 停止 | dev サーバー停止 | `Ctrl+C` または `./scripts/stop.sh` |
| マイグレーション | スキーマ適用 | `npm run db:migrate`（Drizzle） |
| リセット | dev DB リセット + シード | `npm run db:reset` |
| smoke test | 主要エンドポイント疎通 | `npm run test:smoke` |

#### 4.5.5 開発フロー上の留意点
- 初回: `npm install` → `.env.local` 作成 → `npm run db:migrate`
- HUB が未実装の間はモック status JSON で `service-status` を開発（[論点-001]）
- ホットリロード: Next.js が標準対応
- OS 差異: WSL2 で `next dev` のポートフォワード（スマホ実機確認時は `/flow:release` のガイド参照）

#### 4.5.7 dev 起動スクリプト計画（O36）
- launcher 種別: **bash**（`scripts/dev.sh` / `scripts/stop.sh`）
- 起動順序: env チェック → `db:migrate`（必要時）→ `next dev`
- health check: `http://localhost:3000/`（200）
- smoke test endpoint: `/`（トップ）、`/api/services`（キャッシュ status）、`/contact`（フォーム表示）
- stop script cleanup: `next dev` プロセス停止のみ（外部 DB は触らない）

#### 4.5.6 CI/CD との関係
- CI で同じ Neon dev ブランチ or 一時 DB を使用（再現性）。
- 本番との差異: Turnstile は test キー（local）→ 本番キー、Resend は test → 本番ドメイン認証。

### 4.6 コスト・収益追跡と継続判断ループ

> **PJ 性質**: 個人ツール / 無料枠厳守（lead-gen、本サイト課金なし）。§4.6.1 該当レベル = **個人ツール / 無料枠**。

#### 4.6.1 必要レベル
| 項目 | 本 PJ |
|---|---|
| コスト追跡 | ✅ 必須 |
| 無料枠超過アラート | ✅ 必須 |
| 収益指標 | ❌ 不要（lead-gen、本サイト直接収益なし。KPI として問い合わせ数 / 各サービスクリック数を追跡） |
| BEP | ❌ 不要 |
| レビュー | 任意（四半期推奨） |
| 撤退判断 | 必須（無料枠超過時の対応方針 + lead 価値が薄い場合の縮退） |
| 判断主体 | 本人（seiji） |

#### 4.6.2 コスト集計メカニズム（システム内部計測）
- **積算記録**: 外部呼び出しを 1 件ごとにログ記録
  - Resend 送信回数（返信通知 / 新着通知）
  - HUB status fetch 回数（Cron 実行回数）
  - Neon クエリ / ストレージ使用量（ダッシュボード突合）
  - Vercel 帯域 / Function 実行数
- **単価表は `.env` で管理**（例）:
  ```
  COST_RESEND_PER_EMAIL=0
  COST_VERCEL_BANDWIDTH_PER_GB=0
  COST_NEON_STORAGE_PER_GB_PER_MONTH=0
  # 無料枠内は 0、超過時に実単価を記入して概算
  ```
- **概算コスト算出**: `ログ件数 × 単価`。機能別 / 月次集計。
- **アラート閾値**: 各無料枠の 80% / 100% で通知（Resend 通数、Vercel 帯域、Neon ストレージ）。

#### 4.6.3 追跡するコスト指標
| 指標 | 集計頻度 | 集計元 |
|---|---|---|
| Resend 送信数 | 月次 | 自前ログ + Resend ダッシュボード |
| HUB fetch 回数 | 日次 | Cron 実行ログ |
| Neon ストレージ / Vercel 帯域 | 日次 | 各ダッシュボード |

#### 4.6.4 KPI（lead-gen のため収益指標の代替）
| 指標 | 計測元 | 備考 |
|---|---|---|
| 問い合わせ数 | inquiry テーブル | 主要 KPI |
| 各サービスへのクリック数 | Vercel Web Analytics / 自前イベント | showcase 効果測定 |
| 流入数 / 流入元 | Vercel Web Analytics（UTM/Referer） | 公開周知効果 |

#### 4.6.6 レビューサイクル
| サイクル | 内容 | 参加者 |
|---|---|---|
| 日次（自動） | 無料枠超過アラート、Sentry エラー | システム自動 |
| 四半期（人間） | コスト + KPI（問い合わせ数 / 流入）レビュー | 本人 |

#### 4.6.7 継続 / 縮退 / 撤退判断基準
| 判断 | 基準 | 対応 |
|---|---|---|
| 継続 | 無料枠内 + 問い合わせ or showcase 価値あり | 通常運用 |
| 縮退 | 一部機能が無料枠を圧迫 | キャッシュ間隔延長 / 通知頻度削減 |
| 撤退 | 無料枠超過の代替もなく lead 価値も薄い | §4.7.5 撤退手順（DNS 1 行削除） |

#### 4.6.8 判断主体と決裁
- 判断主体: 本人（seiji）。判断ログは `docs/AI_LOG/` に記録。

### 4.7 公開戦略・ドメイン・リバースプロキシ

#### 4.7.1 ドメイン情報
- **既存ドメイン**: あり（`<domain>`、DNS 管理は既存）
- **本サービスの公開 URL**: `shipyard.<domain>`（サブドメ運用、撤退リスク最小）
- 新規ドメイン取得: なし

#### 4.7.2 公開構成パターン
- **採用パターン**: **(A) PaaS 完結**（Vercel ホスティング、運用負担ゼロ）
- 構成図:
```
訪問者 → 既存 DNS (CNAME) → Vercel (Next.js) → Neon / Resend / Turnstile
                                            → service-hub status API (read-only)
```

#### 4.7.3 リバースプロキシ設定
- **採用**: なし（Vercel が配信・SSL を担うため不要）

#### 4.7.4 サブドメ命名規約
- `shipyard.<domain>`: 本サービス
- `preview-*.vercel.app`: Vercel プレビューデプロイ（PR ごと自動）

#### 4.7.5 撤退時の手順（撤退コスト最小化、§4.6.7 連携）
1. 進行中の問い合わせスレッドに終了告知 + データ持ち出し案内（必要時）
2. `shipyard.<domain>` の DNS レコード削除（1 行）
3. Vercel プロジェクト削除
4. Neon DB データをエクスポート → N ヶ月（最低 6 ヶ月）保管 → 削除
5. Resend / Clerk / Turnstile のプロジェクト/キー無効化
6. HUB 側は影響なし（read-only 消費のみだったため）

#### 4.7.6 複数 PJ 相乗り時の隔離
- 本サービスは PaaS 完結で独立（Neon は専用 DB、HUB とは別 repo/デプロイ）。VPS 相乗りなし。

### 4.8 サービス公開周知 / マーケティング戦略

> shipyard 自体がメイカーの showcase（メタ的な周知装置）だが、shipyard 自身の周知も必要。

#### 4.8.1.1 個人開発での優先順位（本 PJ 確定）
| 優先度 | チャネル | 本 PJ の採用 |
|---|---|---|
| ★★★ 必須 | 製品内グロース（各サービスへの送客 + 信頼）+ SEO | 採用（§4.8.2 / §4.8.3） |
| ★★★ 必須 | note（記事）+ OGP | 採用（月 1 記事目安） |
| ★ 既存維持 | X（開発者向け、Build in Public） | 既存活動継続、新規開設しない |
| 任意 | Product Hunt / Hacker News（英語圏） | 任意 |

#### 4.8.2 製品内グロース設計
- shipyard 自体が「動いているサービス一覧」を見せる信頼装置。各サービスへの自然な送客がグロース。
- 強制シェア・射幸心煽りは行わない（charter §2.2 / O31 準拠）。
- 問い合わせ導線は「気軽に相談」トーン、煽らない（wants）。

#### 4.8.3 SEO / ASO
- 狙うキーワード（例）: 「AI 駆動開発 コンサル」「個人開発 マイクロサービス 実績」「<自分の名義> 開発」
- 技術 SEO: 構造化データ(JSON-LD)、sitemap.xml、Core Web Vitals 合格、HTTPS（Vercel 自動）
- コンテンツ SEO: 「何者か / できること / 進め方」ページ、note 記事連携
- 既存ドメインのオーソリティをサブドメで一部継承（O29）

#### 4.8.4 Build in Public ストーリー軸
- 「週1ペースで AI 駆動開発」「稼働中のマイクロサービス群」を継続コンテンツ素材に。
- shipyard 自身がその実績の可視化なので、更新が即コンテンツになる。

#### 4.8.5 OGP / Twitter Card（必須）
- `og:title` / `og:description` / `og:image`（動的生成）/ `og:url`、`twitter:card: summary_large_image`
- `/flow:promote` で告知文面生成（手動投稿）

#### 4.8.7 コンテンツペース
- 最小: 月 1 記事 + 新サービス公開時に X 投稿。疲弊しない継続を優先。

#### 4.8.9 計測（O02/O15）
- 流入元計測（UTM/Referer、Vercel Web Analytics、cookieless）
- 各サービスへのクリック計測（showcase 効果）

## 5. データ設計（高レベル）

### 5.1 主要エンティティ
- **inquirer**: 問い合わせ者。`id` / `email` / `created_at`（アカウントではなく、メアド単位の識別）
- **thread**: 問い合わせスレッド。`id` / `inquirer_id` / `token`(URL アクセス用、推測不能) / `subject` / `status`(open/closed) / `created_at` / `last_activity_at`
- **message**: スレッド内メッセージ。`id` / `thread_id` / `sender`(visitor/operator) / `body` / `created_at`
- **rate_limit**: レート制限カウンタ。`key`(ip or email hash) / `window_start` / `count`
- **service_status_cache**: HUB status のキャッシュ。`slug` / `name` / `url` / `status`(up/down/unknown) / `since` / `last_checked_at` / `fetched_at`

> 監査ログテーブルは単一運用者のため MVP では不要（§3 / Q12.7(4)）。改ざん防止が必要になれば message を append-only 運用に。

### 5.2 データフロー
- **status**: Cron → HUB `GET /api/public/status` → `service_status_cache` 上書き → `/api/services` がキャッシュ配信。HUB ダウン時は前回値 + `last_checked_at` を「〜時点」で表示。
- **inquiry 送信**: フォーム → 不可視スパム判定（pass）→ inquirer upsert + thread + 初回 message 作成 + token 発行 → 画面に thread URL 表示 + localStorage 保存 + メールにリンク送付 + 運用者へ新着通知。
- **返信**: 運用者(admin) → message(operator) 追加 → 訪問者へ返信通知メール（スレッドリンク）。訪問者 → token URL で開く → message(visitor) 追記。

## 6. 外部連携

> **外部 AI サービス利用: なし**（Q12.5 で明示確認、根拠: shipyard は AI 駆動開発を"打ち出す"サービスであって、サービス自体が AI API を叩く要件はない。無料枠厳守とも整合）。
>
> **アナリティクス・計測ツール利用: 使う（最小構成）**。Vercel Web Analytics（cookieless）で流入・クリック計測 + 自前コストログ。**cookieless のため consent banner 不要**、IP は Vercel 側で匿名化。GA4 は consent banner / プラポリ追記コストを避けて見送り（preferences §5 と整合）。プライバシーポリシーに「cookieless アナリティクス利用」を明記。

| 連携先 | 用途 | 方式 | 認証 |
|---|---|---|---|
| service-hub `GET /api/public/status` | 稼働サービス一覧（安全サブセット） | REST（read-only、定期 fetch + キャッシュ） | 公開 API（不要） or 軽い API キー（HUB 側方針次第、[論点-001]） |
| service-hub ← shipyard `GET /api/hub/service-info`（**公開する側**、O48） | service-hub が shipyard 自身の稼働/アプリ層指標を pull | REST（HUB が pull、最小固定契約 + extra/optional） | `HUB_SHARED_SECRET`（env、Bearer 検証、読み取り専用）。契約 SoT=service-hub、確定後に再整合 |
| Resend | 返信通知 / 新着通知メール | REST API / SDK | `RESEND_API_KEY`（env、サーバー側） |
| Cloudflare Turnstile | 不可視スパム判定 | サイトキー（クライアント）+ シークレット検証（サーバー） | `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` |
| Clerk | 運用者(admin)認証 | SDK | `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` |
| Vercel Web Analytics | 流入 / クリック計測（cookieless） | スクリプト | プロジェクト紐付け |
| Sentry | エラー監視 | SDK | `SENTRY_DSN` |

## 7. 決定事項ログ

| 日付 | 決定内容 | 根拠 | 影響セクション | decision_id |
|---|---|---|---|---|
| 2026-05-27 | 永続化 = Neon-backed（問い合わせスレッド管理のため DB 必要） | 問い合わせをサイト内スレッド形式に再定義 | §4.3, §5 | [D20260527-002](./AI_LOG/D20260527_001_concept_initial.md#decisions) |
| 2026-05-27 | 問い合わせ = サイト内スレッド形式（メール完結ではない） | seiji 明示 | §1.1, §1.3, §5 | [D20260527-003](./AI_LOG/D20260527_001_concept_initial.md#decisions) |
| 2026-05-27 | 問い合わせ者はメアド必須 + メールバリデーション | seiji 明示（スパム対策） | §1.1, §5 | [D20260527-004](./AI_LOG/D20260527_001_concept_initial.md#decisions) |
| 2026-05-27 | スパム対策 = 不可視スタック（検証リンクなし、即スレッド表示） | UX 重視（検証リンク往復を回避） | §3, §4.3, §6 | [D20260527-005](./AI_LOG/D20260527_001_concept_initial.md#decisions) |
| 2026-05-27 | デザイン方向 = 信頼感 × ミニマル × クラフト感 | 提供価値=信頼、ターゲット=一般 | §4.2, /flow:design | [D20260527-006](./AI_LOG/D20260527_001_concept_initial.md#decisions) |
| 2026-05-27 | フロント FW = Next.js（Vite preference を override） | SEO/OGP/SSR 必須 | §4.2, §4.3, §1.4 | [D20260527-007](./AI_LOG/D20260527_001_concept_initial.md#decisions) |
| 2026-05-27 | リソース選定 = §3.1 個人ツール/無料枠バンドル | preferences §3.1 | §4.3, §4.4 | [D20260527-008](./AI_LOG/D20260527_001_concept_initial.md#decisions) |
| 2026-05-27 | 外部 AI = 使わない | サービス自体に AI 要件なし | §6 | [D20260527-009](./AI_LOG/D20260527_001_concept_initial.md#decisions) |
| 2026-05-28 | メッセージング転換: 「AI 駆動開発で成功させましょう」と打ち出さず、「正解の分からない世界で共に考える相談相手」スタンスへ | wants.md 2026-05-28 追記（seiji 明示） | 冒頭表, §1, §1.1 UC#3 | [D20260528-001](./AI_LOG/D20260528_001_concept_update_messaging.md#decisions) |

## 8. 未決事項（論点リスト）

### [論点-001] service-hub `GET /api/public/status` の contract 確定
- **影響範囲**: `_shared/hub-client`, `service-status` 機能, §5 service_status_cache, §6 外部連携
- **詰めるべき問い**:
  1. レスポンスの正確なフィールド名・型（提案: 下記）
  2. 認証要否（完全公開 or 軽い API キー / Referer 制限）
  3. キャッシュ更新頻度（Cron 間隔）と HUB 側のレート制限
- **候補案**:
  - 案 A（推奨）: 提案 contract を HUB 側に実装依頼
    ```json
    GET /api/public/status → 200
    {
      "generated_at": "2026-05-27T03:00:00Z",
      "services": [
        { "slug": "service-hub", "name": "Service Hub", "url": "https://...",
          "status": "up", "since": "2026-04-01", "last_checked_at": "2026-05-27T02:55:00Z" }
      ]
    }
    ```
    利点: 安全サブセットに限定（内部指標を物理的に含めない）／ 表示に必要十分。欠点: HUB 側実装が前提（別タスク）。
  - 案 B: HUB が既存で別形を返す → shipyard 側で変換アダプタ。利点: HUB 改修不要な場合がある。欠点: 安全サブセット保証が shipyard 側責務になる（内部指標漏れリスク）。
- **推奨**: 案 A。理由: 安全サブセットを HUB 側で保証するのが PII/内部指標漏れ防止に最も堅い。HUB 未実装の間は shipyard 側でモック contract（案 A の形）を使って開発を進める。
- **status**: `accepted-with-mock`（2026-05-27、AUDIT_20260527_1700 / D20260527-057）。`_shared/hub-client` が案 A の提案 contract を **mock 採用**して実装完了（`lib/hub/mock.ts`、Zod で安全サブセット strip）。service-status も実装済。**service-hub 側で実 contract 確定後に env URL 切替 + 整合再確認**（実装は無改修想定）。逆方向の service-info 公開は O48 で実装済（§6）。
- **判断期限**: ~~`service-status` 機能設計着手前~~ → 実装は mock で先行完了。実 HUB 確定は service-hub 側タスク（外部依存）。
- **担当**: seiji（HUB 側は別タスク `service-hub /flow:revise`）

### [論点-002] [SEC-001] 個人情報のログ漏洩防止: Critical（法令必須）

- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-05-27 14:00 open → 2026-05-27 14:00 accepted-as-requirement（§3.7 NFR に要件化）
- **影響範囲**: §3.7, §6, §9, inquiry / admin / _shared/email
- **観点 ID**: O26_pii_logging（legal_required=true）
- **severity**: Critical
- **検出根拠**: Sentry / Analytics への PII（email・本文・token）混入対策が SPEC 未明示
- **推奨**: §3.7 [SEC-001] の要件を inquiry / admin SPEC で具体化
- **判断期限**: 実装着手前
- **L1 レポート**: `./SECURITY_REVIEW_20260527.md`（SEC-001）

### [論点-003] [SEC-002] 認可漏れ / thread IDOR + admin RBAC: High

- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-05-27 14:00 open → 2026-05-27 14:00 accepted-as-requirement（§3.7 NFR に要件化）
- **影響範囲**: §3.7, §1.3 admin/inquiry, §5.1 thread/message
- **観点 ID**: O23_authorization_check
- **severity**: High
- **検出根拠**: thread/message エンドポイントの token 所有者検証（IDOR 防止）が SPEC 未明示
- **推奨**: §3.7 [SEC-002] の要件を inquiry / admin SPEC で具体化
- **判断期限**: 実装着手前
- **L1 レポート**: `./SECURITY_REVIEW_20260527.md`（SEC-002）

### [論点-004] [SEC-003] 入力検証 / 問い合わせ本文 XSS: High

- **status**: `accepted-as-requirement`
- **status 履歴**: 2026-05-27 14:00 open → 2026-05-27 14:00 accepted-as-requirement（§3.7 NFR に要件化）
- **影響範囲**: §3.7, §5, inquiry / admin / _shared/ui
- **観点 ID**: O24_input_validation
- **severity**: High
- **検出根拠**: 問い合わせ本文の XSS 対策・API 入力スキーマ（Zod）が SPEC 未明示
- **推奨**: §3.7 [SEC-003] の要件を inquiry SPEC で具体化
- **判断期限**: 実装着手前
- **L1 レポート**: `./SECURITY_REVIEW_20260527.md`（SEC-003）

### [論点-005] Playwright E2E bootstrap (scaffold 不在)

- **status**: open
- **status 履歴**: 2026-05-28 12:45 open (D20260528_005 flow:e2e 初回起動で検出)
- **影響範囲**: 全 feature 004 E2E 計画 (landing / service-status / inquiry / admin / legal)
- **検出根拠**: `@playwright/test ^1.49.1` devDependencies 有り + `npm run e2e: playwright test` script 有りだが、`playwright.config.*` / `e2e/` / browser binary すべて未 scaffold。`/flow:e2e landing` で 103 red を 1 件記録
- **詰めるべき問い**:
  1. _shared/e2e として横断基盤化するか、各機能ごとに spec 散在させるか
  2. dev server 起動に Neon dev branch + Clerk test mode を使うか、mock-only mode を整備するか
  3. CI 統合 (GitHub Actions Playwright headless) はいつ着手するか
- **候補案**:
  - 案 A (推奨): `/flow:feature _shared/e2e` で横断基盤 feature として設計、Neon dev branch + Clerk test mode で公式 dev server fixture、CI 連携も同 feature 内で完結
  - 案 B: 各機能 ad-hoc spec、共通 helper のみ `e2e/_helpers/` に切り出し
- **推奨**: 案 A (基盤一元管理で長期保守性高、`/flow:auto` の E2E gate も target 単位で進められる)
- **判断期限**: Release gate (P4.7) 通過後、本格運用前
- **担当**: seiji
- **関連**: `./landing/103_landing_E2E_REPORT.md` / `./landing/revise_messaging-shift_20260528_tone-shift-together-thinking/103_REVISE_E2E_REPORT.md` / `./AI_LOG/D20260528_005_e2e_landing.md`

## 9. 法務・コンプライアンス書類

> 公開 PJ かつ問い合わせ者のメール + 本文を収集・保存するため、プライバシーポリシー必須。**本サイトでの課金はないため特定商取引法表記は不要**。

### 9.1 必須書類チェックリスト
| 書類 | 必要性 | 状態 | 配置パス / URL | 備考 |
|---|---|---|---|---|
| プライバシーポリシー | ✅ | 未作成 | `/legal/privacy` | メール + 本文の取得目的 / 保管 / 削除請求窓口 / cookieless アナリティクス利用を明示 |
| 利用規約 | ✅（推奨） | 未作成 | `/legal/terms` | 問い合わせ利用上の責任 / 免責 / 禁止行為 / 準拠法 |
| 特定商取引法に基づく表記 | ❌ | 不要 | — | 本サイトでの有償取引なし（コンサルは lead-gen のみ、成約・請求は別チャネル） |
| Cookie ポリシー | ❌ | 不要 | — | cookieless アナリティクス採用、Turnstile は必要 cookie のみ → consent banner 不要（プラポリで言及） |

### 9.2 対応地域法規
| 法規 | 対象ユーザー有無 | 対応方針 |
|---|---|---|
| 個人情報保護法（日本） | ✅ | 取得目的の明示 / 保管期間 / 開示・削除請求窓口をプラポリに記載 |
| GDPR（EU） | △（少数想定） | メール最小収集 + cookieless のためリスク低。プラポリに削除請求窓口を記載 |
| CCPA 等 | △ | 同上 |

### 9.3 書類作成方針
- **作成手段**: テンプレ採用 + 自前ドラフト（個人開発、`/flow:feature legal` で初稿、必要に応じ確認）
- **配置場所**: `docs/legal/` に原稿、公開は `/legal/*` ルート
- **公開導線**: フッタリンク（全ページ）+ 問い合わせフォームに「送信＝プラポリに同意」明示
- **改訂時の運用**: 取得項目 / 外部送信先の変更時にプラポリ更新（再同意は軽微変更なら不要、重大変更時はフォームで明示）

## 10. Git リポジトリ・運用

> 共通プロトコル: `~/.claude/flow-data/git-commit-policy.md`。本セクションは PJ オーバーライド層。**現状 `<root>/.git` は未初期化**（§10.8）。

### 10.1 リポジトリ情報
| 項目 | 値 |
|---|---|
| リポジトリ URL | （未設定、GitHub 推奨。HUB とは別 repo） |
| 可視性 | private（初期）→ Build in Public 素材化時に public 検討。**秘密情報は env のみ・コミットしない** |
| ホスティング | GitHub |
| デフォルトブランチ | main |

### 10.2 ブランチ戦略
- **採用戦略**: Trunk-based + Protected main（PR 必須 + CI green 必須）
- **protected_branches**: `[main]`
- **auto_branch_prefix**: `flow/`（形式: `flow/<command>-<YYYYMMDD>`）

### 10.3 コミット規約
- **採用形式**: Conventional Commits
- **flow コマンド自動コミット時**: `docs(flow:concept): <target> — <一行要約>`
- **squash 戦略**: PR マージ時 squash

### 10.4 リリースタグ規約
- semver（`v0.1.0` から）、初期は任意

### 10.5 CI / CD ワークフロー
- `.github/workflows/`: lint / typecheck / test（PR ごと）、Vercel preview（PR ごと自動）、deploy（main マージ時）
- 依存監視: Dependabot（O28）
- 任意: `npm audit` / `/flow:secure --phase=deps` を CI 組み込み

### 10.6 flow コマンド自動コミット方針
```yaml
auto_commit: true
branch_strategy: trunk-based
commit_message_lang: ja
protected_branches: [main]
auto_branch_prefix: "flow/"
staging_extra_paths: []
staging_exclude_paths: []
```

### 10.7 セキュリティ
- `.env*.local` / 秘密情報を `.gitignore` で除外（O25）
- pre-commit hook で gitleaks / detect-secrets 推奨
- **HUB の財務データ・PaaS トークンは本 repo に絶対に持ち込まない**（アーキ前提）

### 10.8 現状
- `<root>/.git` 未初期化。本 concept 完了時の自動コミットは `git init` 確認後に実行（§Step 7.7）。

## 11. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成（公開ショーケース + lead-gen LP、問い合わせはサイト内スレッド形式、不可視スパム対策、Next.js + Neon + Clerk(admin) + Resend + Turnstile） | /flow:concept |
| 2026-05-28 | メッセージング転換（lead-gen 主軸 → 「共に考える相談相手」スタンス）。冒頭表 + §1 + §1.1 UC#3 を再ライト。後続 /flow:revise landing で LP SPEC §1 UC-L1/L2 + §5 トーン を同期予定 | /flow:concept (update from wants.md) |
