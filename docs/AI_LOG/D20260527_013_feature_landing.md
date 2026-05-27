# AI_LOG セッション D20260527_013 — /flow:feature (landing)

**実行日時**: 2026-05-27 (+09:00)
**コマンド**: /flow:feature landing
**対象**: LP（feature、優先度 3）
**実行者**: Claude (Opus 4.7)
**状態**: 完了
**含まれる decision**: D20260527-037 (1 件)
**ファイル**: `D20260527_013_feature_landing.md`
**dispatch 元**: D20260527_002_resume_continuous（/flow:auto 反復 11）

---

## 主要決定サマリ
- feature（UI）。トップ = ヒーロー(O41 入口理解リード文) + 稼働一覧(service-status 埋込) + 価値 + コンサル CTA(→/contact、煽らない)。SSG/ISR、OGP/JSON-LD(seo)。E2E は Level1+2、Level3 は design --review-only で代替。

## 生成・更新したアーティファクト
- 新規: `docs/landing/001_SPEC + 002_PLAN + 003_UNIT_TEST + 004_E2E_TEST`

## Decisions

```yaml
- id: D20260527-037
  timestamp: 2026-05-27T15:38:00+09:00
  command: /flow:feature
  phase: Step 2-6 / LP 設計
  question: landing の UC・構成・E2E Level
  options:
    - ヒーロー+稼働一覧+価値+コンサル / E2E Level1+2
  recommended: ヒーロー+稼働一覧+価値+コンサル / E2E Level1+2
  chosen: トップ SSG/ISR、O41 リード文、service-status 埋込、CTA→/contact、E2E Level1+2（Level3 は design --review-only 代替）
  chosen_type: auto-recommended
  depends_on: [D20260527-030, D20260527-032, D20260527-024]
  context: |
    concept §1.1 #1/#3/#6 + §4.8。一般向け（O38）誠実トーン（design SoT §6）、煽らない CTA
    （charter §2.2/O31）。LCP<2.5s（SEO）。リード文確定は /flow:wording。Level3 AI Vision は
    コスト回避で MVP 不採用、Phase 3 視覚レビューで代替。
```
