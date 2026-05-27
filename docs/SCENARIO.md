# shipyard 開発シナリオ

**最終更新**: 2026-05-27 12:35
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
- 主コマンド: `/flow:tdd`（連続実装モード）
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
- 現在フェーズ: Phase 2 完了 → Phase 3（実装）着手前
- 進行中ターゲット: （次ゲート）Spec-review（P3.7）→ 実装 tdd
- 最終更新セッション: D20260527_017_feature_legal
- 最終更新時刻: 2026-05-27 16:18
- 完了フェーズ: [Phase 1（concept + secure + estimate）, Phase 1.5（design SoT）, Phase 2（全 12 ターゲット設計: 横断 7 + 機能 5、001-004 生成）]
- 次の推奨コマンド: /flow:spec-review（P3.7、tdd 着手前の設計レビュー）→ /flow:tdd（優先度順実装）→ /flow:e2e
- 備考: Phase 3 実装は project scaffold（Next.js/Drizzle/Clerk 等の初期化、PLAN の Phase 3.5 app/api bootstrap）から。視覚レビューは画面実装後 /flow:design --review-only（P4.4(b)）。リリースは /flow:release（Class B、実キー + デプロイ）
<!-- AUTO-GENERATED:END scenario-cursor -->

## 6. 変更履歴

- 2026-05-27: /flow:concept で初回生成（新規 MVP 立ち上げシナリオ）
