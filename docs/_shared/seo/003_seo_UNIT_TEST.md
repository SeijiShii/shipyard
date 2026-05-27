# _shared/seo 単体テスト計画

> **入力**: `./001_seo_SPEC.md`, `./002_seo_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | buildMetadata | title/description/canonical/og:*/twitter:card が期待通り |
| U-2 | jsonld(Person/WebSite) | 妥当な JSON-LD（@context/@type 正しい） |
| U-3 | sitemap | 公開ページ列挙、admin/api/t を含まない |
| U-4 | robots | admin/api/t が disallow |

### 1.2 異常系
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| U-E1 | buildMetadata | description 未指定 | デフォルト description |
| U-E2 | metadata(/t/[token]) | token ページ | `index:false, follow:false` |

### 1.3 境界値
| ID | 対象 | 検証 |
|---|---|---|
| U-B1 | OG タイトル | 長文/Unicode で切り詰め・崩れなし |
| U-B2 | canonical | SITE_URL 末尾スラッシュ正規化 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| SITE_URL（env） | 固定値注入 |
| @vercel/og レンダリング | 出力存在 + content-type 検証（pixel 検証は Phase 3 視覚） |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |
| 分岐 | 70%（noindex 分岐は 100%） |

## 4. テスト実行環境
- Vitest。動的 OG は Edge runtime のためレスポンス検証中心。

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
