# inquiry E2E テスト計画 (mail-include-reply)

> **入力**: [`./001_REVISE_SPEC.md`](./001_REVISE_SPEC.md), [`../../concept.md`](../../concept.md) §1.1 UC#5 + UC#4, 既存 [`../004_inquiry_E2E_TEST.md`](../004_inquiry_E2E_TEST.md)
> **最終更新**: 2026-05-28
> **前提**: Playwright scaffold = [論点-005] open、本書の E2E 実行は [論点-005] reconcile 後 (本 revise tdd 完了後の release 内 or 別 session で実行)

---

## 1. 変更 UC シナリオ

### UC#5 (改修版): 訪問者がメールで運用者返信を読む

| シナリオ ID | 前提 | 操作ステップ | 期待結果 |
|---|---|---|---|
| **E-IR1** | dev server 起動済 + Resend sandbox + admin Clerk dev sign-in 済 | (1) 訪問者として `/contact` で問い合わせ送信 (`email=test@example.com`, `body=テストです`) (2) 訪問者の inbox (test@example.com or Resend sandbox UI) で受信通知 mail 確認 (3) admin として `/admin/threads/<id>` を開く (4) 返信本文 `body="ありがとうございます\n来週ミーティングいかがでしょうか" を入力して送信 (5) 訪問者の inbox で reply notification mail 確認 | (5) で受信 mail に **運用者返信本文 (改行保持)** + 「サイトで会話の続きを見る (任意)」link + 「このメールへの返信は受け付けていません。続きはサイトの返信フォームから」案内が含まれる |
| **E-IR2** | E-IR1 完了状態 | (6) 訪問者がメール内 optional link をクリック → `/t/<token>` で thread UI 表示 | thread UI で運用者返信が表示される (既存 UC#5 互換、サイト復帰は optional) |
| **E-IR3** | E-IR1 完了状態 (訪問者の mail 確認なし scenario) | 訪問者は mail を読むだけでサイトに戻らない | mail 本文だけで運用者返信内容を理解できる ([論点-006] 前提変更受け入れ確認) |

## 2. リグレッションシナリオ (既存 UC、重要度高)

| UC | シナリオ ID | 確認観点 |
|---|---|---|
| 既存 UC#1〜UC#4 (inquiry 送信 + email 通知 + thread link + admin reply) | E-001〜E-004 (`../004_inquiry_E2E_TEST.md`) | 既存挙動維持 — admin reply 送信時の 200 response + adminReply service 内の message(operator) 追加 + thread touchActivity (mail 本文変更は外部効果のみ) |
| UC#5 既存リンクのみ test | E-005 (既存) | **修正** — リンクのみ assertion を「本文 + リンク両方含む」assertion に更新 (003 §2 U-2 / U-P1 と同等) |

## 3. 移行検証シナリオ

| シナリオ ID | 移行前データ | 移行後期待状態 |
|---|---|---|
| (なし) | DB schema 変更なし、既存スレッド・メッセージはそのまま、過去 mail 送信履歴は変化なし | — |

## 4. 環境要件差分

| 項目 | 前回 | 今回 | 理由 |
|---|---|---|---|
| Resend sandbox | 既存 (`RESEND_API_KEY` dev key + onboarding@resend.dev 経由配信) | **変更なし** | 本 revise は API 変更なし |
| 訪問者 inbox | seiji.shii@gmail.com or Resend sandbox UI で受信確認 | **変更なし** | E2E 確認方法同 |
| Playwright scaffold | 未配線 ([論点-005] open) | (本 revise tdd 後の release 内 or [論点-005] reconcile 後に実行) | E2E 実行は scaffold 完了後 |

## 5. 期待 KPI

| 指標 | 目標 |
|---|---|
| 受信 mail 内に運用者返信本文 | 100% 含む (E-IR1 で確認) |
| 改行保持 | 100% (`<pre>` ラップ or text plain) |
| optional link 機能 | 既存維持 (E-IR2) |
| 「サイトで返信してください」案内 | 100% 含む (E-IR1) |

## 6. 更新履歴

| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 — UC#5 改修 + リグレッション + Playwright scaffold 待ち | /flow:revise |
