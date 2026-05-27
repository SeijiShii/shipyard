# admin 機能仕様書

> **役割**: 運用者(seiji)コンソール。問い合わせスレッド一覧 / 詳細 / 返信 / クローズ（Clerk gate）。
> **タグ**: feature, auth-required, stateful
> **最終更新**: 2026-05-27
> **入力**: `../concept.md` §1.1 UC5 / §3.7 SEC-001/002, `../_shared/{auth,db,email,ui}/001_*`, `./README.md`

---

## 1. 詳細 UC

### UC-A1: 問い合わせ一覧を見る（concept §1.1 #5）
- **トリガー**: 運用者が `/admin` にアクセス
- **前提**: Clerk 認証 + allowlist（requireOperator、SEC-002）
- **処理**: `threadRepo.listRecent`（last_activity_at 降順）→ 一覧（件名 / 状態 / 最終更新 / 未読目印）
- **出力**: スレッド一覧。0 件は EmptyState

### UC-A2: スレッドに返信する（concept §1.1 #5）
- **処理**: スレッド詳細（id 経由、admin は認証済）→ メッセージ一覧（プレーンテキスト）→ 返信入力 → `messageRepo.add(operator)` + `touchActivity` + `email.sendReplyNotification`（問い合わせ者へ）
- **出力**: 会話に運用者メッセージ追加、問い合わせ者にメール通知

### UC-A3: スレッドをクローズ（stateful）
- **処理**: `threadRepo.setStatus(id, 'closed')`。closed 後は訪問者の追記不可（inquiry 側）。

## 2. 入出力
### 2.1 ルート / API
| メソッド | パス | 入力 | 出力 | 認証 |
|---|---|---|---|---|
| GET | `/admin`（page） | — | スレッド一覧 | Clerk + allowlist |
| GET | `/admin/threads/[id]`（page） | id | スレッド詳細 | Clerk + allowlist |
| POST | `/api/admin/threads/[id]/reply` | `{body}` | 追加結果 | requireOperator |
| POST | `/api/admin/threads/[id]/close` | — | status=closed | requireOperator |

### 2.2 副作用
- DB: message 追加（operator）、thread status/activity 更新
- メール: sendReplyNotification（問い合わせ者へ、best-effort）

## 3. データモデル
新規なし。threads/messages（_shared/db）を id 経由で操作（admin は認証済のため id 可、訪問者は token のみ）。

## 4. バリデーション + エラーケース
| ID | 条件 | HTTP | 振る舞い |
|---|---|---|---|
| A-E1 | 未認証 | — | Clerk サインインへ |
| A-E2 | 認証済 allowlist 外 | 403 | 「権限がありません」（詳細非開示） |
| A-E3 | reply body 空/超過 | 400 | Zod エラー |
| A-E4 | 存在しない thread id | 404 | 「見つかりません」 |
| A-E5 | email 送信失敗 | — | message 追加は成功（best-effort） |

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| RBAC | Clerk + allowlist 二重（SEC-002） | High |
| PII | 一覧/詳細は admin のみ閲覧、ログに本文/メアドを残さない（SEC-001） | Critical |
| 返信本文 | Zod 検証、表示はプレーンテキスト（XSS、自分の入力でも一貫） | SEC-003 |
- 連携: _shared/auth（requireOperator）/ _shared/db（thread/message id 経由）/ _shared/email（返信通知）/ _shared/ui / inquiry（同データ、訪問者側）

## 6. タグ別追加

### 6.1 auth-required（SEC-002）
- 全 admin ルート/API は Clerk + allowlist。訪問者は到達不可。

### 6.2 stateful
- open → closed（A-A3）。closed の再オープンは MVP 外。

## 7. スコープ外
- 複数運用者 / ロール分け（単一運用者）
- 監査ログ（単一運用者のため MVP 不要、concept §5 注記）
- 一括操作 / 検索（MVP は一覧 + 返信のみ）

## 8. 未決事項
現時点で論点なし (2026-05-27)。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
