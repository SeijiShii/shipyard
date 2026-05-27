# _shared/seo 実装計画書

> **入力**: `./001_seo_SPEC.md`, `../../concept.md` §3 / §4.8
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | LOC |
|---|---|---|
| `lib/seo/metadata.ts` | `buildMetadata()`（title/desc/canonical/OGP/Twitter） | 60 |
| `lib/seo/jsonld.ts` | Person/WebSite/Organization JSON-LD ビルダ | 50 |
| `app/sitemap.ts` | Next.js sitemap（公開ページ列挙、token/admin 除外） | 30 |
| `app/robots.ts` | robots（admin/api/t を disallow） | 20 |
| `app/og/route.tsx` | 動的 OG 画像（@vercel/og、Ink & Teal） | 70 |
| `lib/seo/config.ts` | SITE_URL / デフォルト description 等 | 20 |

## 2. 実装 Phase 分割
- **Phase 1**: metadata + config + robots/sitemap（静的 SEO 基盤）
- **Phase 2**: JSON-LD ビルダ
- **Phase 3**: 動的 OG 画像（@vercel/og）

## 3. 依存関係順序
```
config → metadata/jsonld → sitemap/robots → og/route
```

## 4. 既存ファイルへの影響
- 各 page の `generateMetadata` が `buildMetadata` を呼ぶ（landing/legal で配線）。

## 5. リスク・注意点
- `/t/[token]` は metadata で `robots: { index:false, follow:false }` を必ず付与（SEC-002）。
- 動的 OG は @vercel/og（Edge）でフォント埋め込み注意（サブセット）。

## 6. 完了の定義
- [ ] buildMetadata + JSON-LD + sitemap + robots + 動的 OG
- [ ] token/admin/api が noindex
- [ ] Lighthouse SEO/Best Practices 合格（Phase 3 視覚レビュー時）

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
