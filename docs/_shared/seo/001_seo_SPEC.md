# _shared/seo 仕様書（横断基盤・SEO/OGP）

> **役割**: メタタグ / 構造化データ(JSON-LD) / sitemap / 動的 OG 画像 の提供（検索・SNS 流入の基盤）
> **タグ**: cross-cutting
> **最終更新**: 2026-05-27
> **入力**: `../../concept.md` §3（SEO/共有性 NFR）/ §4.8（公開周知）, `./README.md`

---

## 1. 提供インターフェース
| 機能 | 提供 | 利用機能 |
|---|---|---|
| `buildMetadata(page)` | Next.js Metadata（title/description/canonical/OGP/Twitter Card） | landing, legal, service-status |
| JSON-LD ヘルパ | `Organization` / `WebSite` / `Person`（メイカー） / `BreadcrumbList` の構造化データ | landing |
| `sitemap.ts` | sitemap.xml 生成（公開ページ列挙） | 全公開ページ |
| `robots.ts` | robots.txt（インデックス許可、admin/api を除外） | — |
| 動的 OG 画像 | `og/route.tsx`（タイトル + ブランドの OG 画像を動的生成） | landing, 共有 |

## 2. 入出力
- `buildMetadata`: `{title, description, path, ogImage?}` → Next.js `Metadata`
  - `og:title/description/url/image`、`twitter:card=summary_large_image`（design SoT トーン）
  - `canonical` は `https://shipyard.<domain>` ベース（env `SITE_URL`）
- 動的 OG: クエリ（タイトル）→ PNG/SVG（Ink & Teal、`og:image` 1200×630）
- JSON-LD: `Person`（メイカー名義）+ `WebSite` + `Organization`（任意）

## 3. データモデル
なし。`SITE_URL` 等を env から読む。公開ページ一覧は静的 + service-status は動的 URL を含めない（外部サービス URL は rel 設定）。

## 4. バリデーション + エラーケース
| ID | 条件 | 振る舞い |
|---|---|---|
| SEO-E1 | ページに description 未指定 | デフォルト description にフォールバック |
| SEO-E2 | OG 画像生成失敗 | 静的フォールバック OG 画像 |

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| Core Web Vitals | LCP<2.5s、CLS 良好 | concept §3 SEO/性能 |
| インデックス制御 | 公開ページ index、`/admin/*`・`/api/*`・`/t/[token]` は noindex | プライバシー（token URL を検索に出さない、SEC 連携） |
| 構造化データ | schema.org JSON-LD で検索リッチ化 | §4.8.3 |
- 連携: landing/legal が `buildMetadata` を利用。`/t/[token]`（スレッド）は **noindex + nofollow**（token URL の漏洩防止）。

## 6. タグ別追加
cross-cutting。UC なし。Core Web Vitals は Phase 3 で Lighthouse + 視覚レビュー。

## 7. スコープ外
- 多言語 hreflang（i18n なし）
- AMP

## 8. 未決事項
現時点で論点なし (2026-05-27)。
> 注: `/t/[token]` は必ず noindex（token URL を検索エンジンに拾わせない）。SEC-002 と整合。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
