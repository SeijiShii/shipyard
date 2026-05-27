# _shared/email 仕様書（横断基盤・メール送信）

> **役割**: Resend ラッパ。問い合わせの返信通知 / 新着通知 / スレッドリンク埋め込み
> **タグ**: cross-cutting
> **最終更新**: 2026-05-27
> **入力**: `../../concept.md` §6（外部連携 Resend）/ §3.7（SEC-001 PII）, `./README.md`

---

## 1. 提供インターフェース
| 関数 | 用途 | 利用機能 |
|---|---|---|
| `sendThreadLink({to, token, isNew})` | 問い合わせ送信直後、本人にスレッド URL を送付 | inquiry |
| `sendReplyNotification({to, token})` | 運用者が返信した時、問い合わせ者に通知 | admin |
| `sendNewInquiryNotification({threadId})` | 新着問い合わせを運用者(seiji)に通知 | inquiry |

## 2. 入出力
- 共通: 送信元 = 認証済ドメイン（`MAIL_FROM`、env）。本文は HTML + text 両方。
- `sendThreadLink`: スレッド URL = `${SITE_URL}/t/${token}`。「あとで戻れます」の控えめ文言（design SoT トーン）。
- `sendReplyNotification`: 「返信が届きました」+ スレッドリンク。本文プレビューは**含めない**（PII/不要）。
- `sendNewInquiryNotification`: 運用者宛（`OPERATOR_EMAIL`）。件名 + admin リンク。**問い合わせ本文・メアドは最小限**（admin で見る前提、SEC-001）。
- 戻り値: `{id}` or 失敗。失敗は呼び出し側でログ（PII マスク）。

## 3. データモデル
なし。env: `RESEND_API_KEY` / `MAIL_FROM` / `OPERATOR_EMAIL` / `SITE_URL`。

## 4. バリデーション + エラーケース
| ID | 条件 | 振る舞い |
|---|---|---|
| MAIL-E1 | Resend API 失敗/レート超過 | リトライ（指数バックオフ 1 回）→ 失敗は呼び出し側に返す（スレッド作成自体は成功させる＝メール不達でも localStorage で復帰可、concept §5.2） |
| MAIL-E2 | 宛先不正（タイポ） | 送信試行 → bounce はベストエフォート（本人確認はしない方針、D005） |

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| PII | メール本文・ログに問い合わせ本文/メアドを残さない（リンクのみ） | §3.7 SEC-001 |
| 到達性 | SPF/DKIM 設定済ドメインから送信 | Resend ドメイン認証（PREREQUISITES §8） |
| 非同期 | 送信は best-effort、UX をブロックしない | concept §5.2（メール=通知専用） |
- 連携: inquiry（送信時）/ admin（返信時）。テンプレは design SoT トーン（誠実・控えめ）。

## 6. スコープ外
- マーケティングメール / 配信管理 UI（取引メールのみ、opt-in 不要）
- メールテンプレートの多言語

## 7. 未決事項
現時点で論点なし (2026-05-27)。

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
