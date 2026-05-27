# _shared/hub-client 仕様書（横断基盤・HUB status クライアント + キャッシュ）

> **役割**: service-hub の公開 status API を read-only 消費し、Neon にキャッシュ。HUB ダウン時フォールバック。
> **タグ**: cross-cutting
> **最終更新**: 2026-05-27
> **入力**: `../../concept.md` §6 / §5.2 / §8 [論点-001], `../db/001_db_SPEC.md`（service_status_cache）, `./README.md`

---

## 1. 提供インターフェース
| 機能 | 提供 | 利用機能 |
|---|---|---|
| contract 型 | `PublicStatusResponse` / `ServiceStatus`（[論点-001] 提案 contract） | service-status |
| `fetchHubStatus()` | HUB `GET /api/public/status` を取得・検証（Zod） | cron |
| `refreshStatusCache()` | fetch → service_status_cache に upsert（Cron が呼ぶ） | cron |
| `getCachedStatus()` | キャッシュから一覧取得（HUB を叩かない、画面/API 用） | service-status |

## 2. 入出力（contract、[論点-001] 提案）
```ts
type ServiceStatus = {
  slug: string; name: string; url: string;
  status: 'up' | 'down' | 'unknown';
  since?: string;            // 稼働開始日 (ISO date)
  last_checked_at?: string;  // HUB 側点検時刻 (ISO)
};
type PublicStatusResponse = { generated_at: string; services: ServiceStatus[] };
```
- `fetchHubStatus`: env `HUB_STATUS_URL`（+ 任意 `HUB_STATUS_API_KEY`）。Zod で**安全サブセットのみ**を許可（余剰フィールドは破棄＝内部指標の誤受信防止）。
- `refreshStatusCache`: 取得成功 → `statusCacheRepo.upsertMany(rows + fetched_at=now)`。失敗 → 既存キャッシュ保持（更新しない）。
- `getCachedStatus`: `statusCacheRepo.listAll()` をそのまま返す（`fetched_at` で「〜時点」表示可）。

## 3. データモデル
`service_status_cache`（_shared/db 定義）を読み書き。新規テーブルなし。

## 4. バリデーション + エラーケース
| ID | 条件 | 振る舞い |
|---|---|---|
| HUB-E1 | HUB ダウン/タイムアウト | キャッシュ保持（前回値 + fetched_at）、エラーログ（PII なし）、画面は graceful（concept §3 可用性） |
| HUB-E2 | レスポンスが contract 不一致 | Zod で reject、キャッシュ更新せず警告 |
| HUB-E3 | 余剰フィールド（内部指標が誤って来た） | Zod strip で破棄（安全サブセット厳守、§1.2 除外） |
| HUB-E4 | HUB 未実装（[論点-001] 未解決） | **モック contract**（同形 JSON）で開発継続 |

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| HUB 負荷 | キャッシュ経由で叩きすぎない（Cron N 分間隔、画面は cache のみ） | concept §1（HUB を叩きすぎない） |
| 可用性 | HUB ダウン時も最終既知ステータス表示 | concept §3 |
| 安全性 | 安全サブセットのみ受信（内部指標・トークン非受信） | concept §1.2 除外 |
- 連携: cron（refresh）/ service-status（getCachedStatus）/ db（statusCacheRepo）。

## 6. スコープ外
- HUB 側 API 実装（別タスク service-hub /flow:revise、[論点-001]）
- リアルタイム push（ポーリング + キャッシュのみ）

## 7. 未決事項
> 関連: concept §8 [論点-001] HUB contract。本 SPEC の §2 が提案 contract。HUB 未実装の間は §4 HUB-E4 のモックで開発。HUB 側確定後に契約整合を再確認。

現時点で本機能固有の論点なし（contract は [論点-001] に集約、2026-05-27）。

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成（contract 提案 + キャッシュ + フォールバック） | /flow:feature |
