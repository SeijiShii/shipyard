# landing 変更計画書 (メッセージング転換 — 「共に考える相談相手」スタンス)

> **入力**: [`./001_REVISE_SPEC.md`](./001_REVISE_SPEC.md), [`../../concept.md`](../../concept.md) §1.4, [`../002_landing_PLAN.md`](../002_landing_PLAN.md), [`../../design/design-system.md`](../../design/design-system.md) §6 ボイス&コピー
> **最終更新**: 2026-05-28

---

## 1. 既存ファイル変更一覧

| ファイル | 変更内容 (概要) | リスク | 関連 SPEC § |
|---|---|---|---|
| `features/landing/Hero.tsx` | リード文 (文字列リテラル or default prop) を新スタンス版に差し替え。CTA テキストは「ご相談はこちら」維持。コンポーネント構造・props 型は不変 | 低 (文字列のみ。Level 1 snapshot は再撮で吸収) | §7.1 UC-L1, §7.5 トーン |
| `features/landing/ConsultPitch.tsx` | コンサル打ち出しコピー全文を新スタンス版に差し替え (「『AI 駆動で成功させましょう』とは言わない」「共に考える」「これからを共に考えてほしい」キーワード必須)。CTA テキスト「ご相談はこちら」維持。`href="/contact"` 維持 | 低 (文字列のみ) | §7.1 UC-L2, §7.5 トーン |
| `features/landing/ValueSection.tsx` | 提供価値 3 点コピーを「実装力 (動いているサービス群が裏付け) / 週1ペースの実践実績 / 共に考えるスタンス」に再構成 | 低 | §7.1 UC-L1, §3 影響範囲 |
| `app/(public)/page.tsx` | `generateMetadata` に渡す description (および OGP description) を新スタンス版に差し替え。`buildMetadata` 関数自体は変更なし | 低 (引数差し替えのみ。`og:image` URL/構造不変) | §7.2.1, §7.5 OGP, §2.2 入出力変更 |

> **注**: 上記のファイルパスは元 `002_landing_PLAN.md §1` に記載されたものを踏襲。実装側でリテラル抽出 (`landing/copy.ts` 等への外出し) を行う場合、構造変更を伴うため Plan §2 新規ファイル参照。

## 2. 新規ファイル一覧

| ファイル | 責務 | 依存 | LOC 見積 |
|---|---|---|---|
| `features/landing/copy.ts` (任意・推奨) | LP コピー文字列を 1 ファイルに集約 (Hero / Value / ConsultPitch / metadata description)。`/flow:wording` 校正の作業対象を 1 箇所に絞る + Unit テストの import 簡素化 | (なし、純データモジュール) | 約 30 |

> **判断**: copy.ts への外出しは「変更があった文字列リテラルが本改修で 4 箇所に散る + 後続 `/flow:wording` で再度触る」ことを踏まえると、外出し有利。ただし「最小差分で済ませる」案 (各コンポーネント内インライン文字列のまま) も許容範囲。`/flow:tdd` 着手時に再判断 (DoD §6 で言及)。

## 3. 削除ファイル一覧

| ファイル | 削除理由 | 代替 |
|---|---|---|
| (なし) | — | — |

## 4. マイグレーション要否

- DB スキーマ変更: ❌
- 既存データ変換: ❌
- 設定ファイル変更: ❌ (`.env.local` / `next.config.js` 等不変)
- ストレージパス変更: ❌

→ **Phase 5 REVISE_MIGRATION.md は不要** (D20260528-011 で決定)。

## 5. 実装 Phase 分割 (`/flow:tdd-phase` 連携)

### Phase 1 (RED→GREEN→IMPROVE) — コピー差し替え + キーワード存在テスト
- 対象: `features/landing/Hero.tsx`, `features/landing/ConsultPitch.tsx`, `features/landing/ValueSection.tsx`, `app/(public)/page.tsx` (`generateMetadata`)
- (任意) 新規 `features/landing/copy.ts` を作って各コンポーネントから import
- ゴール:
  - 既存 Unit テスト (U-1〜U-3, U-E1, U-B1) が全 pass
  - 新規 U-T1 (トーンキーワード存在) が pass
  - `npm run typecheck` green

### Phase 2 (snapshot 再撮)
- 対象: `e2e/landing.spec.ts` (or 該当 spec) の Level 1 スナップショット (`landing-happy.png`)
- ゴール: 新コピーで撮り直したスナップショットがコミットされ、CI で 0 差分

> **Phase 3 (視覚レビュー / コピー校正) は本コマンド外**: `/flow:design --review-only` + `/flow:wording` で実施。

## 6. 依存関係順序

```mermaid
graph TD
  A[copy.ts 作成 (任意)] --> B[Hero/Value/ConsultPitch コピー差し替え]
  A --> C[page.tsx metadata description 差し替え]
  B --> D[Unit U-T1 追加 + 既存 pass 確認]
  C --> D
  D --> E[E2E Level 1 snapshot 再撮]
  E --> F[/flow:design --review-only/]
  F --> G[/flow:wording 仕上げ/]
```

## 7. ロールアウト計画

| ステップ | 内容 | 期日 | 検証方法 |
|---|---|---|---|
| 1 | 設計コミット (本セッション) | 2026-05-28 | git log + AI_LOG 整合 |
| 2 | `/flow:tdd` 実装 (Phase 1) | 設計直後 | Unit テスト green + typecheck pass |
| 3 | `/flow:e2e` Level 1 snapshot 再撮 (Phase 2) | Phase 1 後 | E2E green |
| 4 | `/flow:design --review-only` 視覚レビュー | E2E 後 | charter §2.2 抵触なし、O41 入口理解 OK |
| 5 | `/flow:wording` JA トーン仕上げ (O42) | デザインレビュー後 | キーワード保持 (「共に考える」「正解の見えない」等)、硬さ解消 |
| 6 | Vercel preview deploy 目視 | wording 後 | スタンスが伝わる、煽りなし、技術用語なし |
| 7 | 本番一括 deploy | 目視 OK 後 | 公開後 Sentry エラー監視 |

## 8. リスク・注意点

- **暫定リード文を `/flow:wording` 仕上げ前に本番公開しない** — SPEC §7.1 の暫定文案はキーワード保持を優先したため、硬さ・事務感が残っている可能性大。Phase 5 (`/flow:wording`) を必ず通す。
- **Level 1 snapshot 差分** — 文言変更で必ず発生するため、本改修 PR 内で snapshot 再撮を含める。CI で差分検出されたまま放置しない。
- **CTA テキストの誤改修** — 「ご相談はこちら」を「共に考えませんか」等に変えると煽りトーンになりがち (charter §2.2 抵触リスク)。CTA 本体は短文 + 控えめを死守し、スタンスは前後の ConsultPitch コピーで担う。
- **「我々がやってあげる」上から目線への退化** — 「相談相手として手伝う」「ご一緒する」というスタンスを `/flow:wording` で必ず確認 (SPEC §7.5 トーン (3))。
- **稼働一覧キャプション** — service-status component の状態ラベル (「動いています」「止まっているかも」「確認中」) は design SoT §6 のため本改修対象外。混同しない。
- **OGP `og:image` の動的生成** — 描画文字列の変更は本改修対象外 (画像内テキストの変更は別 revise)。description 文字列のみ更新。

## 9. 完了の定義 (DoD)

- [ ] 全 Phase 完了 (Phase 1 + 2)
- [ ] 単体テストカバレッジ目標達成 (行 80%、既存継承 + 新規 U-T1 含む)
- [ ] E2E シナリオ全成功 (L1-S1, L1-S2 新スタンス版, L1-S3, L2-S1)
- [ ] Level 1 snapshot が新コピーで再撮済 + CI 0 差分
- [ ] マイグレーション検証完了 — 不要
- [ ] `/flow:design --review-only` 通過 (charter §2.2 抵触なし、O41 入口理解 OK)
- [ ] `/flow:wording` 通過 (キーワード保持 + 硬さ解消)
- [ ] フィーチャーフラグ動作確認 — 不要
- [ ] copy.ts 外出し採否を決定 (`/flow:tdd` 着手時、AI_LOG に decision 記録)
- [ ] concept §1.1/§1 と LP SPEC §7.1 のメッセージング整合性確認 (audit pass)

## 10. 更新履歴

| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 | /flow:revise |
