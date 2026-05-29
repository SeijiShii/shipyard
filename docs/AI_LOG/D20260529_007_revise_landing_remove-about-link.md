# AI_LOG セッション D20260529_007 — /flow:revise landing remove-about-link

**実行日時**: 2026-05-29 09:45 (+09:00)
**コマンド**: /flow:revise（引数: about リンク 404 / LP 自体が説明なので about 不要）
**対象機能+issue**: landing / remove-about-link
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 完了（設計 4 文書生成、実装は /flow:tdd 待ち）
**含まれる decision**: D20260529-006 〜 D20260529-008

---

## 主要決定サマリ

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260529-006 | triage (fix vs revise) | revise = ナビ要素の要否判断 (仕様変更) を含むため。単なる経路修正でなく「about 導線を持つか」の設計判断 | auto-recommended |
| D20260529-007 | 解決方針 (about リンクの扱い) | **Header の /about リンク削除 + sitemap から /about 除去**。about ページ作成 (冗長) は不採用。O41 は LP Hero で充足 | auto-recommended (Class A、ユーザー steer 明確) |
| D20260529-008 | orphaned InfoButton の扱い | 本改修では残置 (§9 [論点-001]、非ブロッキング)。dead code 整理は別タスク | auto-recommended |

## 調査結果 (実コード)

- **根本原因**: `components/layout/Header.tsx:12` が `<a href="/about">これは何？</a>` を持つが `app/` に about ルート不在 → 404。`lib/seo/config.ts` PUBLIC_PATHS が `/about` を含む → sitemap に 404 ページ掲載 (SEO 不適切)。
- **O41 二重アフォーダンス**: (1) Header「これは何？」(/about、壊れ) と (2) `components/ui/InfoButton.tsx`（O41 モーダル、**どこにも未配置 = orphaned**）。現状 O41 は **LP Hero 内容**（"個人開発のマイクロサービスを公開しています…"）で実質充足。
- **ユーザー指摘の妥当性**: 「LP 自体が説明 = about 不要」は正しい。Header リンクは壊れ + 冗長。

## 影響範囲

- code: `components/layout/Header.tsx`（リンク削除）/ `lib/seo/config.ts`（PUBLIC_PATHS から /about）
- test: `components/components.test.tsx` U-5（これは何リンク assertion 削除）/ `lib/auth/auth.test.ts`（public path 配列の /about、任意）
- **変更不要**: `lib/seo/seo.test.ts` U-3 sitemap テストは `PUBLIC_PATHS.length` で動的検証 = 自動追従

## 後方互換 / リリース / ロールバック

- 後方互換: ✅（削除対象は壊れた導線）。マイグレーション不要（DB 非関与）。
- リリース: 一括（軽微 UI/SEO）。本番デプロイで 404 導線解消。
- ロールバック: code revert のみ。

## 生成・更新ファイル

- docs/landing/revise_remove-about-link_20260529/{README, 001_REVISE_SPEC, 002_REVISE_PLAN, 003_REVISE_UNIT_TEST, 004_REVISE_E2E_TEST, INDEX}.md
- docs/landing/INDEX.md（サブフォルダ行追加）/ docs/INDEX.md（landing 改修件数 +1）
- docs/AI_LOG/D20260529_007_*.md（本ファイル）/ INDEX.md

## 依存関係

- depends_on: landing feature SPEC (001_landing_SPEC, Header design SoT §5/§7) / revise_messaging-shift_20260528 (直近 landing 改修)
- 親 chain: 本番稼働 (D005) で 404 がユーザー発覚 → 本 revise

## 学習・改善

- Header の「これは何？」リンクと InfoButton(O41) の二重アフォーダンス + どちらも未完成（リンク→404 / InfoButton 未配置）は、O41 を「nav リンク」と「inline modal」の両建てで設計したが配線が片方も完成しなかった設計スリップ。今回ユーザー判断で「LP 自体が説明」に一本化。
