# landing 単体テスト計画（Header の壊れた「これは何？」(/about) リンク削除）

> **入力**: `./001_REVISE_SPEC.md`, `./002_REVISE_PLAN.md`, 既存 components.test.tsx / seo.test.ts / auth.test.ts
> **最終更新**: 2026-05-29

---

## 1. 追加テストケース

### 1.1 正常系
| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| U-5a | Header | `render(<Header />)` | `queryByRole("link", { name: "これは何？" })` が **null**（about リンク非存在） |

## 2. 修正テストケース

| ID | 対象 | 修正前 | 修正後 | 理由 |
|---|---|---|---|---|
| U-5 (components.test.tsx) | Header | テスト名「ワードマーク + お問い合わせ + これは何?」+ `getByRole("link", { name: "これは何？" })` を assert | テスト名「ワードマーク + お問い合わせ（about リンクなし）」、「これは何？」リンク assertion を **削除** + U-5a（非存在）を追加。`shipyard`(→/) と `お問い合わせ`(→/contact) の assert は維持 | `/about` リンク削除に伴う |

## 3. 削除テストケース
なし（U-5 の該当 assertion を修正で吸収）。

## 4. リグレッション強化
- **seo.test.ts U-3 (sitemap)**: `urls.length === PUBLIC_PATHS.length` で動的検証のため **変更不要**（`/about` 削除に自動追従）。リグレッションとして「sitemap に `/about` を含まない」ことを念のため明示確認してもよい（任意）。
- **auth.test.ts (line 76)**: public path 反復配列から `"/about"` を除去（任意・整合）。auth ミドルウェアの allowlist テストで、存在しない `/about` を検証対象から外す。

## 5. Mock 方針差分
なし。

## 6. カバレッジ目標
| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | 既存継承（concept §テスト） |
| 分岐 | 70% | 既存継承 |
- 期待テスト総数: 170 維持（U-5 内 assertion 構成変更のみ、純増減ほぼなし）。

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-29 | 初版作成 | /flow:revise |
