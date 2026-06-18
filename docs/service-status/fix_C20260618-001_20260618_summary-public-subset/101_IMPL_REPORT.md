# fix C20260618-001 実装レポート — toPublicStatus が summary を脱落

**起点クレーム**: ../claim_C20260618-001_20260618_summary-not-displayed/001_TRIAGE.md (判定=バグ)
**実装日**: 2026-06-18
**severity**: medium

## 根本原因
`lib/service-status/api.ts` の公開サブセット mapper `toPublicStatus` + 型 `PublicServiceView` が
`slug/name/url/status/since/iconUrl/fetchedAt` のみ列挙し **summary を含めていなかった**。
[論点-010] revise (cbb8bb4) は contract/cache/DB/StatusCard/StatusList には summary を配線したが、
**`/api/services` の公開シリアライズ層 (`toPublicStatus`) を漏らした**ため、DB に summary があっても
JSON API で脱落 → 公開 API consumer に届かなかった。

## 修正
- `PublicServiceView` 型に `summary: string | null` 追加。
- `toPublicStatus` mapper に `summary: r.summary ?? null` 追加。
- 回帰テスト: 既存 safe-subset toEqual に `summary: null` 追加 + 新規 U-SUM-pub (summary 通過検証)。
- tests 14 green。

## 注記 (LP は別経路、本 fix とは独立)
LP (`app/page.tsx`) は `loadStatusSafe` → `ServiceStatusRow[]` を直接使う経路で **summary は元々コード上通っていた**。
LP に summary が出ないのは shipyard cache が service-hub の現 summary を未取得 (read-through TTL / collect timing) +
producer 側のデータ供給 (3 producer 未デプロイ / collect 未伝播) が要因 = 運用事項。本 fix は `/api/services` API consumer の脱落を是正。

## 残 (運用、コード変更外)
- shipyard cache を refresh して service-hub の現 summary (time-budget) を取り込む → LP 表示。
- producer 3 件 (bousai/prayer-list/gohoubi) デプロイ + service-hub collect 伝播で全サービス summary 供給。
