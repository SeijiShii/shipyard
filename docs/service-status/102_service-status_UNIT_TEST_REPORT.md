# 単体テストレポート: service-status

## 実施日時
2026-05-27 15:59 (JST)

## 関連ドキュメント
- [003_service-status_UNIT_TEST.md](./003_service-status_UNIT_TEST.md) / [004_…_E2E_TEST.md](./004_service-status_E2E_TEST.md)（E2E は /flow:e2e）

## テスト実行環境
- Vitest 2.1.9 + Testing Library（jsdom）。hub-client/repo は別途テスト済、ここでは component + 純ロジック。

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| U-1 | StatusList: up/down/unknown を StatusCard+リンク表示 | ✅ | href + 稼働日数 |
| U-E1 | StatusList: 0 件 → EmptyState（line-art + 文言） | ✅ | 技術詳細なし |
| U-E4 | StatusList: 不明 status → 確認中フォールバック | ✅ | |
| U-2 | uptimeDays: since→日数 | ✅ | 26 日 |
| U-B2 | uptimeDays: 今日=0 / 未来=0 クランプ / null | ✅ | |
| U-3/U-B1 | toPublicStatus: 安全サブセットのみ（内部/余剰除外） | ✅ | internalCost/lastCheckedAt 含まれず |
| U-4 | isAuthorizedCron: 正しい secret → true | ✅ | |
| U-E2 | isAuthorizedCron: 不一致/欠落/secret 未設定 → false | ✅ | |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| 1 | isAuthorizedCron | secret 未設定（env なし）→ false | 設定漏れで全拒否（安全側） |
| 2 | uptimeDays | null since → null | 欠落の防御 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1〜U-4, U-E1〜E4, U-B1〜B2） | 10 観点（うち U-E3 refresh は hub-client で被覆） |
| 実装テスト数 | 7 件（component 3 + 純ロジック 4 グループ） |
| 全体スイート合計 | 112 件 |
| 成功 / 失敗 | 112 / 0 |
| 成功率 | 100% |

## カバレッジ要点
- 安全サブセット配信（U-B1、内部指標非表示）+ Cron secret 検証（U-E2）: 100%。
- HUB ダウン時の前回値保持（U-E3）は hub-client.refreshStatusCache で被覆済。
- route handler 本体（getRepos 実 DB）+ 視覚は E2E（004）/ Release で確認。
