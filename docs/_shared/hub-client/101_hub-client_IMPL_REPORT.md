# 実装レポート: _shared/hub-client

## 実装日時
2026-05-27 15:48 (JST)

## モード
feature（横断基盤・HUB status クライアント）

## 関連ドキュメント
- [001_hub-client_SPEC.md](./001_hub-client_SPEC.md) / [002_hub-client_PLAN.md](./002_hub-client_PLAN.md) / [003_hub-client_UNIT_TEST.md](./003_hub-client_UNIT_TEST.md)
- [AI_LOG セッション](../../AI_LOG/D20260527_019_tdd_continuous.md)

## 変更一覧

### Phase 1: contract + mock
- `lib/hub/contract.ts` — Zod schema（`serviceStatusSchema` / `publicStatusResponseSchema`）。z.object のデフォルト strip で安全サブセットのみ受信（内部指標破棄）、status enum で不正値 reject
- `lib/hub/mock.ts` — `MOCK_HUB_STATUS`（[論点-001] 未実装時の dev 用、HUB-E4）

### Phase 2: client
- `lib/hub/client.ts` — `fetchHubStatus({fetcher?,url?,apiKey?,timeoutMs?})`（fetch injectable、AbortSignal.timeout、Zod 検証、5xx/不一致は throw）

### Phase 3: cache
- `lib/hub/cache.ts` — `refreshStatusCache({repo,fetchStatus?,now?})`（成功で statusCacheRepo.upsertMany、失敗で前回値保持）/ `getCachedStatus({repo})`（listAll、HUB を叩かない）

### スコープ外（本 target では未実装）
- Cron route（app/api/cron/refresh-status）は service-status 側で配線（SPEC §1「利用機能: cron」）
- HUB 側 API は別タスク（service-hub /flow:revise、[論点-001]）。実 HUB 結合は env URL 切替

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | fetch/statusCacheRepo/now をすべて injectable に（実 HUB・実 DB 不要で 100% テスト）。`RefreshResult`（{ok,updated}|{ok:false,kept}）で graceful 失敗を型表現 |
| 計画から省略した変更 | Cron route は service-status へ繰延（hub-client は純 lib に保つ） |
| 想定外の問題 | なし。Zod の暗黙 strip が安全サブセット要件（U-E3）にそのまま合致 |

## PR Description
### タイトル
_shared/hub-client: HUB status の安全サブセット取得 + キャッシュ + フォールバック
### 概要
service-hub の公開 status を read-only 消費し Neon にキャッシュ。HUB ダウン時は最終既知値を保持（graceful）。Zod で安全サブセットのみ受信し内部指標を破棄。HUB 未実装の間は mock で開発。
### 変更内容
- contract（Zod strip = 内部指標破棄、status reject）+ mock
- fetchHubStatus（injectable fetch、timeout、検証）
- refreshStatusCache（失敗時キャッシュ保持）/ getCachedStatus
### テスト
- 単体 12 件、全 GREEN。全体 88/88（100%）、typecheck クリーン。strip/フォールバック分岐 100%。
