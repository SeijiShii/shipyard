# _shared/auth 単体テスト計画

> **入力**: `./001_auth_SPEC.md`, `./002_auth_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | isOperator | allowlist 内メール → true |
| U-2 | requireOperator | 認証済 + allowlist 内 → ok |

### 1.2 異常系（認可、SEC-002 必須）
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| U-E1 | requireOperator | 未認証 | 403/リダイレクト |
| U-E2 | requireOperator | 認証済だが allowlist 外 | 403（詳細非開示） |
| U-E3 | isOperator | 空/不正メール | false |

### 1.3 境界値
| ID | 対象 | 検証 |
|---|---|---|
| U-B1 | OPERATOR_EMAILS | 複数/空白/大文字小文字 正規化 |
| U-B2 | middleware matcher | 訪問者導線（/, /contact, /t/*, /services, /legal）は通過（保護対象外） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| Clerk セッション | injectable mock（auth() を差し替え、実キー不要） |
| env（OPERATOR_EMAILS） | 固定値注入 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |
| allowlist/認可分岐 | 100%（U-1/E1/E2/B2） |

## 4. テスト実行環境
- Vitest。Clerk は mock。実サインインは Phase 3/Release。

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
