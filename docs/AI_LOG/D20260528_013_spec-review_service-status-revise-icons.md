# AI_LOG セッション D20260528_013 — /flow:spec-review (service-status/revise_service-icons_20260528_icon-from-service-hub)

**実行日時**: 2026-05-28 17:10 (+09:00)
**コマンド**: /flow:spec-review service-status/revise_service-icons_20260528_icon-from-service-hub
**実行者**: Claude (Opus 4.7) + seiji
**状態**: 完了
**含まれる decision**: D20260528-039 (1 件、12 個の指摘 + 設計判断を集約)

---

## 主要決定サマリ

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260528-039 | spec-review auto-pick で 7 件指摘 (R1〜R7) + 5 件設計判断 (D1〜D5) を確定 | 905 + 001-003 反映、Critical 1 / High 1 / Medium 4 / Low 1、追加 P 原則 0 件 (review-perspectives.md 非ロード) | auto-recommended |

## 指摘・判断詳細サマリ

| # | severity | 種別 | 内容 | 反映先 |
|---|---|---|---|---|
| R1 | Critical | 指摘 | cache.ts 明示列挙 mapping の iconUrl 行追加漏れリスク強調 | 002 §1 |
| R2 | High | 指摘 | StatusListItem/StatusCardService 型 + Props passthrough 漏れ (PLAN 表 4 行に分割) | 002 §1、001 §7.1 |
| R3 | Medium | 設計判断 | contract iconUrl `.url()` 過剰反応 → `.catch(undefined)` graceful | 001 §2.4 §7.4、003 §1.2 U-IC7/U-IC8 |
| R4 | Medium | 設計判断 | alt 属性 `alt={name}` → `alt=""` (装飾画像、WCAG 1.1.1) | 001 §7.1、002 §8 |
| R5 | Low | 指摘 | CSP 現状無設定 (grep 確認)、将来 CSP 導入時 retrofit 必要を注記 | 002 §8 |
| R6 | Medium | 指摘 | PLAN §1 表の責務記述ズレ (R1+R2 で確定した正しい責務分割で書き直し) | 002 §1 |
| R7 | Medium | 指摘 | U-IC6 (新規 test) → 既存 hub.test.ts U-3 拡張 (mockRepo パターン尊重) | 003 §1.1 / §2 |
| D1 | — | 設計判断 | [論点-007] icon フォールバック背景色 = 案 A 単一色 (`var(--color-brand-bg-soft)`、design SoT §6 ミニマル) | 001 §9 [論点-007] accepted、001 §7.1 |
| D2 | — | 設計判断 | alt 属性 = `alt=""` (装飾画像) | R4 と同 |
| D3 | — | 設計判断 | contract iconUrl graceful = `.catch(undefined)` | R3 と同 |
| D4 | — | 設計判断 | ServiceIcon 外出し vs インライン = StatusCard 内インライン (LOC 30 以下、責務集約) | 002 §2 (新規ファイル列の任意マーク削除候補) |
| D5 | — | 設計判断 | U-IC6 vs 既存 U-3 拡張 = 既存 U-3 拡張 | R7 と同 |

## 依存関係

- 親 dispatch: D20260528_010 (flow:auto loop) → D20260528_011 (audit standard) → D20260528_012 (scenario --update) → 本セッション (P3.7 Spec-review gate auto-pick)
- 直接の input: 設計 4+1 文書 (commit 62facd4 で生成、D20260528_009_revise_service-status_service-icons) + 既存実装 (commit 7e775a1 hub-client drift fix を含む)

## 生成・更新したアーティファクト

- 新規: `docs/service-status/revise_service-icons_20260528_icon-from-service-hub/905_SPEC_REVIEW.md`
- 更新: `docs/service-status/revise_service-icons_20260528_icon-from-service-hub/001_REVISE_SPEC.md` (§2.4 S-E4 + §7.1 UC-S1 + §7.4 S-E4 + §9 [論点-007] accepted、4 箇所 Edit with `<!-- spec-review R{N}: ... -->` traceback)
- 更新: `docs/service-status/revise_service-icons_20260528_icon-from-service-hub/002_REVISE_PLAN.md` (§1 表を 4→8 行に分割 + §8 a11y / CSP 注釈、2 箇所 Edit)
- 更新: `docs/service-status/revise_service-icons_20260528_icon-from-service-hub/003_REVISE_UNIT_TEST.md` (§1.1 U-IC2-IC6 + U-IC11 + §1.2 U-IC7/U-IC8 + §2 既存 U-3 拡張、3 箇所 Edit)
- 新規: 本ファイル
- 更新: `docs/AI_LOG/INDEX.md` (本セッション追加、33→34 sessions、103→104 decisions)

## 学習・改善

- **明示列挙 mapping パターン (spread 不使用)** は安全サブセット強制 + 型エビデンスとして優れるが、新フィールド追加時の漏れリスクが構造的に高い。本 PJ では `lib/hub/cache.ts` + `lib/db/repositories/statusCache.ts` 両方に採用済 = revise 時は **「明示列挙への追加必須」を PLAN 表で太字強調 + テストで機械担保 (U-3 拡張等)** を運用パターン化推奨。将来 review-perspectives.md に P 原則として追記候補。
- **「優しいパターンとして alt=name」は WCAG 1.1.1 違反**: 隣接 text が同じ意味を持つ場合、画像は装飾扱い `alt=""` が screen reader 二重読み回避で優れる。SPEC が `alt={name}` を当然と書くのは一般的だが a11y 観点では誤り。本件は review-perspectives.md 追記候補 (FW 非依存)。
- **`.url()` 検証は厳格すぎる場合 graceful catch との組み合わせを検討**: 必須でない field (optional) は `.catch(undefined)` で graceful 化し、validate 失敗で親オブジェクト全体を巻き添えにしない方針が UX 優先で適切。本件も review-perspectives.md 追記候補。

---

## Decisions

```yaml
- id: D20260528-039
  timestamp: 2026-05-28T17:10:00+09:00
  command: /flow:spec-review
  phase: Step 4 / auto-pick で 7 指摘 + 5 設計判断を確定 → Step 5 で 905 + 001-003 反映
  question: service-icons revise 設計 4+1 文書の影響範囲・既存パターン整合・責務逸脱・既存実装再利用・設計判断漏れのレビュー
  options: []
  recommended: auto-pick で 12 件を Critical 1 / High 1 / Medium 4 / Low 1 / 設計判断 5 として確定
  chosen: 同上 (R1〜R7 + D1〜D5)
  chosen_type: auto-recommended
  depends_on: [D20260528-027, D20260528-036, D20260528-037, D20260528-038]
  context: |
    親 dispatch chain: flow:auto (D20260528_010) → audit (D20260528_011) → scenario --update
    (D20260528_012) → 本 (D20260528_013, P3.7 Spec-review gate)。

    コードベース調査 (Step 1):
    - contract.ts (commit 7e775a1): Zod union + transform、未知キー strip、url field は `.url()` 未使用
    - cache.ts (現在): 明示列挙 object literal mapping (spread 不使用、安全サブセット強制) = 新フィールド漏れリスク
    - statusCache.ts: 明示列挙 values mapping + onConflictDoUpdate set 句も明示列挙、$inferSelect で listAll 自動継承
    - StatusCard.tsx: design SoT §5 単一行 UI 集約パターン
    - StatusList.tsx: items map shell only
    - app/page.tsx / app/services/page.tsx: getCachedStatus → StatusList passthrough
    - _shared/ui: Avatar/Icon/FallbackImage 無 (再利用候補なし)
    - CSP: grep 確認で next.config / middleware に未設定

    指摘 7 件:
    R1 (Critical): cache.ts 明示列挙 mapping の iconUrl 行追加漏れリスク → PLAN 表強調 + U-3 拡張で機械担保
    R2 (High):    StatusListItem/StatusCardService 型 + Props passthrough 漏れ → PLAN 表 4 行に分割
    R3 (Medium): contract iconUrl `.url()` 過剰反応 → `.catch(undefined)` graceful
    R4 (Medium): alt 属性 `alt={name}` → `alt=""` (装飾画像 WCAG 1.1.1)
    R5 (Low):    CSP 現状無設定、将来 retrofit 必要を注記
    R6 (Medium): PLAN §1 責務記述ズレ → R1+R2 で確定した責務分割で書き直し
    R7 (Medium): U-IC6 → 既存 hub.test.ts U-3 拡張 (mockRepo パターン尊重)

    設計判断 5 件 (auto-recommended):
    D1: [論点-007] フォールバック背景色 = 案 A 単一色 (`--color-brand-bg-soft`、design SoT §6 ミニマル)
    D2: alt = `alt=""` 装飾画像
    D3: contract iconUrl = `.catch(undefined)` graceful
    D4: ServiceIcon 外出し vs インライン = インライン (LOC 30 以下)
    D5: U-IC6 vs U-3 拡張 = U-3 拡張 (重複回避)

    反映: 001 §2.4/§7.1/§7.4/§9 (4 箇所)、002 §1/§8 (2 箇所)、003 §1.1/§1.2/§2 (3 箇所)、計 9 箇所 Edit with
    `<!-- spec-review R{N}: ... -->` traceback。

    review-perspectives.md は時間制約により非ロード (本回限定)、追加 P 原則 0 件。
    ただし学習候補として 3 件抽出済 (明示列挙 mapping 追加漏れ / WCAG 1.1.1 装飾画像 alt / Zod optional に
    `.catch` graceful 組み合わせ) — 次回 spec-review 時または手動補強で review-perspectives.md 追記推奨。

    次の推奨: service-hub PJ で連動 revise 起動 (CF-016 (F) producer 側 contract 改訂) → 完了後に
    `/flow:tdd revise_service-icons_*` で Phase 1 + Phase 2 実装。
```
