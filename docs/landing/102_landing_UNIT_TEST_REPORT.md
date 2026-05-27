# 単体テストレポート: landing

## 実施日時
2026-05-27 16:04 (JST)

## 関連ドキュメント
- [003_landing_UNIT_TEST.md](./003_landing_UNIT_TEST.md) / [004_…_E2E_TEST.md](./004_landing_E2E_TEST.md)（E2E は /flow:e2e）

## テスト実行環境
- Vitest 2.1.9 + Testing Library（jsdom）。

## テスト結果

| # | テストケース | 結果 | 備考 |
|---|------------|------|------|
| U-1 | Hero: リード文 + CTA（href=/contact） | ✅ | h1 + 「ご相談はこちら」 |
| U-2 | ConsultPitch: コンサル文言 + CTA→/contact | ✅ | 煽らないトーン |
| U-B1 | ValueSection: 見出し構造（h3×3） | ✅ | |
| U-3 | page metadata: title/OGP（seo 連携） | ✅ | buildMetadata 由来、summary_large_image |
| — | JsonLd: </script> ブレイクアウト防止（< エスケープ） | ✅ | XSS 安全 |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| 1 | JsonLd | < エスケープで XSS 無害化 | SEC-003 整合（静的データ + breakout 防止）を担保 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト（U-1〜U-3, U-E1, U-B1） | 5 観点（U-E1 稼働一覧 EmptyState は StatusList で被覆） |
| 実装テスト数 | 5 件 |
| 全体スイート合計 | 117 件 |
| 成功 / 失敗 | 117 / 0 |
| 成功率 | 100% |

## カバレッジ要点
- CTA 遷移（→/contact）+ metadata（OGP）+ JSON-LD escaping を検証。
- 稼働一覧 0 件/失敗時の EmptyState（L-E1）は StatusList（service-status）で被覆済。
- 視覚レビュー（O34/O41）+ コピー（O38/O42）+ LCP は Phase 3（design --review-only / wording）/ E2E（004）。
