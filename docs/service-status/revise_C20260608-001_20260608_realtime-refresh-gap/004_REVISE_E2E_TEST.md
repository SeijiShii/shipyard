# service-status E2E テスト計画（リアルタイム鮮度: read-through refresh）

> **入力**: `./001_REVISE_SPEC.md`, `../../concept.md` §1.1 UC, 既存 `../../004_service-status_E2E_TEST.md`
> **最終更新**: 2026-06-08

---

## 1. 変更 UC シナリオ

### UC-S5'（read-through 最新化）
| シナリオ ID | 前提 | 操作ステップ | 期待結果 |
|---|---|---|---|
| E-RT-1 | HUB に 3 サービス、shipyard cache は古い（2 件、fetchedAt > 1h 前） | トップ or `/api/services` にアクセス | レスポンスが 3 件に更新（naze-bako 出現）、fetchedAt が更新される |
| E-RT-2 | cache が fresh（< 1h） | 連続アクセス | HUB を叩かず即応答（fetchedAt 不変、低レイテンシ） |
| E-RT-3 | HUB ダウン中 & cache stale | アクセス | 例外を出さず前回値（2 件）を表示、技術詳細を出さない（graceful） |

### UC-S1（最終同期日時表示）
| シナリオ ID | 前提 | 操作ステップ | 期待結果 |
|---|---|---|---|
| E-SA-1 | 稼働一覧 1 件以上 | トップ表示 | 一覧に「{日時}現在」が表示される（例「2026年6月8日 8:30 現在」） |
| E-SA-2 | 稼働一覧 0 件（取得不可） | トップ表示 | EmptyState 表示、最終同期日時は非表示 |

## 2. リグレッションシナリオ（既存 UC、重要度高）

| UC | シナリオ ID | 確認観点 |
|---|---|---|
| UC-S1 表示 | E-REG-1 | 稼働一覧が従来通りカード表示（StatusList 不変部分） |
| UC-S2 リンク | E-REG-2 | 各サービスカードから実サービスへ遷移 |
| 安全サブセット | E-REG-3 | レスポンスに内部指標（cost/churn 等）が含まれない |
| cron | E-REG-4 | `/api/cron/refresh-status` が CRON_SECRET 無しで 401（backstop 経路維持） |

## 3. 移行検証シナリオ

| シナリオ ID | 移行前データ | 移行後期待状態 |
|---|---|---|
| （DB マイグレーション無しのため該当なし） | | |

## 4. 環境要件差分

| 項目 | 前回 | 今回 | 理由 |
|---|---|---|---|
| env | HUB_STATUS_URL, CRON_SECRET | + `STATUS_REFRESH_TTL_SEC`（任意、既定 3600） | read-through TTL 調整 |

## 5. 期待 KPI

| 指標 | 目標 |
|---|---|
| 新規 HUB サービスの shipyard 反映時間 | ≤ TTL（1h）+ 訪問トラフィック |
| 既存リグレッション | 全 GREEN |

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-08 | 初版作成 | /flow:revise |
