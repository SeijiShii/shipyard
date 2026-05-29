# AI_LOG セッション D20260529_003 — /flow:scenario --update (§3.0c drift シューティング)

**実行日時**: 2026-05-29 09:10 (+09:00)
**コマンド**: /flow:scenario --update
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 完了
**含まれる decision**: D20260529-002 (1 件)

---

## 主要決定サマリ

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260529-002 | AUDIT-structure-001 (SCENARIO §5 stale、5連続) 撃ち落とし | §5 全面 refresh: O48 v2 retrofit「完遂」削除 (D025 revert 反映) + Phase 3 deploy 手順訂正 (HUB secret rename 無効 → 標準 env push) + smoke-prod.sh/vercel.json cron 反映 + GREEN 176→170 訂正 | auto-recommended |

## 起動経緯

- `/flow:auto` §3.0c (2) drift シューティング: D20260529_002 audit full が検出した AUDIT-structure-001 (Medium、SCENARIO §5 stale) を Class A reconcile で撃ち落とし。

## 反映内容

- **完了フェーズ**: 「O48 v2 favicon-projection retrofit 完遂」を削除し「[論点-008] O48 適用判定 = consumer のみ pull 対象外確定 → service-info producer 全 revert (D025)」へ置換。smoke-prod.sh + vercel.json cron Hobby 対応を追加。GREEN 176→170 訂正。
- **進行中ターゲット (a)**: Phase 3 deploy 手順の「HUB_SHARED_SECRET → HUB_SERVICE_INFO_SECRET rename」を削除 (両 secret とも revert 済) → 「標準 env を Vercel production へ push、consumer は HUB_STATUS_URL のみ (設定済)」へ訂正。
- **備考**: release-pre 必須監査 AUDIT_20260529_0900 PASS を記録。AUDIT-structure-001 5 連続常習化 = CF-021 hook 優先度確定。

## drift シューティング 残件 (本コマンド対象外、dispatch 記録)

- [AUDIT-issue-001] §8 resolved 4 件 (001/006/007/008) §7 未移動 (Low) → `/flow:concept` UPDATE 領域 (scenario は concept 編集禁止、根本原則#3)。Low ゆえ deploy 非 gate、次回 concept UPDATE で撃ち落とし。
- [AUDIT-issue-002] §8 [論点-001] resolved note の "service-info 公開は O48 で実装済" stale phrase (Low) → 同上 concept UPDATE へ dispatch。

## 生成・更新ファイル

- docs/SCENARIO.md (§5 cursor + §6 履歴)
- docs/AI_LOG/D20260529_003_scenario_update.md (本ファイル)
- docs/AI_LOG/INDEX.md (再生成)

## 依存関係

- 親 chain: D20260529_001 (resume) → D20260529_002 (audit full) → 本 scenario --update

## 学習・改善

- AUDIT-structure-001 が 5 連続。flow コマンド (特に revert/fix を含む inline 操作) 完了時に scenario --update を自動 dispatch する hook (CF-021) が構造的解決策。本セッションは手動 reconcile で対応。
