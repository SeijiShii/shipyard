# 単体テストレポート: _shared/auth

## 実施日時
2026-05-27 15:44 (JST)

## 関連ドキュメント
- [003_auth_UNIT_TEST.md](./003_auth_UNIT_TEST.md)

## テスト実行環境
- Vitest 2.1.9 / Node v22.11.0。Clerk は injectable mock（SessionResolver 注入、実キー不要）。OPERATOR_EMAILS は env 注入。

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| U-B1 | operatorEmails 正規化（複数/空白/大小文字/空） | ✅ | trim/小文字/空除去 |
| U-1 | isOperator allowlist 内（大小文字無視）→ true | ✅ | |
| U-E3 | isOperator 空/不正/allowlist 外 → false | ✅ | null/undefined/""/外部 |
| U-2 | requireOperator 認証済 + allowlist 内 → ok | ✅ | session 返却 |
| U-E1 | requireOperator 未認証 → 401 | ✅ | resolver=null |
| U-E2 | requireOperator allowlist 外 → 403 | ✅ | 詳細非開示 |
| — | requireOperator email なし → 403 | ✅ | 追加 |
| U-B2 | isProtectedAdminPath: admin/api/admin 保護 | ✅ | |
| U-B2 | 訪問者導線（/, /contact, /t/*, /services, /legal, /privacy, /about）非保護 | ✅ | 認証ゼロ維持（D004） |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| 1 | requireOperator | 認証済だが email なし → 403 | email 欠落の防御 |
| 2 | operatorEmails | 空 env → [] | 境界 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1,U-2, U-E1〜E3, U-B1〜B2） | 7 観点 |
| 実装テスト数 | 9 件 |
| 全体スイート合計 | 76 件 |
| 成功 / 失敗 | 76 / 0 |
| 成功率 | 100% |

## カバレッジ要点
- allowlist/認可分岐（U-1/E1/E2/E3）: 100%（SEC-002 必須）。
- 保護パス（admin 保護 / 訪問者導線 非保護）: 100%（D004 認証ゼロ維持）。
- middleware/Clerk 実フローは edge/実キーのため Release 工程で確認。
