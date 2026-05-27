# 単体テストレポート: _shared/ui

## 実施日時
2026-05-27 15:30 (JST)

## 関連ドキュメント
- [003_ui_UNIT_TEST.md](./003_ui_UNIT_TEST.md) - 単体テスト項目（計画）

## テスト実行環境
- ランタイム: Node.js v22.11.0
- テストフレームワーク: Vitest 2.1.9 + @testing-library/react 16 + jest-dom（jsdom）
- 方針: role/text 起点（design 原則 7、class 名に過度依存しない）

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| — | status: ラベルが一般向け（O38） | ✅ | 動いています/止まっているかも/確認中 |
| U-E1 | status: 未知→unknown フォールバック | ✅ | 分岐 100%（null/undefined/不正含む） |
| — | status: daysSince（now 注入） | ✅ | 26 日 / null / 不正日付 |
| U-1 | Button: role=button + onClick | ✅ | 発火 1 回 |
| — | Button: 全 variant 描画 | ✅ | primary/secondary/ghost |
| U-B3 | Button: disabled で aria-disabled + クリック無効 | ✅ | onClick 呼ばれず |
| U-4 | Input: 入力反映 + focus ring | ✅ | value 反映、focus-visible:ring クラス |
| U-4 | Textarea: 入力反映 | ✅ | value 反映 |
| U-3 | StatusBadge: status ごとの plain ラベル | ✅ | up/down/unknown |
| U-E1 | StatusBadge: 未知→確認中 | ✅ | フォールバック |
| U-B2 | StatusBadge: ラベル単独で識別可 | ✅ | 色のみ非依存 |
| U-2 | StatusCard: name + 稼働日数 + url href | ✅ | role=link, href 一致, 稼働26日 |
| U-E2 | StatusCard: url 欠落で非リンク | ✅ | link role なし |
| U-5 | Header: ワードマーク + お問い合わせ + これは何? | ✅ | href 検証 |
| — | Footer: 法務リンク + メイカー文脈 | ✅ | privacy/terms href + 週1ペース文言 |
| — | InfoButton: モーダル開閉（O41） | ✅ | dialog 表示→閉じる |
| U-7 | EmptyState: line-art（svg role=img）+ 文言 | ✅ | role=img + メッセージ |
| U-6 | ProgressFeedback: current 連動段階文言 | ✅ | 嘘進捗でない |
| — | ProgressFeedback: 範囲外 current クランプ | ✅ | 最後にクランプ |
| — | ProgressFeedback: role=status aria-live | ✅ | polite |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| 1 | status | normalizeStatus null/undefined | フォールバック分岐網羅 |
| 2 | daysSince | 不正日付 → null | 防御 |
| 3 | ProgressFeedback | current 範囲外クランプ | 境界安全 |
| 4 | Button | 全 variant 描画 | variant 網羅 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1〜U-7, U-E1〜U-E2, U-B1〜U-B3 ベース） | 13 観点 |
| 実装テスト数（components.test.tsx） | 20 件 |
| 追加テスト数 | 4 件 |
| 全体スイート合計 | 49 件 |
| 成功 | 49 件 |
| 失敗 | 0 件 |
| 成功率 | 100% |

## カバレッジ要点（UNIT_TEST §3 目標）
- status マップ分岐（up/down/unknown/フォールバック）: 100%。
- a11y: focus ring クラス・role/aria（dialog/status/img/button）・色覚配慮（ラベル単独識別）を検証。
- 視覚回帰（Level 1 snapshot）+ 視覚レビュー（design SoT §9）は Phase 3 画面実装後に `/flow:design --review-only` で取得（本横断単体では render のみ）。
