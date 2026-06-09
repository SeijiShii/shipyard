# shipyard 開発シナリオ

**最終更新**: 2026-05-28 20:35
**生成元**: /flow:concept (初回) / /flow:scenario (更新)
**シナリオ種別**: 新規 MVP 立ち上げ（公開・UI あり）

> 本ファイルは AI が「次に何をすべきか」を判断する際の参照ドキュメント。
> `/flow:auto` および引数空起動された各 flow コマンドが本ファイルを Read する。
> §5 現在地カーソルは flow コマンドが auto-generated 範囲で書き換える。

---

## 1. ゴール

運用中のマイクロサービス群を公開ショーケースとして見せ、「実際に動いている」信頼で AI コンサルの lead を獲得する。週1ペースのメイカー実績を可視化し、問い合わせ（サイト内スレッド）で会話につなげる。

## 2. 進行フェーズ

1. **Phase 1: 概念設計** — concept.md + SCENARIO.md 確定
2. **Phase 1.5: デザインシステム** — concept から design SoT 導出 + スタイル基盤適用（信頼感 × ミニマル × クラフト感）。`/flow:design`
3. **Phase 2: 機能設計** — concept §1.3 優先度順に SPEC + PLAN + UNIT_TEST + E2E_TEST 生成（基盤 _shared/* から）
4. **Phase 3: 実装** — TDD で各機能を実装。画面実装後に視覚デザインレビュー（Design gate）
5. **Phase 4: 公開準備** — audit + secure(deps) + 法務書類 + PR + デプロイ
6. **Phase 5: 公開後運用** — claim 受付 / fix / revise の循環 + 公開周知（/flow:promote）

> UI を持つ PJ のため Phase 1.5 デザインフェーズを含む。

## 3. 各フェーズで使う flow コマンド + 完了ゲート

### Phase 1: 概念設計
- 主コマンド: `/flow:concept`（初回 完了）
- セキュア: `/flow:secure --phase=design --scope=concept`
- 見積（1 回目）: `/flow:estimate` — concept §1.3 全機能 + §3 NFR からフェルミ推定
- 完了ゲート: concept.md 全節 / secure Critical/High closed / 初回見積生成

### Phase 1.5: デザインシステム（UI あり）
- 主コマンド: `/flow:design`
- 完了ゲート: `docs/design/design-system.md` 生成（信頼感 × ミニマル × クラフト感を concept から導出）、デザイントークンがスタイル基盤に反映

### Phase 2: 機能設計
- 主コマンド: `/flow:feature <target>`（優先度順: _shared/db → ui → seo → email → auth → hub-client → spam → landing → service-status → inquiry → legal → admin）
- セキュア（各機能）: `/flow:secure --phase=design --scope=feature_<target>`
- 見積（2 回目、最初の 1 feature 完了直後）: `/flow:estimate` 再キャリブレ
- 完了ゲート: 全機能 `001`〜`004` 生成、Critical/High 解決

### Phase 3: 実装
- **Phase 0（scaffold、最初に実施。spec-review R2）**: Next.js(App Router)+TS+Tailwind 初期化 / Drizzle 設定 / shadcn 初期化 / `.env.example`（PREREQUISITES のキー）/ `scripts/dev.sh`+`stop.sh`（O36）/ `.github/workflows/ci.yml`+`dependabot.yml`（O37）/ `middleware.ts` 雛形。Class A。
- 主コマンド: `/flow:tdd`（連続実装モード、scaffold 後に concept §1.3.4 優先度順）
- E2E: `/flow:e2e`
- 完了ゲート: 全機能 `101` + テスト通過 + Phase 単位コミット

### Phase 4: 公開準備
- 主コマンド: `/flow:audit` → `/flow:secure --phase=deps` → `/flow:release`
- 完了ゲート: PR マージ + `shipyard.<domain>` デプロイ + プラポリ/利用規約公開

### Phase 5: 公開後運用（循環）
- 公開周知: `/flow:promote`（note / X 用文面）
- バグ・要望: `/flow:claim` → `/flow:fix` or `/flow:revise` → `/flow:tdd` → PR

## 4. 分岐ルール（発生イベント別）

| イベント | 切替先 | 戻り先 |
|---|---|---|
| Critical/High SEC finding | `/flow:revise` or `/flow:fix` | 元 Phase |
| クレーム受領 | `/flow:claim` で判定 | 判定先コマンド |
| 設計 drift（audit） | `/flow:revise` | 元 Phase |
| [論点-001] HUB contract 未確定 | モック contract で service-status 着手、HUB 側は別 PJ で `/flow:revise` | 元 Phase |

## 5. 現在地カーソル

<!-- AUTO-GENERATED:BEGIN scenario-cursor -->
- 現在フェーズ: **Phase 5 (公開後運用) = launch 全完了** 🎉。本番稼働中 `https://shipyard.givers.work` (HTTPS 200 / `/api/services` 200 = service-hub consumer 連携も本番動作)。Release gate (P4.7) + Promote gate (P4.8) **実態通過**。
- 進行中ターゲット: **givers.work リブランド + サービス紹介文表示 ([論点-009〜012]、2026-06-10 [flow] 登録、audit-hittable)**。次回作業は (a) `/flow:revise landing` = givers.work ブランド統一 [論点-009] / (b) `/flow:revise service-status` = 一覧に summary 表示 [論点-010] (上流 service-hub status API summary [論点-011] 待ち) / (c) 問い合わせ運用 (admin) / (d) E2E 基盤化 ([論点-005])
- 最終更新セッション: D20260529_006_promote_shipyard 後の実態 reconcile (本 scenario 更新は D20260529_005/006 セッション内 inline)
- 最終更新時刻: 2026-05-29 09:35
- 完了フェーズ: [Phase 1 (concept+secure+estimate), Phase 1.5 (design SoT), Phase 2 (全 12 設計), Phase 3 unit (scaffold + 横断 7 + 機能 5、**170 GREEN** = O48 revert 後), Phase 4 release scaffold §3.1c 7 ファイル + Phase 1 FILL 完了 + Phase 2 動作確認 (contact + email + cron-refresh + favicon OK = ユーザー確認済) + **service-icons revise tdd 完遂** + **app/icon.svg 配線 (O56)** + **inquiry mail-include-reply revise tdd 完遂 ([論点-006] reconcile、Phase 1 email + Phase 2 admin)** + **[論点-008] O48 適用判定 = shipyard は consumer のみ、pull 対象外確定 → O48 service-info producer 全 revert (D025)** + **初回 GitHub 公開 (https://github.com/SeijiShii/shipyard main branch)** + **smoke-prod.sh 整備 (CF-025) + vercel.json cron 1 日 1 回 (Hobby plan 対応)** + **release-pre 必須監査ハードゲート再通過 (High 0、AUDIT_20260529_0900.md)**]
- 直近進捗 (2026-05-28 32 commits + 2026-05-29): … (2026-05-28 詳細は §6 履歴参照) → **O48 v2 retrofit は overkill と判明し全 revert ([論点-008] consumer 確定)** → smoke-prod.sh (3e0e8cc) + vercel.json cron Hobby 対応 (4a1466a) → **2026-05-29: release-pre 必須監査 full 再実行 (D002、HEAD 4a1466a、Critical/High 0 = PASS) → 本 scenario --update (D003)**
- 次の推奨コマンド (優先順):
  1. (定常運用) 問い合わせ対応 = admin コンソール、機能改善は `/flow:revise`、次サービスは `/flow:ideate`
  2. (任意) E2E 基盤化 [論点-005] = `/flow:feature _shared/e2e` (判断期限 = post-release 到来。担当 seiji)
  3. (任意・bookkeeping) `/flow:concept` UPDATE で §8 resolved 4 件 (001/006/007/008) §7 移動 + [論点-001] stale phrase 訂正 (audit Low 2、deploy 非 gate)
- 備考: **2026-05-29 reconcile (ユーザー確認)**: deploy・subdomain (`shipyard.givers.work`)・Turnstile 実キー化・promote 投稿は **すべて user 側で実施済**、flow の記録が drift していただけ (本番デプロイ 11h 前 Ready を `vercel ls` で確認、AI_LOG 未記録だった)。告知文「生成」のみ flow 未実行だったため D006 `/flow:promote` で生成完了 (`docs/marketing/D20260529_shipyard_posts.md`、投稿は user 手動)。**release-pre 必須監査 AUDIT_20260529_0900 PASS** (Critical/High 0)。残 Low 2 = §8 bookkeeping (非 gate)。E2E は [論点-005] post-release で user 判断 (機能担保 = 170 unit + 本番 /api/services 200 疎通)。**AUDIT-structure-001 (SCENARIO §5 stale) 5 連続 + 本セッションでも deploy/subdomain/promote の drift 露呈 = flow-suite hook (CF-021) + release→promote 生成 HOOK (CF-20260529-002、commit a0b6f94 適用済) で構造的再発防止**。
<!-- AUTO-GENERATED:END scenario-cursor -->

## 6. 変更履歴

- 2026-05-27: /flow:concept で初回生成（新規 MVP 立ち上げシナリオ）
- 2026-05-28 16:55: /flow:scenario --update で §5 現在地カーソルを本日 17 commits 反映で全面 refresh (AUDIT-structure-001 Medium reconcile)。本日の進捗 = concept update + revise×2 (landing messaging-shift / service-status service-icons) + hub-client contract drift 修正 + release scaffold + Phase 1 FILL + Phase 2 動作確認 Step 1-3 + cron-refresh OK + audit standard + flow-suite 補強 CF-014/015/017。Phase 3 → Phase 4 への遷移済を §5 で明示化。decision_id=D20260528-038 (D20260528_012_scenario_update)。
- 2026-05-28 19:20: /flow:audit standard 後の §3.0c シューティング reconcile (D20260528_016) で §5 を本日 27 commits + service-icons revise tdd 完遂 + 初回 GitHub 公開 (https://github.com/SeijiShii/shipyard main branch) で再 refresh (AUDIT-structure-001 Medium 再発 reconcile)。decision_id=D20260528-043。AUDIT-structure-001 が 2 回連続検出 = flow-suite hook 検討候補。
- 2026-05-28 20:35: /flow:scenario --update で §5 を全面 refresh (本日 32 commits + inquiry mail revise tdd + O48 v2 favicon-projection retrofit 完遂 + release-pre 必須監査 2 回通過 = AUDIT-perspective-001 High 1 検出→撃ち落とし→0 達成、AUDIT_20260528_2030.md)。decision_id=D20260528-052。**AUDIT-structure-001 が 4 回連続検出 = 常習化深化、flow-suite hook (CF-021) の優先度確定**。次反復: /flow:concept UPDATE (DOC_MAP + INDEX 細部 + 解消済論点 §7 移動 = 残 Medium 1 + Low 2 一括解消) → Release Phase 3 デプロイ。
- 2026-05-29 09:35: **Phase 5 (公開後運用) = launch 全完了に reconcile** 🎉。release --resume (D005) で `vercel ls` 確認 → 本番デプロイは 11h 前に完了済、subdomain `shipyard.givers.work` も稼働 (HTTPS/API 200)、Turnstile 実キー・promote 投稿も user 実施済と確認 = flow 記録の drift。告知文「生成」のみ未実行だったため D006 `/flow:promote` で生成 (docs/marketing/)。flow-suite に CF-20260529-002 (release→promote 生成 HOOK、commit a0b6f94) 適用。現在フェーズを Phase 4 → **Phase 5** に更新、全 gate 実態通過。decision_id=D20260529-004/005。
- 2026-05-29 09:10: /flow:audit full (release-pre 必須監査 再実行、D002) 後の §3.0c drift シューティング reconcile で §5 を全面 refresh。**前回 (20:35) 以降に発生した O48 v2 retrofit 全 revert ([論点-008] consumer 確定、D025) を反映** = §5 から「O48 v2 retrofit 完遂」削除 + **Phase 3 deploy 手順を訂正** (HUB_SHARED_SECRET→HUB_SERVICE_INFO_SECRET rename は revert で無効 = 両 secret 削除済、consumer は HUB_STATUS_URL のみ → 標準 env push に修正)。smoke-prod.sh (3e0e8cc) + vercel.json cron Hobby 対応 (4a1466a) も反映。GREEN 数 176→170 訂正。decision_id=D20260529-002。**AUDIT-structure-001 (SCENARIO §5 stale) が 5 連続検出 = 常習化深化、flow-suite hook (CF-021) 優先度確定**。残 Low 2 (§8 resolved 4 件 §7 移動 + [論点-001] stale phrase) は concept 領域のため /flow:concept UPDATE へ dispatch (Low、deploy 非 gate)。次反復: /flow:secure (release-pre audit→secure pair) → /flow:release --resume (Phase 3 デプロイ)。
