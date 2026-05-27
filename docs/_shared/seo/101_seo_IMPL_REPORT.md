# 実装レポート: _shared/seo

## 実装日時
2026-05-27 15:35 (JST)

## モード
feature（横断基盤・SEO/OGP）

## 関連ドキュメント
- [001_seo_SPEC.md](./001_seo_SPEC.md) / [002_seo_PLAN.md](./002_seo_PLAN.md) / [003_seo_UNIT_TEST.md](./003_seo_UNIT_TEST.md)
- [AI_LOG セッション](../../AI_LOG/D20260527_019_tdd_continuous.md)

## 変更一覧

### Phase 1: 静的 SEO 基盤
- `lib/seo/config.ts` — `SITE_NAME` / `DEFAULT_DESCRIPTION` / `MAKER_NAME` / `PUBLIC_PATHS` / `siteUrl()`（末尾スラッシュ正規化、env 注入可）
- `lib/seo/metadata.ts` — `buildMetadata({title,description,path,ogImage,noindex})` → Next Metadata（canonical/OGP/Twitter Card、noindex 分岐）
- `app/sitemap.ts` — 公開ページのみ列挙（admin/api/t 除外）
- `app/robots.ts` — admin/api/t を disallow + sitemap 参照

### Phase 2: JSON-LD
- `lib/seo/jsonld.ts` — `websiteJsonLd` / `personJsonLd` / `organizationJsonLd` / `breadcrumbJsonLd`（schema.org plain object）

### Phase 3: 動的 OG 画像
- `lib/seo/og.ts` — `ogTitle()`（切り詰め/Unicode）+ `OG_SIZE`（1200×630、純粋ロジック）
- `app/og/route.tsx` — `next/og` `ImageResponse`（Ink & Teal、edge runtime）

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | OG タイトル整形を `lib/seo/og.ts` に純粋関数として切り出し unit テスト（U-B1）。`@vercel/og` ではなく Next 同梱の `next/og` を使用（新規依存ゼロ） |
| 計画から省略した変更 | `ImageResponse` の実レンダリング（pixel）は unit せず Phase 3 視覚レビューへ（test plan §2「pixel 検証は Phase 3」準拠、Satori/WASM をテストに持ち込まない） |
| 想定外の問題 | なし。Lighthouse SEO は Phase 3（画面実装後 `/flow:design --review-only`） |

## PR Description
### タイトル
_shared/seo: メタタグ/JSON-LD/sitemap/robots/動的OG 基盤
### 概要
検索・SNS 流入の基盤。buildMetadata（canonical/OGP/Twitter）+ JSON-LD + sitemap/robots（token/admin/api を noindex）+ 動的 OG 画像。
### 変更内容
- buildMetadata（noindex 分岐で /t/[token] を検索除外、SEC-002）
- sitemap/robots が公開ページのみ、admin/api/t を除外
- next/og 動的 OG（Ink & Teal）+ 純粋ロジックの分離
### テスト
- 単体 11 件、全 GREEN。全体 60/60（100%）、typecheck クリーン。noindex 分岐 100%。
