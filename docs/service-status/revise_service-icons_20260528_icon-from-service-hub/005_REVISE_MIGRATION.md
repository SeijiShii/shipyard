# service-status マイグレーション計画 (service-icons)

> **入力**: [`./001_REVISE_SPEC.md`](./001_REVISE_SPEC.md), [`./002_REVISE_PLAN.md`](./002_REVISE_PLAN.md)
> **最終更新**: 2026-05-28

---

## 1. 移行対象

| 対象 | 種別 | 変更内容 |
|---|---|---|
| `service_status_cache` テーブル | DB (Neon Postgres) | 新規カラム `icon_url text NULL` 追加 |

## 2. 移行手順

### Step 1: drizzle schema 更新
- 内容: `lib/db/schema.ts` の `serviceStatusCache` テーブル定義に `iconUrl: text("icon_url")` (nullable、default なし) を追加
- 検証: `! npm run typecheck` で TypeScript エラーなし
- 想定所要時間: < 1 分

### Step 2: drizzle migration SQL 自動生成
- 内容: `! bash scripts/with-env.sh drizzle-kit generate` (`npm run db:generate` でも可)
- 検証: `lib/db/migrations/<XXXX>_<name>.sql` が新規生成、内容に `ALTER TABLE "service_status_cache" ADD COLUMN "icon_url" text;` が含まれる
- 想定所要時間: < 1 分
- **生成された SQL を git commit に含める** (本番化時に同 SQL が main branch にも apply される)

### Step 3: Neon dev branch に apply (Phase 1 実装中)
- 内容: `! npm run db:migrate` (with-env.sh 経由で `.env.development.local` の DATABASE_URL load + drizzle-kit migrate)
- 検証: `[✓] Applying migration` 表示。dev branch DB で `\d service_status_cache` を確認 (psql or Neon dashboard) → `icon_url` column 存在
- 想定所要時間: 数秒〜1 分 (Neon dev branch は zero-copy)

### Step 4: 既存 cache データの後方互換確認
- 内容: Neon dev branch の `service_status_cache` テーブルに既存 row があれば、`icon_url = NULL` で残存していることを確認
- 検証: `SELECT slug, name, icon_url FROM service_status_cache;` で既存 row の icon_url が NULL
- 想定所要時間: < 1 分

### Step 5: 本番 main branch に apply (Phase 3 release 時、Phase 2 デプロイ前)
- 内容: 本番 DATABASE_URL を持つ環境で `drizzle-kit migrate` 実行
- 手順:
  1. `.env.production.local` に本番 DATABASE_URL (main branch Pooled URL) 設定 (release Phase 1.2 の §0.5.2 [Neon] 本番操作)
  2. `! bash scripts/with-env.sh drizzle-kit migrate` (本番 env 経由、※ローカルから本番 DB を叩く前提)
  3. Vercel deploy 前に確認 (deploy 後だとアプリ実行時に schema 不整合になる)
- 検証: 本番 Neon dashboard で `icon_url` column 存在確認
- 想定所要時間: 1-2 分
- **注意**: 本番 migration 実行 = **Class B-3** (本番 DB schema 変更)、release コマンド内で本人明示承認後実行

## 3. ロールバック手順

| 元 Step | 逆操作 | 検証 |
|---|---|---|
| Step 1-2 (schema + SQL) | git revert で schema.ts + migrations/ 巻き戻し | `! npm run typecheck` green |
| Step 3 (dev branch apply) | drizzle-kit migrations rollback or 手動 `ALTER TABLE service_status_cache DROP COLUMN icon_url;` 実行 (with-env.sh 経由で psql or drizzle) | `\d service_status_cache` で icon_url column 消滅確認 |
| Step 4 (データ確認) | 該当なし (read のみ) | — |
| Step 5 (本番 apply) | 上記同様、本番 main branch に対し `ALTER TABLE service_status_cache DROP COLUMN icon_url;` 実行 = Class B-3 (本番 DB schema 変更、本人明示承認後) | 本番 Neon dashboard で column 消滅確認 |

ロールバック SQL (drizzle が逆 migration を自動生成しない場合用、手動 fallback):
```sql
-- rollback for: add_icon_url_to_service_status_cache
ALTER TABLE service_status_cache DROP COLUMN icon_url;
```

## 4. ダウンタイム

- **要否**: **不要** (オンライン migration)
- 理由: `ADD COLUMN` (nullable + default なし) は PostgreSQL で fast metadata-only operation (テーブル全体を rewrite しない)。既存 INSERT/SELECT クエリは影響を受けず継続実行可能。
- 推定影響時間: 100ms 未満 (テーブル lock 取得時間のみ)

## 5. 失敗時の対応

| 失敗箇所 | 対応 | 連絡先 |
|---|---|---|
| Step 2 (drizzle-kit generate) | schema.ts の構文エラー / drizzle config 不整合 → schema 修正して再試行 | seiji |
| Step 3 (dev apply) | DATABASE_URL 不正 / Neon 接続失敗 → `.env.development.local` 確認、`with-env.sh` で env load 確認 | seiji |
| Step 4 (既存 row 確認) | 想定外の row 状態 → 手動 `UPDATE` で NULL 設定 (個別対応) | seiji |
| Step 5 (本番 apply) | 本番 DATABASE_URL 不正 / 接続失敗 → release コマンドの env 確認、Vercel env or .env.production.local 確認。本番 lock 取得失敗時は再試行 (一時的負荷の場合) | seiji |

## 6. 事前準備

- **バックアップ**: Neon は branching = zero-copy point-in-time recovery を提供。Phase 5 本番 apply 前に **main branch の snapshot branch を作成** (Neon dashboard or CLI、`! neon branches create --parent main`) しておく (失敗時に snapshot から rollback 可能、5 分以内)
- **ステージング検証**: 本番 apply 前に Neon dev branch (Phase 1 で使用済) で動作確認完了が前提
- **関係者通知**: 本 PJ は単一運用者 (seiji)、外部通知不要

## 7. 更新履歴

| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 — `icon_url` カラム追加 (nullable、オンライン migration) | /flow:revise |
