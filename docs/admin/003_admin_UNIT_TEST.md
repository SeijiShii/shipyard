# admin 単体テスト計画

> **入力**: `./001_admin_SPEC.md`, `./002_admin_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | 一覧 page | listRecent を last_activity 降順で表示 |
| U-2 | reply API | requireOperator pass → message(operator) + touchActivity + email |
| U-3 | close API | setStatus(closed) |

### 1.2 異常系（認可、SEC-002）
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| U-E1 | reply/close API | 未認証 | 401/リダイレクト |
| U-E2 | reply/close API | allowlist 外 | 403（詳細非開示） |
| U-E3 | reply | body 空/超過 | 400（Zod） |
| U-E4 | 詳細 | 存在しない id | 404 |
| U-E5 | email 失敗 | Resend fail | message 追加は成功（best-effort） |

### 1.3 PII / 境界
| ID | 対象 | 検証 |
|---|---|---|
| U-P1 | ログ | 本文/メアドが平文で出ない（SEC-001） |
| U-X1 | メッセージ表示 | 本文プレーンテキスト（XSS） |
| U-B1 | 一覧 | 0 件 → EmptyState |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| auth.requireOperator | mock（pass/未認証/allowlist 外） |
| db repos | mock |
| email.sendReplyNotification | mock（成功/失敗） |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |
| 認可分岐（requireOperator）+ PII | 100%（U-E1/E2, U-P1） |

## 4. テスト実行環境
- Vitest。Clerk/Resend は mock（実キー不要 CI green）。

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
