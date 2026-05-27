# inquiry 機能仕様書

> **役割**: 問い合わせスレッド（送信フォーム / 不可視スパム対策 / スレッド表示 / 訪問者の追記 / 返信通知）。メアド必須・トークン URL アクセス。
> **タグ**: feature, stateful, auth-required（IDOR token）
> **最終更新**: 2026-05-27
> **入力**: `../concept.md` §1.1 UC4/5 / §3.7 SEC-001/002/003 / §5.1/5.2, `../_shared/{db,spam,email,ui}/001_*`, `./README.md`

---

## 1. 詳細 UC

### UC-I1: 問い合わせを送信しスレッドが立つ（concept §1.1 #4、D003/D004/D005）
- **トリガー**: `/contact` でメアド + 本文（+ 任意件名）入力 → 送信
- **前提**: 認証なし。フォームに honeypot（隠し）+ formRenderedAt（描画時刻）+ Turnstile widget。
- **処理**:
  1. `verifySubmission`（_shared/spam、5 段）→ pass
  2. `inquirerRepo.upsertByEmail` + `threadRepo.create`（`generateThreadToken`）+ `messageRepo.add(visitor, body)`
  3. レスポンスで thread URL（`/t/{token}`）を返す → 画面表示 + localStorage 保存
  4. `email.sendThreadLink`（本人）+ `email.sendNewInquiryNotification`（運用者）（best-effort）
- **出力**: 「送信しました。このページから続けられます」+ スレッド表示（ProgressFeedback の段階文言中、O45）
- **例外**: spam reject → 汎用文言（「送信できませんでした。時間をおいて」、理由非開示）

### UC-I2: スレッドに戻って会話を続ける（concept §1.1 #5）
- **トリガー**: `/t/{token}` を開く（メールのリンク or localStorage）
- **前提**: token のみ（認証なし）。**サーバー側で token 一致を検証（IDOR 防止、SEC-002）**
- **処理**: `threadRepo.findByToken` → メッセージ一覧表示 → 追記（`messageRepo.add(visitor)` + `touchActivity`）
- **出力**: 会話表示 + 追記フォーム。本文は**プレーンテキスト表示**（XSS 防止、SEC-003）
- **例外**: 無効 token → 404（「見つかりません」、列挙耐性）

## 2. 入出力
### 2.1 API
| メソッド | パス | 入力 | 出力 | 認証 |
|---|---|---|---|---|
| POST | `/api/inquiry` | `{email, body, subject?, honeypot, formRenderedAt, turnstileToken}` | `{token}` or 汎用エラー | 公開（spam スタック） |
| GET | `/t/[token]`（page） | token（path） | スレッド表示（token 検証後） | token のみ |
| POST | `/api/inquiry/[token]/reply` | `{body, turnstileToken?}` | 追記結果 | token 検証（IDOR） |

### 2.2 バリデーション（Zod、SEC-003）
- `email`: RFC 形式 + 正規化
- `body`: 1〜N 文字（上限）、trim
- `subject?`: 任意、長さ上限
- 全 API 入力は Zod スキーマで検証

### 2.3 副作用
- DB: inquirer/thread/message 作成・追記、rate_limit 更新（spam）
- メール: sendThreadLink / sendNewInquiryNotification / （reply は運用者向けではなく訪問者←admin 側）

## 3. データモデル
新規なし。_shared/db の inquirers/threads/messages/rate_limits を利用。token は generateThreadToken（spam）。

## 4. バリデーション + エラーケース
| ID | 条件 | HTTP | ユーザー表示 | ログ |
|---|---|---|---|---|
| I-E1 | spam reject（5 段いずれか） | 400/429 | 汎用「送信できませんでした」（理由非開示） | 内部理由のみ（PII マスク） |
| I-E2 | Zod 検証失敗 | 400 | 該当項目の平易なエラー | — |
| I-E3 | 無効/不在 token | 404 | 「見つかりません」 | 列挙試行を rate limit |
| I-E4 | email 送信失敗 | — | スレッドは表示（best-effort、§5.2） | 送信失敗ログ（メアドマスク） |
| I-E5 | 本文に HTML/スクリプト | — | プレーンテキストとして表示（エスケープ、SEC-003） | — |

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| IDOR 防止 | thread/message は token 検証経由のみ、連番 id 非露出（SEC-002） | High |
| XSS 防止 | 本文はプレーンテキスト表示、`dangerouslySetInnerHTML` 禁止（SEC-003） | High |
| PII | 本文/メアドをログ・メール本文・Analytics に出さない（SEC-001） | Critical/法令 |
| スパム | 不可視スタック（spam）、検証リンク往復なし（D005） | O27 |
| 進捗体験 | 送信時 ProgressFeedback の段階文言（O45）、嘘進捗なし | design SoT |
- 連携: _shared/spam（verify + token）/ _shared/db（thread/message）/ _shared/email（通知）/ _shared/ui（Input/ProgressFeedback/Button）/ admin（運用者返信）/ landing（CTA 遷移元）

## 6. タグ別追加

### 6.1 stateful（thread.status）
- open（やり取り中）→ closed（運用者が完了、admin 側）。訪問者は open の間追記可。

### 6.2 auth-required（IDOR、SEC-002）
- 全 thread/message アクセスは token 一致をサーバー側検証。token は推測不能（128-bit）。

## 7. スコープ外
- 添付ファイル（MVP 外）
- 訪問者アカウント（メアド + token のみ）
- thread 再オープン（closed 後）

## 8. 未決事項
現時点で論点なし (2026-05-27)。
> 関連: spam SPEC §7 [論点-005]（Turnstile 障害時フェイル方針）が本機能の送信 UX に影響。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
