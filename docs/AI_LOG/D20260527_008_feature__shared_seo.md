# AI_LOG セッション D20260527_008 — /flow:feature (_shared/seo)

**実行日時**: 2026-05-27 (+09:00)
**コマンド**: /flow:feature _shared/seo
**対象**: 横断基盤 SEO/OGP（cross-cutting、優先度 1 基盤）
**実行者**: Claude (Opus 4.7)
**状態**: 完了
**含まれる decision**: D20260527-032 (1 件)
**ファイル**: `D20260527_008_feature__shared_seo.md`
**dispatch 元**: D20260527_002_resume_continuous（/flow:auto 反復 6）

---

## 主要決定サマリ
- cross-cutting。metadata/JSON-LD/sitemap/robots/動的 OG。`/t/[token]` と admin/api は noindex（SEC-002 連携）。E2E スキップ。

## 生成・更新したアーティファクト
- 新規: `docs/_shared/seo/001_seo_SPEC.md` / `002_seo_PLAN.md` / `003_seo_UNIT_TEST.md`

## Decisions

```yaml
- id: D20260527-032
  timestamp: 2026-05-27T15:00:00+09:00
  command: /flow:feature
  phase: Step 2-3 / SEO 基盤設計
  question: SEO/OGP 基盤の提供インターフェース
  options:
    - metadata + JSON-LD + sitemap + robots + 動的 OG
  recommended: metadata + JSON-LD + sitemap + robots + 動的 OG
  chosen: buildMetadata / JSON-LD(Person/WebSite) / sitemap / robots / @vercel/og 動的 OG
  chosen_type: auto-recommended
  depends_on: [D20260527-031, D20260527-017]
  context: |
    concept §3 SEO/§4.8 公開周知。token URL(/t/[token]) と admin/api を noindex で
    検索非露出（SEC-002 と整合）。動的 OG は Ink & Teal。E2E スキップ。
```
