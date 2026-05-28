# shipyard 開発シナリオ

**最終更新**: 2026-05-28 16:50
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
- 最終更新セッション: D20260528_012_scenario_update (本セッション、bookkeeping)
- 最終更新時刻: 2026-05-28 16:55
- 完了フェーズ: [Phase 1 (concept+secure+estimate), Phase 1.5 (design SoT), Phase 2 (全 12 設計), Phase 3 unit (scaffold + 横断 7 + 機能 5、150→161 GREEN 本日 +11 = U-T1〜T4 + hub U-C1〜C3), Phase 4 release scaffold §3.1c 7 ファイル + Phase 1 FILL 完了 (Neon dev branch / Clerk dev / Resend dev / Turnstile dummy / CRON_SECRET + HUB_SHARED_SECRET 生成 / HUB_STATUS_URL = service-hub MVP) + Phase 2 動作確認 Step 1-3 (db:migrate / next dev / LP 表示 + Hero スタンス反映 + hydration warning 抑制) + cron-refresh OK (hub-client contract drift 修正の動作裏付け)]
- 本日の追加進捗 (2026-05-28、17 commits): concept update (wants.md → メッセージング転換 lead-gen → 「共に考える相談相手」) / revise 設計 2 件 (landing/revise_messaging-shift unit Phase 1 完了 + service-status/revise_service-icons 設計完了 + Phase 5 MIGRATION 計画、tdd は service-hub PJ contract 改訂後) / hub-client contract drift 修正 (CF-20260528-016、Zod union + transform で実 service-hub MVP camelCase + 直接配列対応、161/161 GREEN) / wording gate 通過 (D20260528_006、暫定文案承認、UI コピーは copy.ts 集約済) / [論点-001] resolved + [論点-005/006/007] 新規 open / audit standard 完了 (D20260528_011、Critical/High 0、Medium 2 = SCENARIO stale 本件 reconcile + O56 favicon、トレンド改善 High 1→0) / flow-suite 補強 6 commits (CF-014/015/017)
- 次の推奨コマンド (優先順):
  1. /flow:release --resume で Phase 2 Step 4-5 継続 (contact 送信 + admin Clerk sign-in、ユーザー手動操作必須)
  2. /flow:spec-review service-status/revise_service-icons_* (P3.7 Class A、tdd 着手前の品質ゲート)
  3. service-hub PJ で別 session /flow:revise service-icons (CF-016 (F) 連動改修 producer 側 contract 改訂)
  4. O56 favicon 配線 (AUDIT-perspective-001 Medium、design SoT §8 船渠 line-art ベース)
  5. Phase 3 デプロイ (Vercel preview → サブドメ shipyard.<seiji domain> → prod、本 PJ 無課金で Clerk production instance はサブドメ確定後判断)
  6. Phase 5 /flow:promote (Release 通過 + 告知 URL 確定後)
- 備考: 本日の loop は no-key/Class-A 作業を多数完遂 (concept + revise×2 + tdd Phase 1 + hub drift fix + scaffold + audit + flow-suite 補強)。残 Phase 2 Step 4-5 はユーザー手動操作必須、Phase 3 デプロイは Class B 明示確認。E2E は [論点-005] Playwright scaffold 未完了で 103 red 記録 (機能担保は unit U-T1〜T4 + 視覚は scaffold 完了後)。
<!-- AUTO-GENERATED:END scenario-cursor -->

## 6. 変更履歴

- 2026-05-27: /flow:concept で初回生成（新規 MVP 立ち上げシナリオ）
- 2026-05-28 16:55: /flow:scenario --update で §5 現在地カーソルを本日 17 commits 反映で全面 refresh (AUDIT-structure-001 Medium reconcile)。本日の進捗 = concept update + revise×2 (landing messaging-shift / service-status service-icons) + hub-client contract drift 修正 + release scaffold + Phase 1 FILL + Phase 2 動作確認 Step 1-3 + cron-refresh OK + audit standard + flow-suite 補強 CF-014/015/017。Phase 3 → Phase 4 への遷移済を §5 で明示化。decision_id=D20260528-038 (D20260528_012_scenario_update)。
