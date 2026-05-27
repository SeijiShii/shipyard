# 単体テストレポート: _shared/seo

## 実施日時
2026-05-27 15:35 (JST)

## 関連ドキュメント
- [003_seo_UNIT_TEST.md](./003_seo_UNIT_TEST.md)

## テスト実行環境
- Vitest 2.1.9 / Node v22.11.0。SITE_URL は env 注入（固定値）。

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| U-B2 | siteUrl 末尾スラッシュ正規化 | ✅ | 複数スラッシュも除去 |
| U-1 | buildMetadata: title/desc/canonical/og/twitter | ✅ | summary_large_image |
| U-E1 | description 未指定→デフォルト | ✅ | フォールバック |
| U-E2 | noindex→index:false,follow:false | ✅ | /t/[token]（SEC-002） |
| — | noindex なしで robots 未付与 | ✅ | 分岐 100% |
| — | title なし→SITE_NAME のみ | ✅ | |
| U-2 | jsonld WebSite/Person | ✅ | @context/@type 妥当 |
| — | jsonld BreadcrumbList | ✅ | position + item URL |
| U-3 | sitemap 公開ページ列挙 | ✅ | admin/api/t 含まない |
| U-4 | robots disallow | ✅ | admin/api/t + sitemap 参照 |
| U-B1 | ogTitle 切り詰め/Unicode | ✅ | 80 字クランプ + … |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| 1 | buildMetadata | noindex なしで robots 未付与 | noindex 分岐の両側 |
| 2 | buildMetadata | title なし→SITE_NAME | フォールバック |
| 3 | jsonld | BreadcrumbList | 構造化データ網羅 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1〜U-4, U-E1〜U-E2, U-B1〜U-B2） | 8 観点 |
| 実装テスト数 | 11 件 |
| 追加テスト数 | 3 件 |
| 全体スイート合計 | 60 件 |
| 成功 / 失敗 | 60 / 0 |
| 成功率 | 100% |

## カバレッジ要点
- noindex 分岐（token/admin 除外）: 100%（SEC-002 整合）。
- 動的 OG の pixel/レンダリングは Phase 3 視覚レビューへ（test plan §2）。
