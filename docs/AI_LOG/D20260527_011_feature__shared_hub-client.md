# AI_LOG セッション D20260527_011 — /flow:feature (_shared/hub-client)

**実行日時**: 2026-05-27 (+09:00)
**コマンド**: /flow:feature _shared/hub-client
**対象**: 横断基盤 HUB status クライアント（cross-cutting、優先度 2）
**実行者**: Claude (Opus 4.7)
**状態**: 完了
**含まれる decision**: D20260527-035 (1 件)
**ファイル**: `D20260527_011_feature__shared_hub-client.md`
**dispatch 元**: D20260527_002_resume_continuous（/flow:auto 反復 9）

---

## 主要決定サマリ
- cross-cutting。HUB 公開 status を Zod 安全サブセット strip で受信（内部指標誤受信防止）→ Neon cache。HUB ダウン時キャッシュ保持（graceful）。[論点-001] contract を §2 に提案、未実装中は mock。E2E スキップ。

## 生成・更新したアーティファクト
- 新規: `docs/_shared/hub-client/001_hub-client_SPEC.md` / `002_..._PLAN.md` / `003_..._UNIT_TEST.md`

## Decisions

```yaml
- id: D20260527-035
  timestamp: 2026-05-27T15:20:00+09:00
  command: /flow:feature
  phase: Step 2-3 / HUB クライアント設計
  question: HUB status クライアント + キャッシュの提供インターフェースと contract
  options:
    - Zod 安全サブセット + cache + fallback + mock
  recommended: Zod 安全サブセット + cache + fallback + mock
  chosen: contract型/fetchHubStatus/refreshStatusCache/getCachedStatus、余剰strip、ダウン時cache保持
  chosen_type: auto-recommended
  depends_on: [D20260527-010-? , D20260527-027]
  context: |
    concept §6 / §5.2 / §8 [論点-001]。安全サブセット(slug/name/url/status/since/
    last_checked_at)を Zod strip で受信、内部指標(cost/churn)が来ても破棄(§1.2 除外厳守)。
    HUB ダウン時は service_status_cache の前回値で graceful。HUB 未実装中は mock で開発。
```
