# 単体テストレポート: _shared/hub-client

## 実施日時
2026-05-27 15:48 (JST)

## 関連ドキュメント
- [003_hub-client_UNIT_TEST.md](./003_hub-client_UNIT_TEST.md)

## テスト実行環境
- Vitest 2.1.9 / Node v22.11.0。HUB fetch / statusCacheRepo は injectable mock（実 HUB・実 DB 不要）。

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| U-1 | contract: 正しい PublicStatusResponse パース | ✅ | mock 2 件 |
| U-E3 | contract: 余剰フィールド（内部指標）strip | ✅ | cost/churn 破棄 |
| U-E4 | contract: status 不正値 reject | ✅ | enum |
| U-B1 | services 空配列は正常 | ✅ | |
| U-B2 | since/last_checked_at 欠落は optional | ✅ | |
| U-2 | fetchHubStatus: mock fetch で services 返却 | ✅ | |
| — | fetchHubStatus: 内部指標 strip して返す | ✅ | secretCost 破棄 |
| U-E1 | fetchHubStatus: HUB 5xx は例外 | ✅ | |
| — | fetchHubStatus: URL 未設定は例外 | ✅ | |
| U-3 | refreshStatusCache: 成功で upsertMany(fetched_at 付) | ✅ | now 注入 |
| U-E2 | refreshStatusCache: fetch 失敗でキャッシュ更新せず | ✅ | upsertMany 未呼出、ok:false kept |
| U-4 | getCachedStatus: listAll を返す | ✅ | |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| 1 | fetchHubStatus | client 経由でも内部指標 strip | 経路全体で安全サブセット担保 |
| 2 | fetchHubStatus | URL 未設定で例外 | 設定漏れの早期検出 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1〜U-4, U-E1〜E4, U-B1〜B2） | 10 観点 |
| 実装テスト数 | 12 件 |
| 全体スイート合計 | 88 件 |
| 成功 / 失敗 | 88 / 0 |
| 成功率 | 100% |

## カバレッジ要点
- 安全サブセット strip（U-E3、内部指標破棄）+ フォールバック（U-E1/E2、HUB ダウンで前回値保持）: 100%。
- 実 HUB 結合は [論点-001] 解決後 + Release。
