# 単体テストレポート: admin

## 実施日時
2026-05-27 16:23 (JST)

## 関連ドキュメント
- [003_admin_UNIT_TEST.md](./003_admin_UNIT_TEST.md)

## テスト実行環境
- Vitest 2.1.9 + Testing Library（jsdom）。auth/db/email は injectable mock（Clerk/Resend 実キー不要）。

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| U-2 | adminReply: operator message + touchActivity + 返信通知 | ✅ | id 経由 |
| U-P1 | adminReply: 通知に本文を渡さない（リンクのみ） | ✅ | SEC-001 |
| U-E4 | adminReply: 存在しない thread → 404 | ✅ | message 追加せず |
| U-E5 | adminReply: 通知 throw でも成功（best-effort） | ✅ | |
| U-3 | adminClose: setStatus(closed) | ✅ | |
| — | adminClose: 不在 → 404 | ✅ | |
| U-E3 | replySchema: 空/超過 body reject | ✅ | |
| U-E1/U-E2 | 認可ゲート: requireOperator 未認証 401 / allowlist 外 403 | ✅ | route の gate（auth と共有） |
| U-1 | ThreadList: リンク + 状態タグ（対応中/完了） | ✅ | href /admin/threads/[id] |
| U-B1 | ThreadList: 0 件 EmptyState | ✅ | |
| (db) | threadRepo.findById（admin id 経路） | ✅ | repositories.test に追加 |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| 1 | adminClose | 不在 thread → 404 | close 経路の防御 |
| 2 | db threadRepo | findById（admin id 経路、不在 null） | admin の id アクセスを担保 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1〜U-3, U-E1〜E5, U-P1, U-X1, U-B1） | 11 観点（U-X1 はメッセージ表示=ThreadView で被覆済） |
| 実装テスト数 | 10 件（+ db findById 1 件） |
| 全体スイート合計 | 147 件 |
| 成功 / 失敗 | 147 / 0 |
| 成功率 | 100% |

## カバレッジ要点
- 認可（requireOperator 401/403、SEC-002）/ PII（通知に本文非含有、SEC-001）/ 404 / best-effort 通知 = 100%。
- XSS（本文プレーンテキスト）は ThreadView（inquiry で U-X1 被覆、admin も同 component 使用）。
- 実 Clerk サインイン / Resend 送信 + 視覚は Release / Phase 3 / E2E。
