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
- 現在フェーズ: Phase 4 (公開準備) 進行中 = Release gate Phase 1 FILL 完了 + Phase 2 動作確認 完了 + Phase 3 デプロイ残 (release-pre 必須監査ハードゲート通過、High 0)
- 進行中ターゲット: (a) Phase 3 デプロイ (.env.production.local の HUB_SHARED_SECRET → HUB_SERVICE_INFO_SECRET rename + vercel env update → preview → prod、Class B 明示確認) / (b) Phase 5 公開周知 (/flow:promote、告知 URL 確定後)
- 最終更新セッション: D20260528_023_audit_full 後の §3.0c drift シューティング reconcile (本 scenario --update)
- 最終更新時刻: 2026-05-28 20:35
- 完了フェーズ: [Phase 1 (concept+secure+estimate), Phase 1.5 (design SoT), Phase 2 (全 12 設計), Phase 3 unit (scaffold + 横断 7 + 機能 5、150→176 GREEN 本日 +26 = landing messaging-shift +11 + service-icons +11 + inquiry mail revise +2 + service-info v2 retrofit +2), Phase 4 release scaffold §3.1c 7 ファイル + Phase 1 FILL 完了 + Phase 2 動作確認 (contact + email + cron-refresh + favicon OK = ユーザー確認済) + **service-icons revise tdd 完遂** + **app/icon.svg 配線 (O56)** + **inquiry mail-include-reply revise tdd 完遂 ([論点-006] reconcile、Phase 1 email + Phase 2 admin)** + **O48 v2 favicon-projection retrofit 完遂 (HUB_SHARED_SECRET → HUB_SERVICE_INFO_SECRET + iconUrl + schemaVersion=2、AUDIT-perspective-001 撃ち落とし)** + **初回 GitHub 公開 (https://github.com/SeijiShii/shipyard main branch)** + **release-pre 必須監査ハードゲート通過 (High 0 達成、AUDIT_20260528_2030.md)**]
- 本日の追加進捗 (2026-05-28、32 commits): concept update + revise×3 設計 (landing messaging-shift / service-status service-icons / inquiry mail-include-reply / _shared/hub-client service-info-v2) + hub-client contract drift 修正 (CF-016) + landing tdd Phase 1 + wording gate (D006) + audit standard×3 + full×2 (D011/D016/D020/D023、release-pre 2 回通過 = High 1 検出→ retrofit→High 0 解消) + scenario --update (D012/本回) + spec-review service-icons (D013) + O56 favicon retrofit (D014) + service-icons revise tdd (D015) + 初回 GitHub push + inquiry mail revise tdd (D018) + **O48 v2 retrofit revise+tdd (D021/D022)** + flow-suite 補強 6 commits (CF-014/015/017)
- 次の推奨コマンド (優先順):
  1. **/flow:concept UPDATE** (DOC_MAP stale + INDEX 細部 stale + 解消済 3 論点 §8→§7 移動、AUDIT_20260528_2030.md 残 Medium 1 + Low 2 一括解消) — auto-execute 候補
  2. **/flow:release --resume** で Phase 3 デプロイ (Vercel env: HUB_SHARED_SECRET 削除 + HUB_SERVICE_INFO_SECRET 同値で再作成、.env.production.local も rename → preview → prod、Class B 明示確認)
  3. Phase 5 /flow:promote (Release 通過 + 告知 URL 確定後、現状 §4.7 が独自ドメイン shipyard.<domain> 採用予定 = サブドメ決定が release Phase 3 で完結)
- 備考: 本日の loop は no-key/Class-A 作業を **32 commits 完遂** (本セッションで +9: inquiry tdd + resume + audit + revise + tdd + audit×2 + scenario update + 本)、AUDIT-perspective-001 (O48 v2 drift) 撃ち落としで **release-pre ハードゲート通過**。残 Phase 3 デプロイは Class B (ユーザー明示確認必須)、本番キー production-spec 化は Class B-4。E2E は [論点-005] Playwright scaffold 未完了で 103 red 記録継続 (機能担保は 176 unit + 実 cron-refresh + /api/services 疎通 + service-info v2 producer)。AUDIT-structure-001 SCENARIO §5 stale が 4 連続検出 = flow-suite で「flow コマンド完了時に scenario --update を自動 dispatch する hook」検討の優先度確定 (CF-021 候補)。
<!-- AUTO-GENERATED:END scenario-cursor -->

## 6. 変更履歴

- 2026-05-27: /flow:concept で初回生成（新規 MVP 立ち上げシナリオ）
- 2026-05-28 16:55: /flow:scenario --update で §5 現在地カーソルを本日 17 commits 反映で全面 refresh (AUDIT-structure-001 Medium reconcile)。本日の進捗 = concept update + revise×2 (landing messaging-shift / service-status service-icons) + hub-client contract drift 修正 + release scaffold + Phase 1 FILL + Phase 2 動作確認 Step 1-3 + cron-refresh OK + audit standard + flow-suite 補強 CF-014/015/017。Phase 3 → Phase 4 への遷移済を §5 で明示化。decision_id=D20260528-038 (D20260528_012_scenario_update)。
- 2026-05-28 19:20: /flow:audit standard 後の §3.0c シューティング reconcile (D20260528_016) で §5 を本日 27 commits + service-icons revise tdd 完遂 + 初回 GitHub 公開 (https://github.com/SeijiShii/shipyard main branch) で再 refresh (AUDIT-structure-001 Medium 再発 reconcile)。decision_id=D20260528-043。AUDIT-structure-001 が 2 回連続検出 = flow-suite hook 検討候補。
- 2026-05-28 20:35: /flow:scenario --update で §5 を全面 refresh (本日 32 commits + inquiry mail revise tdd + O48 v2 favicon-projection retrofit 完遂 + release-pre 必須監査 2 回通過 = AUDIT-perspective-001 High 1 検出→撃ち落とし→0 達成、AUDIT_20260528_2030.md)。decision_id=D20260528-052。**AUDIT-structure-001 が 4 回連続検出 = 常習化深化、flow-suite hook (CF-021) の優先度確定**。次反復: /flow:concept UPDATE (DOC_MAP + INDEX 細部 + 解消済論点 §7 移動 = 残 Medium 1 + Low 2 一括解消) → Release Phase 3 デプロイ。
