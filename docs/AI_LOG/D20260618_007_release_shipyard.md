# D20260618_007_release_shipyard — /flow:release ([論点-009/010] 本番反映)

**状態**: 進行中 (Class B deploy 承認待ち)
**開始**: 2026-06-18
**dispatch元**: /flow:auto (D20260618_003, P4.7 Release gate)

## サマリ

[論点-009] givers.work rebrand (7352722) + [論点-010] summary 表示 (cbb8bb4) の本番反映。
release-pre 2段クリア済。残 = db:migrate (0002 ADD COLUMN summary、additive) + redeploy = Class B。

## 次アクション (Class B、ユーザー承認待ち)
- ① bash scripts/db-migrate-prod.sh (本番 Neon に service_status_cache.summary 列追加)
- ② bash scripts/deploy-prod.sh (rebrand + summary 本番反映)
