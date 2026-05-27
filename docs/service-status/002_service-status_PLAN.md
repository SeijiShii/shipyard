# service-status 実装計画書

> **入力**: `./001_service-status_SPEC.md`, `../_shared/hub-client/*`, `../_shared/db/*`
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `features/service-status/StatusList.tsx` | 稼働一覧 component（landing 埋込 + /services） | ui, hub-client | 70 |
| `app/(public)/services/page.tsx` | 一覧ページ（任意、トップ埋込でも可） | StatusList, seo | 30 |
| `app/api/services/route.ts` | キャッシュ済 status 配信（getCachedStatus） | hub-client | 30 |
| `app/api/cron/refresh-status/route.ts` | Cron refresh（CRON_SECRET 検証 + refreshStatusCache） | hub-client | 40 |
| `lib/service-status/uptime.ts` | 稼働日数計算（since → N 日） | — | 20 |
| `vercel.json` | Cron スケジュール定義 | — | 10 |

## 2. 実装 Phase 分割
- **Phase 1**: StatusList（getCachedStatus mock）+ uptime 計算
- **Phase 2**: /api/services（cache 配信）+ /api/cron/refresh-status（secret 検証 + refresh）
- **Phase 3**: vercel.json cron 設定（間隔確定）+ 実 HUB or mock 結合

## 3. 依存関係順序
```
hub-client/db → uptime / StatusList → /api/services / /api/cron → vercel.json
```

## 4. 既存ファイルへの影響
- landing が StatusList を埋込。`vercel.json`（cron）新規。

## 5. リスク・注意点
- /api/cron は CRON_SECRET で保護（外部手動叩き防止、S-E2）。
- HUB ダウン時 graceful（hub-client が cache 保持）。
- 内部指標を絶対に表示・受信しない（hub-client の strip + 表示層も安全サブセットのみ）。

## 6. 完了の定義
- [ ] StatusList が up/down/unknown を plain 文言 + 状態色で表示
- [ ] /api/services が cache 配信、/api/cron が secret 保護 + refresh
- [ ] HUB ダウン時 graceful（前回値 + 〜時点）
- [ ] 視覚レビュー（Phase 3）

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
