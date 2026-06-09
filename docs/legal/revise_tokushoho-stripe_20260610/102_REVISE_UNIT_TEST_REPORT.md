# 単体テストレポート: legal（特商法表記の追加 + 業態整合）

## 実施日時
2026-06-10 06:56 (JST)

## 関連ドキュメント
- [003_REVISE_UNIT_TEST.md](./003_REVISE_UNIT_TEST.md) — 単体テスト計画

## テスト実行環境
- ランタイム: Node (jsdom)
- テストフレームワーク: Vitest 2.1.9 + @testing-library/react

## テスト結果

| # | テストケース | テストファイル | 結果 | 備考 |
|---|------------|-------------|------|------|
| U-CM1 | 特商法の法定見出し（販売事業者/代表者/所在地/お支払い方法/提供時期/キャンセル・返金） | features/legal/legal.test.tsx | ✅ | |
| U-CM2 | 事業者情報（QUADii / 四伊清司 / quadii.shii@gmail.com） | 同上 | ✅ | |
| U-CM3 | 業態文言（作者応援寄付 + 追加オプション + クラウドファンディングではありません） | 同上 | ✅ | |
| U-CM5 | 単発のみ（定期/継続課金/サブスク/解約 を含まない negative） | 同上 | ✅ | 旧 GIVErS 条項の混入防止 |
| U-CM4 | commerce metadata（title=「…— shipyard」/ description / index 可） | 同上 | ✅ | |
| U-FT1 | Footer 特商法リンク（href=/legal/commerce） | 同上 | ✅ | |
| U-FT2 | Footer に powered by givers.work | 同上 | ✅ | |
| U-FT3 | Footer 既存リンク維持（プライバシー/利用規約） | 同上 | ✅ | リグレッション |

## 追加テストケース
追加テストケースなし（計画 003 の 8 件をそのまま実装。異常系は静的ページのため対象外）。

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト数 | 8 件 |
| 追加テスト数 | 0 件 |
| 合計 | 8 件 |
| 成功 | 8 件（legal.test.tsx 13/13、全スイート 192/192） |
| 失敗 | 0 件 |
| 成功率 | 100% |
