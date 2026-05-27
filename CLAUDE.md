# shipyard — プロジェクト指示

公開ショーケース + AI コンサル lead-gen LP。設計の中央書類は [docs/concept.md](docs/concept.md)、開発シナリオは [docs/SCENARIO.md](docs/SCENARIO.md)。

## テスト
- フレームワーク: **Vitest**（unit / component、jsdom）+ **Playwright**（E2E、`/flow:e2e`）
- 実行: `npm run test`（unit）/ `npm run test:smoke`（smoke）/ `npm run e2e`（E2E）
- テストファイル: `*.test.ts(x)`（実装と同階層 or `test/`）、E2E は `e2e/`
- カバレッジ目標: 行 80% / 分岐 70%（concept §継承）

## スタック
- Next.js (App Router) + React + TypeScript / Tailwind (Ink & Teal トークン、`docs/design/design-system.md`)
- Neon (Postgres) + Drizzle ORM（`lib/db/`）/ Clerk（admin のみ）/ Resend / Cloudflare Turnstile
- ホスティング: Vercel（`shipyard.<domain>` サブドメ）

## セキュリティ要件（concept §3.7、必読）
- **SEC-001 PII**: メール/問い合わせ本文をログ・メール本文・Analytics に出さない（Sentry beforeSend マスク）
- **SEC-002 IDOR**: thread は token（128-bit, spam.generateThreadToken）でアクセス、連番 id を URL に出さない。admin は Clerk + allowlist
- **SEC-003 XSS**: 問い合わせ本文はプレーンテキスト表示、`dangerouslySetInnerHTML` 禁止、入力は Zod 検証
- **秘密情報**: `.env*.local` のみ、`NEXT_PUBLIC_*` に秘密を入れない

## コーディング規約
- ユーザー向け文字列は技術用語を避ける（O38、一般向け）。文言仕上げは `/flow:wording`
- 絵文字を UI に使わない（lucide + 自作 SVG、design SoT §8）
- 外部依存は injectable + mock でテスト（実キー不要 CI green、O35）
