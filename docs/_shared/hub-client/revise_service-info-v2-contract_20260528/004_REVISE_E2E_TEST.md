# _shared/hub-client E2E テスト計画 (O48 service-info v2 retrofit)

> **入力**: `./001_REVISE_SPEC.md`, `../../concept.md` §6, 既存 E2E 計画 (`../004_hub-client_E2E_TEST.md` 不在 = `_shared/*` は E2E:N/A 慣行)
> **最終更新**: 2026-05-28

---

## 1. 変更 UC シナリオ

### UC-SI-1: service-hub からの service-info pull (v2)

| シナリオ ID | 前提 | 操作ステップ | 期待結果 |
|---|---|---|---|
| **E-SI-1** (production 実機、Release Phase 3 直後の 1 回確認) | shipyard prod デプロイ済 (env `HUB_SERVICE_INFO_SECRET` + `SITE_URL` 設定済)、app/icon.svg 配線済 | (1) `curl -H "Authorization: Bearer <HUB_SERVICE_INFO_SECRET>" https://shipyard.<domain>/api/hub/service-info` を実行 | 200 + JSON `{ schemaVersion: 2, service: "shipyard", status: "up", generatedAt: <ISO>, version?: ..., iconUrl: "https://shipyard.<domain>/icon.svg" }` を受信 |
| **E-SI-2** (production 実機、auth fail 確認) | 同上 | (2) Bearer 値を誤った値で同 endpoint を叩く | 401 + `{ error: "unauthorized" }` |

> **本 E2E は production 実機 1 回確認のみ** (Release Phase 3 デプロイ後、Release gate Phase 2 動作確認の一部として実施)。Playwright bootstrap ([論点-005]) 待ちのため自動 E2E framework での実行は対象外、curl 手動確認で代替 (本セッション後の release flow で seiji が実施)。

## 2. リグレッションシナリオ (既存 UC、重要度高)

| UC | シナリオ ID | 確認観点 |
|---|---|---|
| UC-HC-1 (hub-client consumer 側、`_shared/hub-client/004_hub-client_E2E_TEST.md` がもしあれば) | (本 revise は producer 側のため consumer 側回帰は無関係) | — |
| UC-Service-Status (`/services` page) | E-SS-* (既存) | service-status の `/api/services` キャッシュ配信は本 revise の影響なし (consumer side 別系統)、回帰不要 |

## 3. 移行検証シナリオ (マイグレーションある時)

| シナリオ ID | 移行前データ | 移行後期待状態 |
|---|---|---|
| (該当なし、DB マイグレーションなし) | — | — |

## 4. 環境要件差分

| 項目 | 前回 (v1) | 今回 (v2) | 理由 |
|---|---|---|---|
| env `HUB_SHARED_SECRET` | 必須 | **削除** | rename |
| env `HUB_SERVICE_INFO_SECRET` | (存在しない) | **必須** | rename 後の正式名、値は旧と同値で可 |
| env `SITE_URL` | 必須 (既存) | 必須 (既存維持、iconUrl 生成に使用) | 既存 |
| `app/icon.svg` | 配線済 (O56 D014) | 配線済 (既存維持) | 既存 |

## 5. 期待 KPI

| 指標 | 目標 |
|---|---|
| service-info response time | < 100 ms (純ロジック、Next.js serverless cold start 除く) |
| HUB → shipyard pull 成功率 | 100% (auth + payload 両方) |
| HUB dashboard のアイコン表示 | favicon が表示される (v2 受信確認、HUB 側目視) |

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 (AUDIT-perspective-001 撃ち落とし、auto-pick) | /flow:revise |
