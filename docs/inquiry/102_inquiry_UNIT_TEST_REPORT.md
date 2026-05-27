# 単体テストレポート: inquiry

## 実施日時
2026-05-27 16:11 (JST)

## 関連ドキュメント
- [003_inquiry_UNIT_TEST.md](./003_inquiry_UNIT_TEST.md) / [004_…_E2E_TEST.md](./004_inquiry_E2E_TEST.md)（E2E は /flow:e2e）

## テスト実行環境
- Vitest 2.1.9 + Testing Library（jsdom）。spam/db/email は injectable mock（実キー不要）。

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| U-2 | schema: 正しい email/body/subject 通過 | ✅ | |
| U-E2 | schema: 不正 email / 空 body reject | ✅ | |
| U-X2 | schema: body 上限超過 reject | ✅ | 5000 字 |
| — | reply schema: body 必須 | ✅ | |
| U-1 | createInquiry: spam pass → thread+message 作成、token 返却 | ✅ | visitor 本文保存 |
| U-E1 | createInquiry: spam reject → 400/429 | ✅ | rate_limit=429 |
| U-E1 | createInquiry: reject 時 DB 作成しない | ✅ | |
| U-E5 | createInquiry: 通知 throw でもスレッド成功（best-effort） | ✅ | |
| U-P1 | createInquiry: 通知に本文を渡さない（リンクのみ） | ✅ | SEC-001、body 非含有 |
| U-3 | addReply: 有効 token → 追加 + touchActivity | ✅ | |
| U-E3/U-E4 | addReply: 無効/詐称 token → 404（id 経路なし） | ✅ | IDOR、SEC-002 |
| U-4 | storage: saveThread 保存・重複なし | ✅ | localStorage |
| U-X1 | ThreadView: `<script>` エスケープ（プレーンテキスト） | ✅ | script/b 要素生成されず |
| — | ContactForm: honeypot(hidden) + 入力 + 送信ボタン | ✅ | 構造 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1〜U-4, U-E1〜E5, U-P1, U-X1〜X2） | 12 観点 |
| 実装テスト数 | 14 件 |
| 全体スイート合計 | 131 件 |
| 成功 / 失敗 | 131 / 0 |
| 成功率 | 100% |

## カバレッジ要点
- **IDOR**（U-E3/E4、token 検証のみ・id 経路なし）/ **XSS**（U-X1、エスケープ）/ **PII**（U-P1、本文を通知に渡さない）/ **spam**（U-E1、5 段 reject）= 100%。
- route handler 本体（getRepos/実 SDK）+ Turnstile/Resend 実結合 + フォーム送信フローは E2E（004）/ Release で確認。
