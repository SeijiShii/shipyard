# legal 単体テスト計画

> **入力**: `./001_legal_SPEC.md`, `./002_legal_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | privacy page | 必須見出し（取得項目/利用目的/保管/開示請求窓口/cookieless）を含む |
| U-2 | terms page | 必須見出し（免責/禁止行為/準拠法）を含む |
| U-3 | metadata | 両ページが index 可 + title/description |

### 1.2 整合性
| ID | 対象 | 検証 |
|---|---|---|
| U-C1 | privacy 内容 | 「外部 AI 送信なし」「cookieless」と §6 が一致 |
| U-C2 | privacy 取得項目 | メール + 本文のみ（過剰項目を書いていない） |

### 1.3 境界
| ID | 対象 | 検証 |
|---|---|---|
| U-B1 | Footer リンク | /legal/privacy・/legal/terms が存在（ui Footer テストと連携） |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| MDX レンダリング | 実物（静的） |
| seo buildMetadata | 実物 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80%（主に表示） |
| 内容整合（U-C1/C2） | 必須 |

## 4. テスト実行環境
- Vitest + Testing Library。静的なので render + 内容 assert 中心。

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
