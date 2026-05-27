# shipyard

運用中の自作マイクロサービス群をリアルタイム稼働状況で公開し、「ちゃんと動いている」信頼を見せて AI コンサルの問い合わせにつなげる公開ショーケース + lead-gen LP。

## 概要

個人開発で週1ペースに作っているマイクロサービス群を、一般向けに一覧公開するサイト。各サービスのリアルタイム up/down を見せることで「口先だけでなく実際に動いている」信頼を作り、その土台で「AI 駆動開発で速く作る／コンサル承ります」を打ち出し、サイト内スレッド形式の問い合わせで案件 lead を獲得する。稼働情報は別サービス service-hub の公開 status API（安全サブセットのみ）を read-only 消費し、内部指標やトークンとは一切同居しない。

## 主要機能

- **稼働サービス一覧**: HUB の公開 status API をキャッシュしてリアルタイム up/down + 各サービスへのリンクを表示
- **LP**: 提供価値 / メイカー紹介 / AI コンサルの打ち出し（一般向けコピー、技術用語回避）
- **問い合わせスレッド**: メアド必須 + 不可視スパム対策（Turnstile + honeypot + rate limit）、送信即スレッド表示、サイト内で会話継続
- **運用者コンソール**: Clerk gate で問い合わせ一覧 / 返信（単一運用者）

## 技術スタック

- フロント: Next.js (App Router) + React + TypeScript（SEO/OGP のため）
- UI: shadcn/ui + Tailwind
- DB: Neon (Postgres) + Drizzle ORM
- 認証: Clerk（運用者 admin のみ）
- メール: Resend / スパム対策: Cloudflare Turnstile
- ホスティング: Vercel Hobby（サブドメ `shipyard.<domain>`）
- 監視/計測: Sentry + Vercel Web Analytics（cookieless）

## Getting Started (Local Development)

### 前提条件

- Node.js（Next.js 対応版、nvm / asdf 推奨）
- Neon dev ブランチ（`DATABASE_URL`）
- `.env.local` の準備（`.env.example` をコピーして実値。詳細は [PREREQUISITES.md](./docs/PREREQUISITES.md)）

### 起動

```bash
./scripts/dev.sh        # 統合 launcher（env チェック → db:migrate → next dev）
# または
npm run dev
```

### 停止

```bash
./scripts/stop.sh       # または Ctrl+C
```

### よく使うコマンド

| 用途 | コマンド |
|---|---|
| dev サーバー起動 | `./scripts/dev.sh` または `npm run dev` |
| smoke test | `npm run test:smoke` |
| DB マイグレーション | `npm run db:migrate` |
| 型チェック | `npm run typecheck` |
| ユニットテスト | `npm run test` |

詳細: [docs/concept.md §4.5](./docs/concept.md)

## 開発状態

企画中（concept 初版）。Phase 1.5 デザインシステム → Phase 2 機能設計 へ進む。

## 設計ドキュメント

- [全体概念・要件・設計](./docs/concept.md) — プロジェクト中央書類（`/flow:concept` で生成・更新）
- [開発シナリオ](./docs/SCENARIO.md) — next-step 判断用ナラティブ
- [機能フォルダ INDEX](./docs/INDEX.md) — 全機能フォルダ + 横断フォルダのリスト
- [AI 用エントリポイント](./docs/DOC_MAP.md) — 目的別アクセスガイド
- [実装前準備チェックリスト](./docs/PREREQUISITES.md) — API キー / アカウント / 法務書類

## ライセンス

All Rights Reserved（公開時に MIT 等を検討）
