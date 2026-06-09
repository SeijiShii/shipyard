# legal 単体テスト計画（特商法表記の追加 + 業態整合）

> **入力**: `./001_REVISE_SPEC.md`, `./002_REVISE_PLAN.md`, 既存 `features/legal/legal.test.tsx`
> **最終更新**: 2026-06-10

---

## 1. 追加テストケース

### 1.1 正常系
| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| U-CM1 | CommerceContent | render | 法定見出しを含む: 「販売事業者」/「代表者」/「所在地」/「お支払い方法」/「提供時期」/「返金」（or「キャンセル・返金」） |
| U-CM2 | CommerceContent | render | 事業者情報を含む: `QUADii` / `四伊清司` / `quadii.shii@gmail.com` |
| U-CM3 | CommerceContent | render | 業態文言を含む: 「作者応援寄付」+「追加オプション」+「クラウドファンディングではありません」（or 同義） |
| U-CM4 | metadata（commerce/page） | import | `title === "特定商取引法に基づく表記 — shipyard"`、`description` truthy、`robots === undefined`（index 可） |
| U-FT1 | Footer | render | 「特定商取引法に基づく表記」リンクが `href="/legal/commerce"` で存在 |
| U-FT2 | Footer | render | テキスト `powered by givers.work` を含む |
| U-FT3 | Footer | render | 既存リンク（プライバシー `/legal/privacy` / 利用規約 `/legal/terms`）が維持されている（リグレッション） |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待振る舞い |
|---|---|---|---|
| （なし） | 静的ページのため異常系なし | — | — |

### 1.3 境界値
| ID | 対象 | 境界 | 期待振る舞い |
|---|---|---|---|
| U-CM5 | CommerceContent | 単発のみ（継続課金なし） | 「定期」「継続課金」「サブスク」の解約条項を**含まない**ことを確認（旧 GIVErS 条項の混入防止、negative assertion） |

## 2. 修正テストケース

| ID | 対象 | 修正前 | 修正後 | 理由 |
|---|---|---|---|---|
| （なし） | 既存 privacy/terms/metadata テストは不変 | — | — | 破壊的変更なし |

## 3. 削除テストケース

| ID | 対象 | 削除理由 |
|---|---|---|
| （なし） | — | — |

## 4. リグレッション強化

- 既存 `PrivacyContent (U-1, U-C1, U-C2)` / `TermsContent (U-2)` / `metadata (U-3)` は全維持。
- U-FT3 で Footer 既存リンクの維持を明示確認（特商法リンク追加で既存導線が壊れない）。

## 5. Mock 方針差分

| 対象 | 前回 | 今回 | 理由 |
|---|---|---|---|
| （なし） | 静的 render（mock 不要） | 同左 | 外部依存なし |

## 6. カバレッジ目標

| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | 既存継承（concept §継承） |
| 分岐 | 70% | 既存継承（静的ページは分岐ほぼなし） |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-10 | 初版作成 | /flow:revise |
