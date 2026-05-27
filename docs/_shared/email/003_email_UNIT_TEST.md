# _shared/email 単体テスト計画

> **入力**: `./001_email_SPEC.md`, `./002_email_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | sendThreadLink | Resend mock に正しい to/subject/リンク（`/t/{token}`）で送信、isNew で文言差 |
| U-2 | sendReplyNotification | リンクのみ、本文プレビュー非含有 |
| U-3 | sendNewInquiryNotification | 宛先=OPERATOR_EMAIL、admin リンク、本文/メアド最小限 |

### 1.2 異常系
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| U-E1 | send* | Resend 失敗 | 1 回リトライ → 失敗を返す（例外で呼び出し側を巻き込まない） |
| U-E2 | （呼び出し側契約） | メール失敗時 | スレッド作成は成功扱い（best-effort、§5.2）|

### 1.3 PII 検証（SEC-001 必須）
| ID | 対象 | 検証 |
|---|---|---|
| U-P1 | 全テンプレ | 本文に問い合わせ本文が含まれない（リンクのみ） |
| U-P2 | 失敗ログ | ログにメアド平文が出ない（マスク） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| Resend | injectable mock（実キー不要、O35） |
| env（FROM/SITE_URL） | 固定値注入 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |
| PII 非混入経路 | 100%（U-P1/P2） |

## 4. テスト実行環境
- Vitest + Resend mock。実送信は Phase 3/Release（test mode、宛先=自分）。

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
