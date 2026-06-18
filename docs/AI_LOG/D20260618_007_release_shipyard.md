# D20260618_007_release_shipyard — /flow:release ([論点-009/010] 本番反映)

**状態**: 完了 (givers.work redeploy green)
**metrics**: { deploy_target: production, deployed_url: "https://givers.work", deployment_id: "dpl_2cbxgn7sZ9NeHsjhjVRWPik8ZP6e", check_result: "frontend 200 + /api/services 200", paid_confirmed: "N/A (課金経路なし)" }
**開始**: 2026-06-18
**dispatch元**: /flow:auto (D20260618_003, P4.7 Release gate)

## サマリ

[論点-009] givers.work rebrand (7352722) + [論点-010] summary 表示 (cbb8bb4) の本番反映。
release-pre 2段クリア済。残 = db:migrate (0002 ADD COLUMN summary、additive) + redeploy = Class B。

## 次アクション (Class B、ユーザー承認待ち)
- ① bash scripts/db-migrate-prod.sh (本番 Neon に service_status_cache.summary 列追加)
- ② bash scripts/deploy-prod.sh (rebrand + summary 本番反映)


## 完了記録 (Class B 承認後実行)
- ユーザー承認「YES」→ ① bash scripts/db-migrate-prod.sh (service_status_cache.summary 列、migrations applied successfully) → ② bash scripts/deploy-prod.sh (givers.work redeploy、dpl_2cbxgn7sZ9NeHsjhjVRWPik8ZP6e、READY)。
- post-deploy smoke: givers.work HTTP 200、/api/services HTTP 200 (summary plumbing live、producer 未申告のため値は未出現=正常)。
- [論点-009] rebrand + [論点-010] summary 本番反映完了。summary パイプライン全層 live (producer → service-hub → givers.work)。P4.7 Release gate ✅。
