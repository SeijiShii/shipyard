# landing 単体テスト計画

> **入力**: `./001_landing_SPEC.md`, `./002_landing_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | Hero | リード文 + CTA 表示、CTA href=/contact |
| U-2 | ConsultPitch | コンサル文言 + CTA→/contact |
| U-3 | page metadata | generateMetadata が title/OGP を返す（seo 連携） |

### 1.2 異常系
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| U-E1 | 稼働一覧埋め込み | データ 0/取得失敗 | EmptyState（技術詳細なし） |

### 1.3 境界 / a11y
| ID | 対象 | 検証 |
|---|---|---|
| U-B1 | 全セクション | role/heading 構造、CTA がキーボード到達可 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| service-status getCachedStatus | mock（空/正常/失敗） |
| seo buildMetadata | 実物（純関数） |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |

## 4. テスト実行環境
- Vitest + Testing Library。視覚回帰は E2E（Level 1）。

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
