# _shared/db 仕様書（横断基盤・DB スキーマ）

> **役割**: shipyard の永続化層（Neon Postgres + Drizzle ORM）のスキーマ・制約・リポジトリ提供インターフェース
> **タグ**: cross-cutting, stateful, auth-required
> **最終更新**: 2026-05-27
> **入力アーティファクト**: `../../concept.md`（§5 データ設計 / §3.7 NFR / §4.3）, `./README.md`

---

## 1. 提供インターフェース（テーブル + Drizzle schema + repository）

横断基盤のため UC ではなく、各機能（inquiry / admin / service-status / spam）へ提供するデータインターフェースを定義する。

### 1.1 テーブル一覧

| テーブル | 責務 | 主な利用機能 |
|---|---|---|
| `inquirers` | 問い合わせ者（メアド単位、アカウントではない） | inquiry, admin |
| `threads` | 問い合わせスレッド（token でアクセス） | inquiry, admin |
| `messages` | スレッド内メッセージ（visitor/operator） | inquiry, admin |
| `rate_limits` | レート制限カウンタ | spam |
| `service_status_cache` | HUB status のキャッシュ | service-status, hub-client |

## 2. 入出力（スキーマ定義）

### 2.1 `inquirers`
| カラム | 型 | 制約 | 備考 |
|---|---|---|---|
| `id` | uuid | PK, default gen_random_uuid() | |
| `email` | text | NOT NULL | PII。ログ非出力（§3.7 SEC-001） |
| `created_at` | timestamptz | NOT NULL default now() | |
- index: `idx_inquirers_email` on `email`（同一メアドの再問い合わせ紐付け用）

### 2.2 `threads`
| カラム | 型 | 制約 | 備考 |
|---|---|---|---|
| `id` | uuid | PK, default gen_random_uuid() | 連番でない（列挙耐性） |
| `inquirer_id` | uuid | FK → inquirers.id, NOT NULL | |
| `token` | text | **UNIQUE, NOT NULL** | 128-bit URL-safe random（§3.7 SEC-002、IDOR 防止のアクセスキー） |
| `subject` | text | NULL 可 | 任意の件名 |
| `status` | text | NOT NULL default 'open' | enum: `open` / `closed`（stateful） |
| `created_at` | timestamptz | NOT NULL default now() | |
| `last_activity_at` | timestamptz | NOT NULL default now() | 新着順ソート用 |
- index: `idx_threads_token` UNIQUE on `token`（token ルックアップ）、`idx_threads_last_activity` on `last_activity_at desc`（admin 一覧）

### 2.3 `messages`
| カラム | 型 | 制約 | 備考 |
|---|---|---|---|
| `id` | uuid | PK | |
| `thread_id` | uuid | FK → threads.id ON DELETE CASCADE, NOT NULL | |
| `sender` | text | NOT NULL | enum: `visitor` / `operator` |
| `body` | text | NOT NULL | 表示時にプレーンテキスト扱い（§3.7 SEC-003 XSS） |
| `created_at` | timestamptz | NOT NULL default now() | |
- index: `idx_messages_thread` on `(thread_id, created_at)`（スレッド内時系列）

### 2.4 `rate_limits`
| カラム | 型 | 制約 | 備考 |
|---|---|---|---|
| `key` | text | NOT NULL | IP ハッシュ or email ハッシュ（PII 平文を入れない） |
| `window_start` | timestamptz | NOT NULL | 固定窓 |
| `count` | int | NOT NULL default 0 | |
- PK: `(key, window_start)`。古い窓は定期 cleanup（cron）or TTL 的に無視。

### 2.5 `service_status_cache`
| カラム | 型 | 制約 | 備考 |
|---|---|---|---|
| `slug` | text | PK | HUB のサービス slug |
| `name` | text | NOT NULL | 表示名 |
| `url` | text | NOT NULL | 各サービス URL |
| `status` | text | NOT NULL | enum: `up` / `down` / `unknown` |
| `since` | date | NULL 可 | 稼働開始日 |
| `last_checked_at` | timestamptz | NULL 可 | HUB 側の最終点検時刻 |
| `fetched_at` | timestamptz | NOT NULL default now() | shipyard が取得した時刻（「〜時点」表示） |

## 3. データモデル（ER 概要）
```
inquirers 1──* threads 1──* messages
service_status_cache（独立）
rate_limits（独立）
```

## 4. バリデーション + エラーケース

### 4.1 制約レベル
| 対象 | ルール |
|---|---|
| threads.token | UNIQUE、128-bit（生成は _shared/spam or repository 層）、衝突時はリトライ |
| threads.status | `open`/`closed` のみ（CHECK or app enum） |
| messages.sender | `visitor`/`operator` のみ |
| service_status_cache.status | `up`/`down`/`unknown` のみ |

### 4.2 エラーケース
| ID | 条件 | 振る舞い |
|---|---|---|
| DB-E1 | token 衝突（極稀） | repository でリトライ（最大 3 回） |
| DB-E2 | FK 違反（存在しない thread への message） | 例外 → 上位でハンドリング |
| DB-E3 | Neon 接続断 | プール再接続、失敗時 503（status は cache fallback） |

## 5. 機能固有 NFR + 既存連携

### 5.1 NFR
| 項目 | 目標 | 根拠 |
|---|---|---|
| 接続方式 | pooled connection（Neon serverless driver） | Vercel serverless（短命接続） |
| マイグレーション | Drizzle migrations（前方のみ、破壊的変更は明示） | §10.5 |
| PII | email は保存するがログ非出力（§3.7 SEC-001） | 法令必須 |

### 5.2 提供 repository インターフェース（実装は各機能が利用）
- `inquirerRepo`: `upsertByEmail(email)`, `findById(id)`
- `threadRepo`: `create({inquirerId, subject})→{id,token}`, `findByToken(token)`, `listRecent(limit,offset)`, `setStatus(id,status)`, `touchActivity(id)`
  <!-- spec-review R1: token 生成は _shared/spam.generateThreadToken に一本化。threadRepo.create は spam に生成を依頼し、UNIQUE 制約違反時はリトライ（再生成を spam に再依頼）。128-bit 保証=spam、一意性 DB 制約=db の二重防御 -->　
- `messageRepo`: `add({threadId, sender, body})`, `listByThread(threadId)`
- `rateLimitRepo`: `hitAndCount(key, windowStart)→count`
- `statusCacheRepo`: `upsertMany(rows)`, `listAll()`
> **IDOR 防止（SEC-002）**: visitor 側は必ず `findByToken` 経由。連番 id を URL/レスポンスに露出しない。admin 側のみ id 経由（Clerk gate 後）。

## 6. タグ別追加

### 6.1 stateful（thread.status）
- 状態: `open`（やり取り中）→ `closed`（運用者が完了）。再オープンは MVP 外。

### 6.2 auth-required（IDOR）
- token = 暗号論的乱数 128-bit 以上、URL-safe（base64url）。生成は repository（crypto.randomBytes）。
- visitor アクセスは token のみ。admin は Clerk 認証後に id 経由。

## 7. スコープ外
- 監査ログテーブル（単一運用者のため MVP 不要、concept §5 注記）
- thread 再オープン / 添付ファイル（MVP 外）
- RLS（Neon + app 層認可で担保、Supabase RLS は使わない）

## 8. 未決事項
現時点で論点なし (2026-05-27)。
> 関連: concept §8 [論点-001] HUB contract は service_status_cache のカラムに影響しうる（slug/name/url/status/since/last_checked_at は確定済の安全サブセットに整合）。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成（5 表、Drizzle/Neon、token IDOR 対応） | /flow:feature |
