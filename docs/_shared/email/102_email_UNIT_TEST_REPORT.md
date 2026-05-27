# 単体テストレポート: _shared/email

## 実施日時
2026-05-27 15:39 (JST)

## 関連ドキュメント
- [003_email_UNIT_TEST.md](./003_email_UNIT_TEST.md)

## テスト実行環境
- Vitest 2.1.9 / Node v22.11.0。Resend は injectable mock（実キー不要）。SITE_URL は env 注入。

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| U-1 | sendThreadLink: to/subject/リンク + isNew 文言差 | ✅ | /t/{token}、新規/既存で件名差 |
| U-2 | sendReplyNotification: リンクのみ、本文プレビュー非含有 | ✅ | 「返信が届きました」+ /t/{token} |
| U-3 | sendNewInquiryNotification: 宛先=OPERATOR、admin リンク | ✅ | 本文/メアド非含有 |
| U-E1 | 1 回リトライ後に成功 | ✅ | send 2 回呼ばれ ok |
| U-E1/E2 | 全失敗でも例外を投げず ok:false | ✅ | 呼び出し側を巻き込まない（best-effort、§5.2） |
| U-P2 | maskEmail がメアド平文を伏せる | ✅ | [email] 置換 |
| U-P1/P2 | 失敗 error のメアドもマスク | ✅ | error に @example.com を残さない |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| 1 | send | 全失敗で ok:false（例外なし） | best-effort 契約の明示担保（U-E2） |
| 2 | maskEmail | 直接ユニット | PII マスクロジックの単体検証 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1〜U-3, U-E1〜U-E2, U-P1〜U-P2） | 7 観点 |
| 実装テスト数 | 7 件 |
| 全体スイート合計 | 67 件 |
| 成功 / 失敗 | 67 / 0 |
| 成功率 | 100% |

## カバレッジ要点
- PII 非混入経路（U-P1 本文非含有 / U-P2 ログ・error マスク）: 100%（SEC-001 必須）。
- best-effort（リトライ + 失敗時 ok:false）: 正常・リトライ成功・全失敗の 3 経路を網羅。
- 実送信（test mode）は Release 工程（実キー必須）。
