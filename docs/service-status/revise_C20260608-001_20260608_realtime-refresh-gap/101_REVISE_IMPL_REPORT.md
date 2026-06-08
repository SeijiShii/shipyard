# 実装レポート: service-status revise C20260608-001（read-through refresh + 最終同期日時表示）

## 実装日時
2026-06-08 09:00 (JST)

## モード
revise

## 関連ドキュメント
- [001_REVISE_SPEC.md] — 変更仕様
- [002_REVISE_PLAN.md] — 変更計画（3 Phase）
- [003_REVISE_UNIT_TEST.md] — 単体テスト計画
- [AI_LOG セッション](../../AI_LOG/D20260608_004_tdd_service-status_revise_C20260608-001.md)
- 起点クレーム: [claim_C20260608-001/001_TRIAGE.md](../claim_C20260608-001_20260608_realtime-refresh-gap/001_TRIAGE.md)

## 注意事項
本レポートのファイルパス・行番号は実装時点のもの。

## 変更一覧

### Phase 1: read-through コア（lib/hub）
- `lib/hub/cache.ts`: `getStatusReadThrough(deps)` を新規追加。`repo.listAll()` の最新 `fetchedAt`（最終同期日時）が TTL（既定 3600s = 1時間、env `STATUS_REFRESH_TTL_SEC` で調整可）より古い、または cache 空のとき、`refreshStatusCache`（既存）を再利用して HUB を再取得し再 listAll。失敗時は前回値を返す（graceful、S-E1）。in-memory throttle（`ReadThroughThrottle`、既定 module-level / テストは deps.throttle で分離）で HUB-down 時の連続 fetch を 60s 抑制。`getCachedStatus`（cron backstop 経路）は不変で残置。
- `lib/hub/readThrough.test.ts`: RT-1（fresh skip）/ RT-2（stale refresh = naze-bako 出現相当）/ RT-3（空 cache refresh）/ RT-4（短 TTL stale）/ RT-5（fetch 失敗 graceful）/ RT-7（TTL 境界）/ RT-8（throttle 抑制）の 7 件。

### Phase 2: 配信経路結線（load / api）
- `lib/service-status/load.ts`: `loadStatusSafe` を `getCachedStatus` → `getStatusReadThrough` に切替（try/catch graceful は維持）。トップ / `/services` ページが read-through 経由に。
- `app/api/services/route.ts`: `getStatusReadThrough` 経由 + try/catch graceful。レスポンスに `syncedAt`（最新 fetchedAt の ISO、0 件 null）を additive 追加。

### Phase 3: 最終同期日時表示（UI）
- `lib/service-status/syncedAt.ts`: 新規。`newestFetchedAt(items)`（fetchedAt 最大値、0 件 null）+ `formatSyncedAt(date)`（「2026年6月8日 8:30 現在」形式、JST、時は非ゼロ詰め・分 2 桁）。純関数。
- `lib/service-status/syncedAt.test.ts`: SA-1/1b/3/3b（算出）+ SA-2/2b/2c（整形）の 7 件。
- `features/service-status/StatusList.tsx`: `syncedAt?` prop を追加。一覧末尾に「{日時}現在」を控えめ表示（`text-right text-xs text-ink-muted`）。0 件（EmptyState）時は非表示。prop 省略時も非表示（後方互換）。
- `app/page.tsx` / `app/services/page.tsx`: `newestFetchedAt(rows)` で syncedAt を算出し StatusList に渡す。

### 設定
- `.env.example` / `.env.production.example`: `STATUS_REFRESH_TTL_SEC=3600`（任意）を追記。

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | `app/api/services/route.ts` に try/catch graceful を追加（read-through で HUB 例外が API に漏れないよう、SEC-001 整合）。`StatusList` を `<ul>` 単独 → `<div>` ラッパに変更（syncedAt を一覧外に配置するため） |
| 計画から省略した変更 | なし |
| 想定外の問題と対処 | route.ts の `let rows` 型推論エラー（TS7034）→ `ServiceStatusRow[]` を明示型付けで解消 |

## PR Description

### タイトル
service-status: 稼働一覧の read-through refresh（Vercel cron 非依存）+ 最終同期日時表示

### 概要
HUB に登録したサービスが日次 cron（Vercel Hobby 制約）でしか反映されず最大 ~24h 表示されない問題（claim C20260608-001、naze-bako 欠落）を解消。鮮度担保を Vercel cron からリクエスト駆動の read-through cache に移行し、最終同期日時から TTL（1時間）超で HUB を再取得する。あわせて最終同期日時を「{日時}現在」形式で表示。

### 変更内容
- `getStatusReadThrough`: 最終同期日時（既存 fetchedAt 流用）が TTL 超なら訪問者リクエスト時に HUB 再取得（cron 非依存、graceful fallback、throttle）
- 配信経路（loadStatusSafe / /api/services）を read-through 経由に
- 最終同期日時を「{日時}現在」で表示（0 件時非表示）
- 日次 cron は cold-start プライマー兼 backstop として残置（変更なし）
- 後方互換（レスポンス additive、DB スキーマ無変更、migration 不要）

### テスト
- 追加: read-through 7 件 + syncedAt 7 件
- 全 unit: 184 / 184 パス（100%）、tsc --noEmit clean
