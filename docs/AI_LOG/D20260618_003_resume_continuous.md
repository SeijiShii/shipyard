# D20260618_003_resume_continuous — /flow:auto (shipyard [論点-010] 全層デプロイ)

**状態**: 進行中
**モード**: continuous (service-hub summary prod 反映完了 → 下流 shipyard [論点-010] consumer をデプロイへ)
**開始**: 2026-06-18

## サマリ

service-hub の summary-projection が本日本番反映 (17th deploy、/api/public/status が summary 露出)。
これにより前回 D20260618_002 が Class B gate で正当停止していた shipyard [論点-010] (code-complete
cbb8bb4、199 tests green、migration 0002 生成済) の全層デプロイが可能に。release-pre 監査 → release。

## decisions

- id: D20260618-003-00
  question: 前回停止の適切性 (retrospective, Step 0.5)
  chosen: 適切 (§4.5.1 条件2 = Class B gate / 視覚レビューは実データ無しで正当 defer)
  chosen_type: auto-recommended
  context: |
    前回 D20260618_002 は [論点-010] を code-complete (cbb8bb4、199 green、migration 0002) にし、
    残 = 全層デプロイ (Class B: shipyard db:migrate + service-hub db:push + redeploy) +
    視覚レビュー (実 summary データ無しで意味薄 → 正当 defer) で停止。当時 service-hub summary が
    未デプロイ = summary データが流れない状態だったため、Class B gate + データ依存 defer は適切な停止。
    今回 service-hub 17th deploy で上流が本番反映 → shipyard デプロイが解禁された。

- id: D20260618-003-01
  question: 反復1 auto-pick (§3.0c release-pre 必須監査)
  chosen: /flow:audit --scope=full (release-pre、no-key Class A)
  chosen_type: auto-recommended
  context: |
    P1 (open SEC=0) / P2 (中断なし)。[論点-010] code-complete、残はデプロイ (Class B、P4.7)。
    §3.0c release-pre 必須監査: 直近 AUDIT_20260529_0900 ≠ HEAD 6e9e268 (以降 [論点-009] rebrand +
    [論点-010] summary + legal tokushoho revise + www.givers.work 接続が landed) → shipyard
    redeploy 前に full audit + secure 必須。

- id: D20260618-003-02
  question: 反復2 auto-pick (drift-shooting: audit Medium ×3)
  chosen: /flow:concept UPDATE で [論点-009/010/011] を resolved 化
  chosen_type: auto-recommended
  context: |
    反復1 (audit full, commit fad04fa) で Medium 3 件 (論点 009/010/011 status drift) 検出。
    §3.0c drift-shooting = concept drift → /flow:concept UPDATE。
    [論点-009] rebrand (7352722) + [論点-010] summary (cbb8bb4) 実装済だが accepted-as-requirement /
    [論点-011] 上流 service-hub 17th deploy 反映済だが open → resolved 化 + §7 移動。

- id: D20260618-003-03
  question: 反復3-4 (release-pre 2段目 secure + P4.7 Release gate)
  chosen: secure 完了 (新規SEC0、commit 7ca6659) → /flow:release (shipyard redeploy = Class B、承認待ち)
  chosen_type: auto-recommended
  context: |
    release-pre 必須監査 2段クリア (AUDIT_20260618_1210 C0/H0 + SECURITY_REVIEW_20260618 新規SEC0)。
    全 no-key Class A 完遂 (199 tests green、[論点-009/010/011] reconcile 済)。
    残 = shipyard prod deploy = (1) db:migrate (0002 ADD COLUMN summary、additive nullable) +
    (2) deploy-prod.sh (rebrand [論点-009] + summary [論点-010] 本番反映) = Class B (P4.7)。
    §1.0c microservice fleet → prod-direct。Class B deploy はユーザー明示承認待ちで 1-decision pause。
    note: Clerk=sk_test だが operator-admin 専用 (単一 operator=seiji、公開ページは no-login)
    のため dev instance 許容 (release P5 ※ 例外、launch 時既決)。summary deploy のブロッカーでない。
