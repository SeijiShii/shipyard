# inquiry 単体テスト計画

> **入力**: `./001_inquiry_SPEC.md`, `./002_inquiry_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | POST /api/inquiry | Zod pass + spam pass → thread+message 作成、{token} 返却 |
| U-2 | schema | 正しい email/body/subject を通す |
| U-3 | /t/[token] reply | 有効 token → message 追加 + touchActivity |
| U-4 | SubmitFlow | ProgressFeedback 段階 → token URL 表示 + localStorage 保存 |

### 1.2 異常系（SEC）
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| U-E1 | POST | spam reject | 400/429 + 汎用文言（理由非開示） |
| U-E2 | POST | Zod 失敗（不正 email/空 body/超過） | 400 + 項目エラー |
| U-E3 | reply / 表示 | 無効 token | 404（列挙耐性、rate limit） |
| U-E4 | reply | 他 thread の id を token で詐称 | 404（IDOR 防止、token 不一致） |
| U-E5 | email 失敗 | Resend fail | スレッド作成は成功（best-effort） |

### 1.3 PII / XSS 境界（SEC-001/003）
| ID | 対象 | 検証 |
|---|---|---|
| U-P1 | ログ/メール | 本文/メアドが平文で出ない（マスク、リンクのみ） |
| U-X1 | 本文表示 | `<script>` 等がエスケープされプレーンテキスト表示（実行されない） |
| U-X2 | body 上限 | 超過は Zod で reject |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| spam.verifySubmission / generateThreadToken | mock（pass/各 reject） |
| db repos | mock or テスト DB |
| email.send* | mock（成功/失敗） |
| localStorage | jsdom |
| 時刻（formRenderedAt） | 固定注入 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |
| IDOR / XSS / PII / spam 分岐 | 100%（U-E3/E4, U-X1, U-P1, U-E1） |

## 4. テスト実行環境
- Vitest + Testing Library。Turnstile/Resend/HUB は mock（実キー不要 CI green）。

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
