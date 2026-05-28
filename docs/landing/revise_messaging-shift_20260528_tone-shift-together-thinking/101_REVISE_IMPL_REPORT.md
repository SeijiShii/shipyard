# 実装レポート: landing メッセージング転換 (revise — tone-shift-together-thinking)

## 実装日時
2026-05-28 12:30 (JST)

## モード
revise (subfolder prefix `revise_` で判定)

## 関連ドキュメント
- [001_REVISE_SPEC.md](./001_REVISE_SPEC.md) — 変更仕様書
- [002_REVISE_PLAN.md](./002_REVISE_PLAN.md) — 変更計画書
- [003_REVISE_UNIT_TEST.md](./003_REVISE_UNIT_TEST.md) — 単体テスト計画
- [004_REVISE_E2E_TEST.md](./004_REVISE_E2E_TEST.md) — E2E テスト計画 (後続 /flow:e2e で実行)
- [AI_LOG セッション](../../AI_LOG/D20260528_004_tdd_landing_revise_messaging-shift.md) — 設計判断ログ
- 親 dispatch: [D20260528_003_resume_continuous](../../AI_LOG/D20260528_003_resume_continuous.md)
- 設計セッション: [D20260528_002_revise_landing_messaging-shift](../../AI_LOG/D20260528_002_revise_landing_messaging-shift.md)

## 注意事項
本レポートのファイルパスと行番号は実装日時時点のもの。以後の変更 (特に `/flow:wording` 仕上げ後) で行番号がずれる可能性あり。

## 変更一覧

### Phase 1: コピー差し替え + キーワード存在/アンチパターン非存在テスト (RED→GREEN→IMPROVE)

#### 新規ファイル
- **`features/landing/copy.ts`** (約 50 行) — LP コピー集約モジュール
  - `heroCopy` (heading / lead / cta)
  - `consultPitchCopy` (heading / body / cta)
  - `valueSectionCopy` (3 項目、3 つ目で「共に考える」スタンスを担う)
  - `siteDescription` (DEFAULT_DESCRIPTION 上書き用)
  - `TONE_KEYWORDS` (5 種: 共に考 / 共に悩 / 正解の見えない / 絶対の正解 / これからを共に)
  - `ANTI_PATTERN_KEYWORDS` (9 種: 成功させましょう / 成功をお約束 / 必ず / 絶対に成功 / 今すぐ / 急いで / の秘訣 / するべき / しなければ)

#### 既存ファイル変更
- **`features/landing/Hero.tsx`** — heroCopy 参照に差し替え。リード文に「絶対の正解とは思いません / 正解の見えない時代 / 共に考え・共に悩む」を含めスタンスを表現。CTA「ご相談はこちら」維持。
- **`features/landing/ConsultPitch.tsx`** — consultPitchCopy 参照に差し替え。本文に「『AI 駆動ならビジネスは成功する』とは約束しません」「正解の見えない世界で『共に考え・共に悩む』」「これからを共に考えてほしい」を含む。CTA「お問い合わせへ」維持。
- **`features/landing/ValueSection.tsx`** — valueSectionCopy 参照に差し替え。3 つ目を「共に考える」に再構成 (元: 「相談できる」)。
- **`lib/seo/config.ts`** — DEFAULT_DESCRIPTION を新スタンス版に差し替え。OGP/Twitter Card description にも反映 (buildMetadata 経由)。
- **`features/landing/landing.test.tsx`** — 既存 U-1〜U-3, U-B1, JsonLd の 5 件は維持。新規 U-T1〜T4 を append (`countKeywords` ヘルパ関数 + 4 describe / 5 it 構造)。

#### 設計判断
- **copy.ts 外出し採用** (D20260528-015): 002_REVISE_PLAN §2 推奨どおり。4 箇所の文言が `/flow:wording` 校正で再度触られることを踏まえ、1 ファイル集約で校正対象を絞れる。
- **アンチパターン回避調整** (D20260528-016): SPEC §7.1 暫定文案「『AI 駆動でビジネスを成功させましょう』とは言いません」は U-T4 grep で「成功させましょう」を検出してしまうため、「『AI 駆動ならビジネスは成功する』とは約束しません」へ書き換え。意味は維持、機械チェック整合性確保。

## 実装計画からの差分

| 項目 | 内容 |
|---|---|
| 計画にない追加変更 | `app/page.tsx` の `generateMetadata` 差し替えは不要だった (`buildMetadata` が `lib/seo/config.ts` の `DEFAULT_DESCRIPTION` を参照しているため、config 側の 1 行更新だけで OGP/Twitter Card description が連鎖更新される) |
| 計画から省略した変更 | なし。002_REVISE_PLAN §1 表のうち `app/(public)/page.tsx` は実態 `app/page.tsx` (paren グルーピングなし) でパスのみ差異、metadata 差し替えは config 経由で自動反映 |
| 想定外の問題と対処 | SPEC §7.1 暫定文案「とは言いません」が U-T4 grep と衝突 → D20260528-016 で「とは約束しません」へ調整。AI_LOG 記録、wording で再仕上げ前提 |

## テスト結果サマリ

- 全テストスイート: **159/159 GREEN** (Test Files 16/16)
- landing.test.tsx 単体: **10/10 GREEN** (既存 5 + 新規 U-T1〜T4 5)
- Regression: なし (lib/seo の DEFAULT_DESCRIPTION 変更は OGP/Twitter Card 経由で page metadata に伝播するが、既存 U-3 metadata.title/openGraph 存在チェックは別軸で pass)

## PR Description

### タイトル
landing: メッセージング転換 (lead-gen → 「共に考える相談相手」) Phase 1 実装

### 概要
docs/landing/revise_messaging-shift_20260528_tone-shift-together-thinking/ の Phase 1 実装。LP のコアメッセージングを「AI 駆動開発で速く作る／コンサル承ります」(lead-gen 装置) から「正解の見えない世界で『共に考え・共に悩む』相談相手として出会う」(スタンス開示) へ転換。文言ベース改修、URL/API/DB 不変、後方互換維持。

### 変更内容
- `features/landing/copy.ts` 新規 — LP コピー集約 (Hero/Value/ConsultPitch/site description + tone keyword fixture)
- `features/landing/Hero.tsx`, `ConsultPitch.tsx`, `ValueSection.tsx` を copy.ts 参照に差し替え + 新スタンス反映
- `lib/seo/config.ts` DEFAULT_DESCRIPTION 更新 — OGP/Twitter Card description にも自動反映
- `features/landing/landing.test.tsx` に新規 U-T1〜T4 追加 (スタンスキーワード存在 + アンチパターン NG キーワード非存在)

### テスト
- 単体テスト: 159/159 GREEN (新規 5 件追加、regression なし)
- E2E: 後続 `/flow:e2e` で Level 1 snapshot 再撮 + L1-S2'/S4/S5/L2-S2 実行 (未実行)
- 視覚レビュー: 後続 `/flow:design --review-only` で実施 (未実行)
- 文言仕上げ: 後続 `/flow:wording` で実施 (未実行)
