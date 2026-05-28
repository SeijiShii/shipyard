# 単体テストレポート: inquiry/revise_mail-include-reply

## 実施日時
2026-05-28 19:50 (JST)

## 関連ドキュメント
- [003_REVISE_UNIT_TEST.md](./003_REVISE_UNIT_TEST.md)

## テスト実行環境
- Node.js / TypeScript / Vitest 2.1.9
- jsdom (React Testing Library)

## テスト結果

| # | テストケース | テストファイル | 結果 | 備考 |
|---|---|---|---|---|
| U-IR2 | replyNotificationEmail XSS escapeHtml (`<script>` → `&lt;script&gt;`) | lib/email/email.test.ts | ✅ | SEC-003 機械担保 |
| U-IR3 | sendReplyNotification: subject + html/text に body + link + 案内文含む | lib/email/email.test.ts | ✅ | R4 案内文「返信は受け付けていません」を text 両方で検証 |
| U-IR6 | body 改行保持 (html pre wrap + text plain \n) | lib/email/email.test.ts | ✅ | 多段落 reply の視覚保持 |
| U-2 (更新) | adminReply: notifyReply 3 引数 (to, token, body) で呼ばれる | features/admin/admin.test.tsx | ✅ | シグネチャ拡張に追従 |
| U-IR4 | adminReply: 旧 U-P1 反転 → body propagation 検証 ([論点-006] 案 c) | features/admin/admin.test.tsx | ✅ | 旧 SEC-001 防御は本 revise で「本人宛例外」として整理 |
| 既存 PII mask U-P2 | sendReplyNotification 失敗 error にメアド含まれてもマスク | lib/email/email.test.ts | ✅ | body 引数追加で TS エラー解消、既存 PII マスク機能維持 |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|---|---|---|
| (なし) | — | — | 003 計画通り U-IR2/3/4/6 + U-2 更新を実装、計画外なし |

## 削除テストケース

| # | 対象 | 削除理由 |
|---|---|---|
| 旧 U-P1 (email.test.ts) | sendReplyNotification リンクのみ・本文非含有 | [論点-006] 案 c で方針転換、本 revise で「本文含む」に反転 |
| 旧 U-P1 (admin.test.tsx) | notifyReply に本文を渡さない (SEC-001) | 同上、訪問者本人宛 mail は SEC-001 対象外と整理 |

## サマリー

| 項目 | 値 |
|---|---|
| 計画テスト数 | 5 件 (U-IR2 + U-IR3 + U-IR4 + U-IR6 + 既存 U-2 更新) |
| 追加テスト数 | 0 件 |
| 合計 | 5 件 (新規 4 + 更新 1) |
| 削除 | 2 件 (旧 U-P1 × 2) |
| 成功 | 174/174 GREEN (本回 net +2、172 → 174) |
| 失敗 | 0 件 |
| 成功率 | 100% |
| 全 PJ 累計 | **174 tests GREEN** |

## 動作確認 (Phase 3、unit test 範囲外)

1. ローカル `/contact` で問い合わせ送信 → `/admin/threads/<id>` で運用者返信送信 → seiji の Resend sandbox mail で受信
2. 受信 mail で確認:
   - subject 「返信が届きました」
   - 運用者返信本文 (改行保持)
   - 「サイトで会話の続きを見る（任意）」link
   - 「このメールへの返信は受け付けていません」案内
3. (任意) HTML mail / plain text 両方の見た目確認
