# _shared/email 実装計画書

> **入力**: `./001_email_SPEC.md`, `../../concept.md` §6
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | LOC |
|---|---|---|
| `lib/email/client.ts` | Resend クライアント初期化（env） | 20 |
| `lib/email/send.ts` | sendThreadLink / sendReplyNotification / sendNewInquiryNotification | 90 |
| `lib/email/templates/threadLink.tsx` | スレッドリンクメール（HTML+text） | 40 |
| `lib/email/templates/replyNotification.tsx` | 返信通知 | 30 |
| `lib/email/templates/newInquiry.tsx` | 運用者宛新着通知 | 30 |

## 2. 実装 Phase 分割
- **Phase 1**: client + send（interface、Resend mock でテスト通過 — O35 injectable）
- **Phase 2**: テンプレ 3 種（HTML + text、design SoT トーン）
- **最終**: 実 Resend キーで dev 送信確認（test mode、宛先=自分）→ Release/Phase3

## 3. 依存関係順序
```
client → send（テンプレ注入）→ templates
```

## 4. 既存ファイルへの影響
なし。inquiry/admin から `send.ts` を呼ぶ。

## 5. リスク・注意点
- メール失敗でスレッド作成を巻き込まない（best-effort、concept §5.2）。
- 本文に PII を載せない（リンクのみ、SEC-001）。
- Resend は injectable interface にして mock テスト（実キー不要で CI green）。

## 6. 完了の定義
- [ ] send 3 関数 + テンプレ 3 種
- [ ] mock で unit green（実キー不要）
- [ ] PII 非混入（本文/ログ）を test で担保

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
