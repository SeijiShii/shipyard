# 単体テストレポート: _shared/spam

## 実施日時
2026-05-27 15:53 (JST)

## 関連ドキュメント
- [003_spam_UNIT_TEST.md](./003_spam_UNIT_TEST.md)

## テスト実行環境
- Vitest 2.1.9 / Node v22.11.0。Turnstile/MX/rateLimitRepo は injectable mock（実依存なし）。時刻は固定注入。

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| U-2/U-B1 | generateThreadToken: base64url/≥22/ユニーク | ✅ | 単一生成元（R1） |
| — | emailDomain 抽出（小文字化） | ✅ | |
| U-E5 素材 | isDisposable 判定 | ✅ | mailinator/通常 |
| U-P1 | rateLimitKey が ip/email を平文で含まない | ✅ | sha256 hash:hash |
| — | windowStart 量子化 | ✅ | 10 分窓 |
| U-3 | checkRateLimit 上限内 ok / 超過 ok:false | ✅ | |
| U-1 | verifySubmission 全段 pass → ok:true | ✅ | |
| U-E1 | honeypot 非空 → reject | ✅ | |
| U-E2 | timing trap（<2s）→ reject | ✅ | |
| U-E3 | rate limit 超過 → reject | ✅ | |
| U-E4 | turnstile fail → reject | ✅ | |
| U-E5 | 使い捨てドメイン → reject | ✅ | |
| U-E6 | MX なし → reject | ✅ | |
| U-E7 | Turnstile API 障害 → fail-closed reject | ✅ | 論点-005 案A 既定 |
| — | failClosed=false なら障害でも通過 | ✅ | 設定切替の可逆性 |
| SPAM-E2 | MX resolver throw → pass 寄り | ✅ | |
| U-P2 | GENERIC_REJECT_MESSAGE が内部理由を含まない | ✅ | 汎用文言 |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| 1 | verify | failClosed=false で API 障害通過 | 論点-005 設定の可逆性担保 |
| 2 | verify | MX resolver throw → pass | SPAM-E2（MX timeout は主防御に委ねる） |
| 3 | rate-limit | windowStart 量子化 | 固定窓ロジック検証 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1〜U-3, U-E1〜E7, U-P1〜P2, U-B1） | 13 観点 |
| 実装テスト数 | 17 件 |
| 全体スイート合計 | 105 件 |
| 成功 / 失敗 | 105 / 0 |
| 成功率 | 100% |

## カバレッジ要点
- 5 段防御分岐（honeypot/timing/rate/turnstile/email）+ PII ハッシュ（U-P1）: 100%。
- 論点-005（Turnstile 障害 fail-closed）: 既定 reject + 設定切替の両経路をテスト。
- 実 Turnstile（test キー）結合は Release。
