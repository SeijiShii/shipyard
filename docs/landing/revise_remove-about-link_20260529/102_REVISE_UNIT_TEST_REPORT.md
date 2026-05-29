# 単体テストレポート: landing / remove-about-link

## 実施日時
2026-05-29 09:52 (JST)

## 関連ドキュメント
- [003_REVISE_UNIT_TEST.md] - 単体テスト計画

## テスト実行環境
- ランタイム: Node.js / jsdom
- フレームワーク: Vitest

## テスト結果

| # | テストケース | テストファイル | 結果 | 備考 |
|---|------------|-------------|------|------|
| U-5 (修正) | Header: ワードマーク + お問い合わせ（about リンクなし） | components/components.test.tsx | ✅ | 「これは何？」リンク非存在 + /about href リンク無しを検証 |
| auth (修正) | 訪問者導線は保護対象外 | lib/auth/auth.test.ts | ✅ | public path 配列から /about 除去 |
| U-3 (不変) | sitemap 公開ページ列挙 | lib/seo/seo.test.ts | ✅ | PUBLIC_PATHS.length 動的検証で /about 削除に自動追従 |

## 追加テストケース
| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| U-5a | Header | `/about` href を持つリンクが存在しない | リンク削除の回帰防止（U-5 内に統合） |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト数 | 既存 170 |
| 追加テスト数 | 0（U-5 内 assertion 構成変更で吸収） |
| 合計 | 170 |
| 成功 | 170 |
| 失敗 | 0 |
| 成功率 | 100% |
