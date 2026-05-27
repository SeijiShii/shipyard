# AI_LOG セッション D20260527_018 — /flow:spec-review (product-wide)

**実行日時**: 2026-05-27 (+09:00)
**コマンド**: /flow:spec-review（プロダクト全体）
**対象**: 全 12 ターゲット設計の整合性レビュー
**実行者**: Claude (Opus 4.7)
**状態**: 完了
**含まれる decision**: D20260527-043 〜 D20260527-046 (4 件)
**ファイル**: `D20260527_018_spec-review_product.md`
**dispatch 元**: D20260527_002_resume_continuous（/flow:auto 反復 16、P3.7 gate）

---

## 主要決定サマリ
- グリーンフィールド（コードゼロ）→ 設計間整合に焦点。指摘 High2/Medium1/Info1。
- R1: token 生成責務を spam に一本化（db は UNIQUE+リトライ）。R2: tdd Phase 0 scaffold を明示。R3: rate_limits cleanup 方針。R4: HUB contract は mock 進行（[論点-001]）。
- SEC-001/002/003 の各機能反映は整合（OK）。

## 生成・更新したアーティファクト
- 新規: `docs/SPEC_REVIEW_20260527.md`
- 更新: `_shared/db/001 §5.2`（R1）/ `_shared/spam/001 §1,§2`（R1,R3）/ `SCENARIO §3`（R2 Phase 0）

## Decisions

```yaml
- id: D20260527-043
  timestamp: 2026-05-27T16:25:00+09:00
  command: /flow:spec-review
  phase: R1 / token 生成責務
  question: thread token 生成を db と spam どちらの責務にするか
  options: [spam 一本化 + db UNIQUE/リトライ (recommended), db 内生成, 両方]
  recommended: spam 一本化 + db UNIQUE/リトライ
  chosen: spam.generateThreadToken に一本化、threadRepo.create が呼ぶ、UNIQUE 衝突は repo リトライ
  chosen_type: auto-recommended
  depends_on: [D20260527-027, D20260527-036]
  context: High。生成二重定義の曖昧さ解消。128-bit=spam 保証、一意性=db 制約の二重防御。

- id: D20260527-044
  timestamp: 2026-05-27T16:26:00+09:00
  command: /flow:spec-review
  phase: R2 / scaffold 帰属
  question: project scaffold/bootstrap はどの target に帰属するか
  options: [tdd Phase 0 として先頭 (recommended), 各 feature が分担]
  recommended: tdd Phase 0 として先頭
  chosen: tdd 連続実装の最初に Phase 0 scaffold（Next.js/Drizzle/shadcn/env/scripts/CI/middleware）
  chosen_type: auto-recommended
  depends_on: [D20260527-041]
  context: High。どの feature/横断にも属さない横断初期化。_shared/db 着手前に必要。Class A。

- id: D20260527-045
  timestamp: 2026-05-27T16:27:00+09:00
  command: /flow:spec-review
  phase: R3 / rate_limits cleanup
  question: rate_limits 古い窓の無限蓄積対策
  options: [窓計算無視 + cron cleanup (recommended)]
  recommended: 窓計算無視 + cron cleanup
  chosen: 読み取り時 window_start 判定で無視 + cron で N 日より古い行削除
  chosen_type: auto-recommended
  depends_on: [D20260527-036, D20260527-038]
  context: Medium。Neon 無料枠ストレージ保護。service-status cron 相乗り可。

- id: D20260527-046
  timestamp: 2026-05-27T16:28:00+09:00
  command: /flow:spec-review
  phase: R4 / HUB contract
  question: HUB contract 未確定の扱い
  options: [mock 進行（[論点-001] 追跡）(recommended)]
  recommended: mock 進行
  chosen: 現状維持（mock contract で開発、HUB 確定後に再確認）
  chosen_type: auto-recommended
  depends_on: [D20260527-010, D20260527-035]
  context: Info。新規対応不要、[論点-001] で追跡済。
```
