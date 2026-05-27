# 実装レポート: _shared/db

## 実装日時
2026-05-27 15:22 (JST)

## モード
feature（横断基盤）

## 関連ドキュメント
- [001_db_SPEC.md](./001_db_SPEC.md) - 仕様書（5 表 + repository IF）
- [002_db_PLAN.md](./002_db_PLAN.md) - 実装計画書（3 Phase）
- [003_db_UNIT_TEST.md](./003_db_UNIT_TEST.md) - 単体テスト項目
- [AI_LOG セッション](../../AI_LOG/D20260527_019_tdd_continuous.md) - 設計判断ログ

## 注意事項
本レポートのファイルパスと行番号は実装日時時点のものです。以後の変更により行番号がずれる場合があります。

## 変更一覧

### Phase 1: スキーマ + client（先行セッションで完了）
- `lib/db/schema.ts` — 5 表（inquirers/threads/messages/rate_limits/service_status_cache）+ enum 型 + index（token UNIQUE = SEC-002 IDOR、last_activity desc、messages 複合）
- `lib/db/client.ts` — Neon serverless `Pool` + Drizzle（pooled、lazy singleton `getDb()`）
- `drizzle.config.ts` — migration 出力先 `lib/db/migrations`
- テスト: `lib/db/schema.test.ts`（6 件、型/enum default/token UNIQUE index）

### Phase 2: repository（CRUD）
- `lib/db/repositories/inquirer.ts` — `createInquirerRepo(db)`: `upsertByEmail`（select→無ければ insert、重複作成なし）/ `findById`
- `lib/db/repositories/thread.ts` — `createThreadRepo(db, {generateToken?})`: `create`（token 注入可、UNIQUE 衝突で最大 3 回リトライ）/ `findByToken`（**SEC-002 IDOR: visitor 唯一の経路**）/ `listRecent`（last_activity desc + offset）/ `setStatus`（enum 検証）/ `touchActivity`
- `lib/db/repositories/message.ts` — `createMessageRepo(db)`: `add`（sender enum 検証、createdAt 注入可）/ `listByThread`（created_at asc）
- `lib/db/repositories/rateLimit.ts` — `createRateLimitRepo(db)`: `hitAndCount`（`onConflictDoUpdate` で atomic に +1、increment 後の count を返す）
- `lib/db/repositories/statusCache.ts` — `createStatusCacheRepo(db)`: `upsertMany`（slug PK、`excluded.*` で上書き、status enum 検証）/ `listAll`
- `lib/db/repositories/index.ts` — barrel + `getRepos()`（getDb() に束ねたアプリ用エルゴノミクス）
- `lib/db/token.ts` — `generateThreadToken()`（`crypto.randomBytes(16)→base64url`、128-bit）。spec-review R1 に従い将来 `_shared/spam.generateThreadToken` へ寄せるため、threadRepo は generator を injectable に受ける
- テスト基盤: `lib/db/_test/pglite.ts` — in-memory Postgres（pglite）+ 生成済み migration 適用（drift なし）

### Phase 3: 統合（migration + seed）
- `lib/db/migrations/0000_init.sql`（+ meta）— `drizzle-kit generate` で生成（5 表 + FK cascade + token UNIQUE index）
- `package.json` scripts — `db:generate` / `db:migrate` / `db:reset`（既存）
- `lib/db/seed.ts` — `seedStatusCache(db)` + `DEV_STATUS_SEED`（service_status_cache のモック行、HUB 安全サブセット整合）。実 DB への適用は DATABASE_URL 必須 = release 工程（Class B）

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | repository を factory 関数（`createXRepo(db)`）化して DB を DI（pglite テスト用、可逆性原則 O35）。token 生成を threadRepo に injectable 注入（U-E3 衝突テスト + spam 移行の両対応）。enum は app 層検証（SPEC §4.1「CHECK or app enum」のうち app enum を採用、Phase 1 schema 無改変） |
| 計画から省略した変更 | migration の**実 Neon dev への適用確認**（DoD §7 の 3 番目）は DATABASE_URL（実キー）必須のため release 工程へ繰り延べ（Class B）。生成済み migration は pglite で適用検証済み |
| 想定外の問題と対処 | (1) `drizzle-kit/api` の `pushSchema` が Vite/Vitest で「Dynamic require of fs」エラー → 生成 migration を `drizzle-orm/pglite/migrator` で適用する方式に変更（ESM-clean + schema/DDL drift 解消）。(2) pglite が jsdom 環境で `r.arrayBuffer` エラー → 当該テストを `// @vitest-environment node` に。(3) migrate がテスト毎で遅い（~3.5s）→ migrate は beforeAll 1 回、各テスト前は `TRUNCATE ... RESTART IDENTITY CASCADE` で隔離（63s→6.5s） |

## PR Description

### タイトル
_shared/db: repository 層（CRUD/IDOR/制約）+ migration + dev seed

### 概要
shipyard の永続化層 repository を実装。Neon/Drizzle スキーマ（Phase 1）の上に 5 テーブルの CRUD repository を載せ、token ベースの IDOR 防止（SEC-002）・enum 制約・FK・レート制限カウンタを実 SQL（pglite）で検証する。

### 変更内容
- 5 repository（inquirer/thread/message/rateLimit/statusCache）を DI 可能な factory として実装
- thread token を injectable 化（128-bit base64url、UNIQUE 衝突リトライ）、findByToken を visitor 唯一の IDOR 経路に
- Drizzle migration 生成 + dev seed 関数追加
- pglite による in-memory Postgres テスト基盤（生成 migration を適用、drift なし）

### テスト
- 単体テスト: 21 件（repositories）+ 6 件（schema、Phase 1）= 27 件、全 GREEN
- 全体スイート: 29/29 パス（100%）、typecheck クリーン
- IDOR 経路（findByToken）・FK 違反・token 衝突リトライ・enum 拒否・境界値（空/Unicode/絵文字/offset 範囲外）をカバー
