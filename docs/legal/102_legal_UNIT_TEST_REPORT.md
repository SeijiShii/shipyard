# 単体テストレポート: legal

## 実施日時
2026-05-27 16:17 (JST)

## 関連ドキュメント
- [003_legal_UNIT_TEST.md](./003_legal_UNIT_TEST.md)

## テスト実行環境
- Vitest 2.1.9 + Testing Library（jsdom）。静的コンテンツの render + 内容整合 assert。

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| U-1 | privacy: 必須見出し（取得項目/利用目的/保管/開示請求/cookieless） | ✅ | |
| U-C1 | privacy: 外部 AI 送信なし + cookieless が §6 と一致 | ✅ | |
| U-C2 | privacy: 取得項目=メール+本文のみ（過剰項目なし） | ✅ | 「これら以外は取得しない」明記 |
| U-2 | terms: 必須見出し（禁止行為/免責/準拠法） | ✅ | |
| U-3 | metadata: 両ページ title/description + index 可（noindex でない） | ✅ | |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1〜U-3, U-C1〜C2, U-B1） | 6 観点（U-B1 Footer リンクは components.test で被覆・/legal/* に reconcile） |
| 実装テスト数 | 5 件 |
| 全体スイート合計 | 136 件 |
| 成功 / 失敗 | 136 / 0 |
| 成功率 | 100% |

## カバレッジ要点
- 内容整合（U-C1 cookieless/外部AI送信なし、U-C2 取得項目メール+本文のみ）: §6/SEC-001 と矛盾しないことを検証。
- index 可（U-3、公開ページ）。Footer 導線（U-B1）は components.test（/legal/* reconcile 済）で被覆。
- **法務文面は公開前に最終確認**（SPEC §8）。視覚は Phase 3 / 表示確認。
