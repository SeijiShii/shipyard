# _shared/db 実装計画書

> **入力**: `./001_db_SPEC.md`, `../../concept.md` §1.4 / §4.3
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧（lib/db/）
| ファイル | 責務 | 依存 | LOC 見積 |
|---|---|---|---|
| `lib/db/client.ts` | Neon serverless driver + Drizzle インスタンス（pooled） | drizzle-orm, @neondatabase/serverless | 30 |
| `lib/db/schema.ts` | 5 テーブルの Drizzle スキーマ定義 + enum + index | drizzle-orm | 120 |
| `lib/db/repositories/inquirer.ts` | inquirerRepo（upsertByEmail / findById） | schema, client | 40 |
| `lib/db/repositories/thread.ts` | threadRepo（create+token生成 / findByToken / listRecent / setStatus / touchActivity） | schema, client, spam(token) | 90 |
| `lib/db/repositories/message.ts` | messageRepo（add / listByThread） | schema, client | 40 |
| `lib/db/repositories/rateLimit.ts` | rateLimitRepo（hitAndCount） | schema, client | 40 |
| `lib/db/repositories/statusCache.ts` | statusCacheRepo（upsertMany / listAll） | schema, client | 50 |
| `drizzle.config.ts` | Drizzle Kit 設定（migration 出力先） | — | 15 |
| `lib/db/migrations/*` | Drizzle 生成マイグレーション | — | auto |

## 2. 実装 Phase 分割（/flow:tdd 連携）

### Phase 1 (RED→GREEN→IMPROVE): スキーマ + client
- `schema.ts`（5 表 + enum + index）, `client.ts`, `drizzle.config.ts`
- テスト: スキーマ型が compile、enum 制約、token UNIQUE index 定義の存在
- ゴール: マイグレーション生成 + ローカル Neon dev に適用できる

### Phase 2: repository（CRUD）
- 各 repository を実装。token 生成は crypto.randomBytes(16)→base64url（衝突リトライ）
- テスト: 各 repo の正常系 + 制約違反 + IDOR（findByToken のみが visitor 経路）

### Phase 3: 統合（migration apply + seed）
- `npm run db:migrate` / `db:reset` スクリプト、dev シード（モック status 行）

## 3. 依存関係順序
```
schema.ts → client.ts → repositories/* → (各機能が利用)
```

## 4. 既存ファイルへの影響
なし（greenfield、本横断が最初の永続化層）。

## 5. 横断フォルダへの追加・変更
- 本横断が起点。token 生成ユーティリティは `_shared/spam` と共有検討（crypto ラッパ）。

## 6. リスク・注意点
- Neon serverless は短命接続前提 → pooled driver（`@neondatabase/serverless` の `Pool`）を使う。
- 破壊的マイグレーションの実 DB apply は Class B（/flow:auto は migrate apply 直前で pause）。本 Phase は SQL 生成まで。
- token 生成は repository 層（DB ではなく app）で行う。

## 7. 完了の定義（DoD）
- [ ] schema.ts に 5 表 + enum + index 定義
- [ ] 全 repository 実装 + unit green（カバレッジ目標達成）
- [ ] migration 生成 + ローカル dev 適用確認
- [ ] visitor 経路が token のみ（IDOR、SEC-002）を test で担保

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
