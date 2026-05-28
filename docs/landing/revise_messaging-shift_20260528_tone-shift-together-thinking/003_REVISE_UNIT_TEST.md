# landing 単体テスト計画 (メッセージング転換 — 「共に考える相談相手」スタンス)

> **入力**: [`./001_REVISE_SPEC.md`](./001_REVISE_SPEC.md), [`./002_REVISE_PLAN.md`](./002_REVISE_PLAN.md), [`../003_landing_UNIT_TEST.md`](../003_landing_UNIT_TEST.md)
> **最終更新**: 2026-05-28

---

## 1. 追加テストケース

### 1.1 正常系

| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| U-T1 | Hero (or copy.ts → Hero) | 通常レンダリング | 以下のスタンスキーワードのうち **少なくとも 1 つ以上** が DOM テキストに含まれる: 「共に考え」「共に悩」「正解の見えない」「絶対の正解」「これからを共に」(`/flow:wording` 後も意味的に保持されることを担保) |
| U-T2 | ConsultPitch | 通常レンダリング | 同上 (Hero と ConsultPitch のどちらかで上記キーワードを 2 種類以上検出。スタンスが LP のどこかで必ず読める保証) |
| U-T3 | `app/(public)/page.tsx` `generateMetadata` | 引数なし or 通常 | 返却される `description` (or OGP description) に上記キーワードのうち少なくとも 1 つが含まれる (SEO/SNS シェア時にスタンスが伝わる) |

### 1.2 異常系

| ID | 対象 | 失敗条件 | 期待振る舞い |
|---|---|---|---|
| (新規追加なし) | — | — | U-E1 (稼働一覧 0/取得不可 → EmptyState) は既存維持 |

### 1.3 境界値

| ID | 対象 | 境界 | 期待振る舞い |
|---|---|---|---|
| (新規追加なし) | — | — | a11y 系 U-B1 は既存維持 |

## 2. 修正テストケース

| ID | 対象 | 修正前 | 修正後 | 理由 |
|---|---|---|---|---|
| U-2 | ConsultPitch | 「コンサル文言 + CTA→/contact」(緩いアサーション、文言文字列はチェックなし) | **変更なし** (アサーション語彙は緩いまま、構造のみ) | U-2 は構造テスト。文言検証は新規 U-T1/U-T2 で担保。 |
| (Level 1 snapshot) | E2E 側 | `landing-happy.png` (旧コピー) | 新コピー版に**再撮** (PR 同梱) | §4 参照 |

> **結論**: 既存 U-1 / U-2 / U-3 / U-E1 / U-B1 は **全維持** (D20260528-008)。テスト本文に文字列リテラルアサーションが含まれていないため、コピー差し替えでも壊れない。

## 3. 削除テストケース

| ID | 対象 | 削除理由 |
|---|---|---|
| (なし) | — | — |

## 4. リグレッション強化

- **既存テスト維持**: U-1 (Hero リード文 + CTA href=/contact) / U-2 (ConsultPitch コピー存在 + CTA) / U-3 (page metadata title/OGP 返却) / U-E1 (EmptyState) / U-B1 (a11y) は全て pass を保つ。
- **追加チェック**:
  - U-T1/T2: 「スタンスキーワードが LP のどこかで必ず読める」を恒久ガードとして導入。後続 `/flow:wording` でコピー全文を再ライトしても、スタンス自体が消えない保証として機能する。
  - U-T3: SEO/SNS シェア (OGP description) でもスタンスが伝わる保証 (UC-L1 出力の延長線として metadata でもキーワード保持)。
- **キーワードリスト** (test fixture として copy.ts と並列に `features/landing/__tests__/tone-keywords.ts` 等に切り出し推奨):
  - 必須キーワード候補 (いずれかが必要): `共に考え` / `共に悩` / `正解の見えない` / `絶対の正解` / `これからを共に`
  - **アンチパターン NG キーワード** (含んでいたら fail): `成功させましょう` / `成功をお約束` / `必ず` / `絶対に成功` / `今すぐ` / `急いで` / `〜の秘訣` / `〜するべき` / `〜しなければ` (charter §2.2 + §5 NFR トーン (2) の遵守を機械的に担保)

> **NG キーワードテスト U-T4 を新設** (上記アンチパターンが Hero/ConsultPitch/metadata description のいずれにも出現しないことを assert)。後続 `/flow:wording` での意図せぬ煽り混入を捕捉。

| ID | 対象 | 検証 |
|---|---|---|
| U-T4 | Hero + ConsultPitch + page metadata description | アンチパターン NG キーワードリストのいずれも含まない |

## 5. Mock 方針差分

| 対象 | 前回 | 今回 | 理由 |
|---|---|---|---|
| `service-status` `getCachedStatus` | mock (空 / 正常 / 失敗) | **変更なし** | 本改修は service-status 連携に影響しない |
| `seo` `buildMetadata` | 実物 (純関数) | **変更なし** | 関数 contract 維持、引数のみ差し替え |
| (新規) `features/landing/copy.ts` (採用時) | — | 実物 (純データ) | U-T1〜T4 で直接 import して値検証 |

## 6. カバレッジ目標

| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | 既存継承 (concept §継承 + `../003_landing_UNIT_TEST.md`) |
| 分岐 | 70% | 既存継承 |

文字列定数差し替えは行カバレッジに影響しない。新規 U-T1〜T4 で純データ (copy.ts) の行カバレッジは 100% 想定。

## 7. テスト実行環境

- Vitest + Testing Library (`@testing-library/react` `screen.getByText` / regex matcher)
- 視覚回帰は E2E (Level 1) — 詳細は `004_REVISE_E2E_TEST.md`

## 8. 更新履歴

| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 | /flow:revise |
