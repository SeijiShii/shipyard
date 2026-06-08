# 単体テストレポート: service-status revise C20260608-001

## 実施日時
2026-06-08 09:00 (JST)

## 関連ドキュメント
- [003_REVISE_UNIT_TEST.md] — 単体テスト計画

## テスト実行環境
- ランタイム: Node.js（Vitest jsdom）
- フレームワーク: Vitest 2.1.9

## テスト結果

| # | テストケース | テストファイル | 結果 | 備考 |
|---|------------|-------------|------|------|
| RT-1 | fresh（TTL 内）は HUB を叩かず cache | lib/hub/readThrough.test.ts | ✅ | |
| RT-2 | stale は refresh して最新（naze-bako 出現相当） | lib/hub/readThrough.test.ts | ✅ | 2→3 件 |
| RT-3 | cache 空は refresh | lib/hub/readThrough.test.ts | ✅ | |
| RT-4 | 短 TTL で stale 判定（env 相当） | lib/hub/readThrough.test.ts | ✅ | ttlSec=60 |
| RT-5 | fetch 失敗は前回値（graceful、例外なし） | lib/hub/readThrough.test.ts | ✅ | S-E1 |
| RT-7 | TTL ちょうどは stale（>=） | lib/hub/readThrough.test.ts | ✅ | 境界 |
| RT-8 | throttle 窓内は 2 回目 fetch しない | lib/hub/readThrough.test.ts | ✅ | |
| SA-1 | newestFetchedAt 最大値（Date） | lib/service-status/syncedAt.test.ts | ✅ | |
| SA-1b | newestFetchedAt 最大値（ISO 文字列） | lib/service-status/syncedAt.test.ts | ✅ | |
| SA-3 | 0 件は null | lib/service-status/syncedAt.test.ts | ✅ | |
| SA-3b | 全 null/無効は null | lib/service-status/syncedAt.test.ts | ✅ | |
| SA-2 | 「{日時}現在」形式（JST） | lib/service-status/syncedAt.test.ts | ✅ | |
| SA-2b | 分 0 詰め | lib/service-status/syncedAt.test.ts | ✅ | |
| SA-2c | null は表示なし | lib/service-status/syncedAt.test.ts | ✅ | |

## 追加テストケース
RT-1b 相当は RT-4 に統合。計画 003 の RT-6（loadStatusSafe repo throw）/ API-1/2 / EX-1/2 は既存 `load.test.ts`（3 件、維持 GREEN）+ route の graceful try/catch で担保（route は read-through + syncedAt の合成のため純ロジック側でカバー）。

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト数 | 14（RT 7 + SA 7） |
| 追加テスト数 | 0 |
| 合計（本 revise 追加） | 14 件 |
| 全 unit スイート | 184 件 |
| 成功 | 184 件 |
| 失敗 | 0 件 |
| 成功率 | 100% |

リグレッション: 既存 `lib/hub/hub.test.ts`（19）/ `lib/service-status/load.test.ts`（3）含め全維持 GREEN。tsc --noEmit clean。
