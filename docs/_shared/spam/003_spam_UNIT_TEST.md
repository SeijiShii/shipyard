# _shared/spam 単体テスト計画

> **入力**: `./001_spam_SPEC.md`, `./002_spam_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | verifySubmission | 全段 pass（正当な入力）→ {ok:true} |
| U-2 | generateThreadToken | base64url、長さ≥22（128-bit）、毎回ユニーク |
| U-3 | rate-limit | 上限内 → pass、カウント増加 |

### 1.2 異常系（各防御段）
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| U-E1 | honeypot | 隠しフィールド非空 | reject（汎用理由） |
| U-E2 | timing trap | formRenderedAt が直近（<2s） | reject |
| U-E3 | rate-limit | 上限超過 | reject（429 相当） |
| U-E4 | turnstile | 検証 fail（mock） | reject |
| U-E5 | email-checks | 使い捨てドメイン | reject |
| U-E6 | email-checks | MX なし（mock） | reject |
| U-E7 | turnstile | API 障害（mock） | [論点-005] 設定=reject なら reject + 再試行 |

### 1.3 PII / 境界（SEC-001/002）
| ID | 対象 | 検証 |
|---|---|---|
| U-P1 | rate-limit key | ip/email がハッシュ化（平文を含まない） |
| U-P2 | reject 理由 | ユーザー向けは汎用文言（内部理由を漏らさない） |
| U-B1 | token | 同時生成の一意性（衝突リトライ動作） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| Turnstile API | injectable mock（success/fail/障害） |
| MX 確認 | injectable mock |
| rateLimitRepo | mock（db 側で別途テスト） |
| crypto（token） | 実物、衝突テストのみ固定注入 |
| 時刻 | 固定注入 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |
| 防御段（5 段）分岐 + PII ハッシュ | 100%（U-E1〜E7, U-P1） |

## 4. テスト実行環境
- Vitest。Turnstile/MX は mock。実 Turnstile（test キー）結合は Phase 3/Release。

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
