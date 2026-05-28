# shipyard 開発シナリオ

**最終更新**: 2026-05-28 19:20
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
- 現在フェーズ: Phase 4 (公開準備) 進行中 = Release gate Phase 1 FILL 完了 + Phase 2 動作確認 Step 1-3 完了 + Step 4-5 残
- 進行中ターゲット: (a) Phase 2 動作確認 Step 4-5 (contact 送信 + Resend 通知 + admin Clerk sign-in、ユーザー手動操作) / (b) Phase 3 デプロイ (Vercel preview → サブドメ shipyard.<domain> → prod) / (c) Phase 5 公開周知 (/flow:promote)
- 最終更新セッション: D20260528_016_audit_standard 後の §3.0c シューティング reconcile (本セッション、bookkeeping)
- 最終更新時刻: 2026-05-28 19:20
- 完了フェーズ: [Phase 1 (concept+secure+estimate), Phase 1.5 (design SoT), Phase 2 (全 12 設計), Phase 3 unit (scaffold + 横断 7 + 機能 5、150→172 GREEN 本日 +22 = landing messaging-shift +11 + service-icons +11), Phase 4 release scaffold §3.1c 7 ファイル + Phase 1 FILL 完了 + Phase 2 動作確認 Step 1-3 + cron-refresh OK + **service-icons revise tdd 完遂 (Phase 1 基盤 + Phase 2 UI、全パイプライン疎通: service-hub → cron → Neon → /api/services → StatusCard <img>)** + **app/icon.svg 配線 (O56 favicon retrofit)** + **初回 GitHub 公開 (https://github.com/SeijiShii/shipyard main branch)**]
- 本日の追加進捗 (2026-05-28、27 commits): concept update (wants.md メッセージング転換) + revise 設計 2 件 (landing/revise_messaging-shift + service-status/revise_service-icons) + hub-client contract drift 修正 (CF-016) + landing tdd Phase 1 完了 + wording gate 通過 (D006) + audit standard ×2 (D011+D016、トレンド改善 High 1→0、Medium 2→1) + scenario --update (D012) + spec-review service-icons (D013、Critical 1+High 1+Medium 4+Low 1 全反映) + O56 favicon retrofit (D014) + service-icons revise tdd Phase 1+2 (D015、+11 tests + Neon dev branch migration apply + 全パイプライン疎通) + 初回 GitHub push + flow-suite 補強 6 commits (CF-014/015/017)
- 次の推奨コマンド (優先順):
  1. Phase 2 動作確認 Step 4-5-6 = ユーザー手動 (contact 送信 + Resend 通知 + admin Clerk sign-in + favicon タブ確認 OK)
  2. concept §8 [論点-005] (Playwright bootstrap) + [論点-007] (icon フォールバック背景色 resolved by D013) 登録 (Low reconcile、本反復で実施候補)
  3. /flow:release --resume で Phase 3 デプロイ (Vercel preview → サブドメ確定 → prod、Class B 明示確認)
  4. [論点-006] inquiry mail template revise (Phase 3 release 前)
  5. Phase 5 /flow:promote (Release 通過 + 告知 URL 確定後)
- 備考: 本日の loop は no-key/Class-A 作業を 27 commits 完遂、tdd 完遂 + GitHub 公開で重要マイルストーン達成。残 Phase 2 Step 4-5 はユーザー手動、Phase 3 デプロイは Class B、本番キー production-spec 化は Class B-4。E2E は [論点-005] Playwright scaffold 未完了で 103 red 記録 (機能担保は unit + 実 cron-refresh + /api/services 疎通)。tdd 完了時に §5 が即座 stale 化する運用パターン課題 = flow-suite で hook 検討候補 (AUDIT-structure-001 2 連続検出)。
<!-- AUTO-GENERATED:END scenario-cursor -->

## 6. 変更履歴

- 2026-05-27: /flow:concept で初回生成（新規 MVP 立ち上げシナリオ）
- 2026-05-28 16:55: /flow:scenario --update で §5 現在地カーソルを本日 17 commits 反映で全面 refresh (AUDIT-structure-001 Medium reconcile)。本日の進捗 = concept update + revise×2 (landing messaging-shift / service-status service-icons) + hub-client contract drift 修正 + release scaffold + Phase 1 FILL + Phase 2 動作確認 Step 1-3 + cron-refresh OK + audit standard + flow-suite 補強 CF-014/015/017。Phase 3 → Phase 4 への遷移済を §5 で明示化。decision_id=D20260528-038 (D20260528_012_scenario_update)。
- 2026-05-28 19:20: /flow:audit standard 後の §3.0c シューティング reconcile (D20260528_016) で §5 を本日 27 commits + service-icons revise tdd 完遂 + 初回 GitHub 公開 (https://github.com/SeijiShii/shipyard main branch) で再 refresh (AUDIT-structure-001 Medium 再発 reconcile)。decision_id=D20260528-043。AUDIT-structure-001 が 2 回連続検出 = flow-suite hook 検討候補。
