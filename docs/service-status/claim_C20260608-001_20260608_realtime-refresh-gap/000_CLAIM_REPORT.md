# クレーム調査レポート

**claim id**: C20260608-001
**実施日**: 2026-06-08
**対象機能**: service-status（+ _shared/hub-client）
**緊急度推定**: medium

## 1. クレーム原文

```
Service hub には3つのサービスが登録されているが、Shipyard には2つしか表示されていない。確認する
```

## 2. 分解結果

### 2.1 期待挙動 (Expected)
service-hub に登録された全サービス（3 件）が shipyard の稼働一覧に表示される。concept §1.1 の「リアルタイム稼働状況」価値提案からの自然な期待として、登録後タイムリーに反映されること。

### 2.2 現実挙動 (Actual)
shipyard `/api/services` は **2 件のみ**返す（`bousai-bag-checker` / `hana-memo`）。HUB に登録済みの **`naze-bako` が欠落**。キャッシュの `fetchedAt` は全行 `2026-06-07T00:24:12Z` で固定。

### 2.3 発生条件
- HUB `GET /api/public/status` は 3 件返す（実測、本調査時）: `bousai-bag-checker` / `hana-memo` / `naze-bako`。
- naze-bako は前回 cron 実行（2026-06-07 00:24 UTC）**より後**に HUB へ登録された（昨日の naze-bako billing/service-info 作業時）。
- shipyard の cron schedule = `0 0 * * *`（日次 00:00 UTC、`vercel.json`）。前回実行 2026-06-07 00:24、次回 2026-06-08 00:00 UTC。
- 調査時刻 2026-06-07 23:39 UTC → 次回 cron まで約 20 分。次回 cron で naze-bako は反映される見込み（即時症状は自然解消）。

### 2.4 影響範囲
- 該当: 全訪問者（公開トップの稼働一覧）。新規登録サービスが最大 ~24h 表示されない。
- 構造影響: up/down ステータスも最大 ~24h 鮮度遅延 → サービス障害時に「up」を最大1日表示し得る。concept の中核「本当に動いている信頼」を毀損し得る。
- データ影響: なし（キャッシュは前回値を正しく保持、code path は健全）。

### 2.5 報告経路
- 経路: 運用者（seiji）直接。
- 温度感: 冷静（事実確認）。

### 2.6 報告者文脈
運用者が「登録した naze-bako が公開一覧に出ているはず」と期待して確認したところ、欠落に気づいた。

## 3. 過去類似クレーム

| claim id | 日付 | 判定 | 関連度 |
|---|---|---|---|
| （該当なし。本 PJ 初の claim） | | | |
