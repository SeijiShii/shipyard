# revise_010_20260618_summary-display — 一覧に summary 短文紹介を表示 [論点-010]

**状態**: shipped (本番反映済、service_status_cache.summary 列 migrate 済 + redeploy、smoke green)
<!-- ticket-status: shipped | updated: 20260618 | ref: dpl_2cbxgn7sZ9NeHsjhjVRWPik8ZP6e (givers.work redeploy) -->

**種別**: revise (service-status + hub-client + db — O48 v3 summary consumer 表示)
**起点**: concept §8 [論点-010] (★★★必須) / 上流 [論点-011] (service-hub) は本日 landed
**重要度**: ★★★必須 (showcase 一覧の「何のサービスか」)

## 概要

service-hub 公開 status API が露出する `summary` ([論点-011]、本日 service-hub で landed) を
shipyard が消費し、稼働一覧の各サービスに**サービス名だけでなく短文紹介を表示**する ([論点-010])。
service-icons (iconUrl) の consumer 配線と完全に対称。

## summary パイプライン (本日で全層 landed = コード上)

```
producer service-info v3 summary   →   service-hub 公開API露出   →   shipyard 表示 (本 revise)
  hana-memo / naze-bako / time-budget    [論点-011] landed             [論点-010] landed
```

## 変更内容 (iconUrl=service-icons と対称)

| 層 | 変更 |
|---|---|
| `lib/hub/contract.ts` | `serviceStatusSchema.summary` (optional、不正値は service エントリ保持で undefined 降格 `.catch`) |
| `lib/db/schema.ts` | `service_status_cache.summary` text 列 + migration `0002_unknown_network.sql` (ADD COLUMN) |
| `lib/db/repositories/statusCache.ts` | `StatusCacheInput.summary` + values 明示列挙 + onConflict `excluded.summary` |
| `lib/hub/cache.ts` | refresh upsert 入力に `summary` 明示列挙 (漏らすと DB 保存されない) |
| `features/service-status/StatusList.tsx` | `StatusListItem.summary` passthrough |
| `components/status/StatusCard.tsx` | `StatusCardService.summary` + 名前の下に短文表示 (有→`line-clamp-2`、無/空白→非表示で既存レイアウト維持) |

## 検証

- 全 **17 files / 199 tests green** / `tsc --noEmit` clean
- 新規 +7: contract SM-C1〜3 (summary 保持/optional/不正降格) / StatusCard SM-Card1〜3 (表示/非表示/空白) / repo SM-Repo1 (round-trip + upsert 上書き)

## 残 (デプロイ + 視覚レビュー)

- **DB migration apply**: `db:migrate` で `service_status_cache.summary` 列を本番 Neon に反映 (= `/flow:release`、Class B)
- **視覚レビュー (Design gate)**: summary 行のカードレイアウトは**実データ表示での視覚確認が必要**。
  実 summary は上流 (service-hub) デプロイ後に流れるため、`/flow:design --review-only` は
  **パイプライン全層デプロイ後**に実施 (それまでは component テストで機能担保)。
- **上流デプロイ依存**: service-hub ([論点-011]) + producer 各サービスの再デプロイで実 summary が流れる。
