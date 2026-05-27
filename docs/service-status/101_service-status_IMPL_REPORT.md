# 実装レポート: service-status

## 実装日時
2026-05-27 15:59 (JST)

## モード
feature（UI + API + Cron）

## 関連ドキュメント
- [001_service-status_SPEC.md](./001_service-status_SPEC.md) / [002_…_PLAN.md](./002_service-status_PLAN.md) / [003_…_UNIT_TEST.md](./003_service-status_UNIT_TEST.md) / [004_…_E2E_TEST.md](./004_service-status_E2E_TEST.md)（E2E は /flow:e2e）
- [AI_LOG セッション](../AI_LOG/D20260527_019_tdd_continuous.md)

## 変更一覧

### Phase 1: StatusList + uptime
- `features/service-status/StatusList.tsx` — 稼働一覧 component（StatusCard 列、0 件で EmptyState、未知 status フォールバック）
- `lib/service-status/uptime.ts` — `uptimeDays`（lib/ui/status.daysSince を re-export、一本化）

### Phase 2: API + Cron
- `lib/service-status/api.ts` — `toPublicStatus`（DB 行→安全サブセット、内部/余剰フィールド除外 U-B1）/ `isAuthorizedCron`（CRON_SECRET 検証 S-E2）
- `app/api/services/route.ts` — GET（getCachedStatus → toPublicStatus 配信、HUB 非依存）
- `app/api/cron/refresh-status/route.ts` — GET（CRON_SECRET 保護 + refreshStatusCache、失敗時は cache 保持で 200）
- `app/services/page.tsx` — 稼働一覧ページ（cache のみ、buildMetadata）

### Phase 3: Cron 設定
- `vercel.json` — cron `/api/cron/refresh-status` `*/10 * * * *`（scaffold で設定済、確認のみ）

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | route handler の核ロジック（toPublicStatus / isAuthorizedCron）を `lib/service-status/api.ts` に抽出して unit（route 本体は thin wiring、E2E で被覆）。uptime は daysSince の re-export で二重定義回避 |
| 計画から省略した変更 | services ページは route group `(public)` を作らず `app/services/page.tsx`（flat、URL 同一）に配置（route group 再構成は landing 側の責務に委ねる）。実 HUB 結合・cron 実行は Release/[論点-001] |
| 想定外の問題 | なし。route handler は `getRepos()`（実 DB runtime）を使うため unit せず、E2E（004）+ Release で確認 |

## PR Description
### タイトル
service-status: 稼働一覧 + キャッシュ配信 API + Cron refresh
### 概要
HUB の稼働状況を cache 経由で表示（画面は HUB を叩かない）。Cron が定期 refresh、HUB ダウン時は前回値保持（graceful）。配信は安全サブセットのみ（内部指標非表示）。
### 変更内容
- StatusList（up/down/unknown を plain 文言 + 状態色、0 件 EmptyState）
- /api/services（安全サブセット配信）/ /api/cron（CRON_SECRET 保護 + refresh）
- uptimeDays（since→稼働日数）
### テスト
- 単体 7 件、全 GREEN。全体 112/112（100%）、typecheck クリーン。安全サブセット/secret 検証分岐 100%。E2E（004）は /flow:e2e。
