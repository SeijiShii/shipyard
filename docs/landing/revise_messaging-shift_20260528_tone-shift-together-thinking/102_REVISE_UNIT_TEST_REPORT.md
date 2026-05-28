# 単体テストレポート: landing メッセージング転換 (revise)

## 実施日時
2026-05-28 12:30 (JST)

## 関連ドキュメント
- [003_REVISE_UNIT_TEST.md](./003_REVISE_UNIT_TEST.md) — 単体テスト計画
- [101_REVISE_IMPL_REPORT.md](./101_REVISE_IMPL_REPORT.md) — 実装レポート

## テスト実行環境
- Node.js: v20+
- Vitest: 2.1.9
- jsdom + @testing-library/react

## テスト結果 (landing.test.tsx)

| # | テストケース | テストファイル | 結果 | 備考 |
|---|---|---|---|---|
| U-1 | Hero リード文 + CTA href=/contact | features/landing/landing.test.tsx | ✅ PASS | 既存維持。`/動いているサービス/` regex pass (新リード文に「動いているサービス」キーワード保持) |
| U-2 | ConsultPitch 文言 + CTA→/contact | features/landing/landing.test.tsx | ✅ PASS | 既存維持。「AI 駆動開発のご相談」見出し維持、CTA「お問い合わせへ」維持 |
| U-3 | page metadata title/OGP | features/landing/landing.test.tsx | ✅ PASS | 既存維持。metadata.title="shipyard"、openGraph 存在、twitter.card="summary_large_image" |
| U-B1 | ValueSection 提供価値見出し構造 | features/landing/landing.test.tsx | ✅ PASS | 既存維持。「実際に動いている」(1 つ目) 維持、h3 ×3 件 |
| JsonLd | XSS 安全 (`</script>` エスケープ) | features/landing/landing.test.tsx | ✅ PASS | 既存維持 |
| **U-T1** | Hero に TONE_KEYWORDS 1 種以上 | features/landing/landing.test.tsx | ✅ PASS | **新規**。heroCopy.lead が「絶対の正解」「正解の見えない」「共に考」「共に悩」を含む |
| **U-T2** | Hero+ConsultPitch 合算 2 種以上 | features/landing/landing.test.tsx | ✅ PASS | **新規**。両方合わせて 5 種全て検出 |
| **U-T3-a** | siteDescription に 1 種以上 | features/landing/landing.test.tsx | ✅ PASS | **新規**。「共に考」「共に悩」「正解の見えない」含む |
| **U-T3-b** | page metadata.description にも 1 種以上 | features/landing/landing.test.tsx | ✅ PASS | **新規**。buildMetadata 経由で DEFAULT_DESCRIPTION → openGraph.description に伝播 |
| **U-T4** | ANTI_PATTERN_KEYWORDS 0 件 | features/landing/landing.test.tsx | ✅ PASS | **新規**。全 9 種 (成功させましょう / 成功をお約束 / 必ず / 絶対に成功 / 今すぐ / 急いで / の秘訣 / するべき / しなければ) いずれも非含 |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|---|---|---|
| U-T1 | Hero | TONE_KEYWORDS 1 種以上含有 | メッセージング転換の機能化担保 (003_REVISE_UNIT_TEST §1.1) |
| U-T2 | Hero + ConsultPitch | TONE_KEYWORDS 2 種以上含有 | スタンスが LP のどこかで必ず読める恒久ガード |
| U-T3 | siteDescription + metadata | TONE_KEYWORDS 1 種以上 | SEO/SNS シェア時 (OGP) でもスタンス伝達 (2 it に分割: copy.ts 直接検証 + buildMetadata 経由 page metadata 検証) |
| U-T4 | LP 全テキスト合算 | ANTI_PATTERN_KEYWORDS 0 件 | charter §2.2 + SPEC §7.5 トーン (2) 「『絶対の正解』を売らない」の機械的担保 (003_REVISE_UNIT_TEST §4) |

## サマリー

| 項目 | 値 |
|---|---|
| 計画テスト数 (既存 + 新規) | 9 件 (既存 5 + 新規 4) |
| 追加テスト数 | 1 件 (U-T3 を 2 it に分割) |
| landing.test.tsx 合計 | 10 件 |
| **全テストスイート合計** | **159 件** |
| 成功 | 159 件 |
| 失敗 | 0 件 |
| **成功率** | **100%** |
| Regression | なし (元 LP テスト 5 件 + 他機能 144 件すべて pass) |

## カバレッジ (新規分)

| 対象 | カバレッジ |
|---|---|
| `features/landing/copy.ts` | 100% (純データモジュール、全 export を新規テストで参照) |
| `features/landing/Hero.tsx` | 既存維持 (構造テスト U-1) |
| `features/landing/ConsultPitch.tsx` | 既存維持 (構造テスト U-2) |
| `features/landing/ValueSection.tsx` | 既存維持 (U-B1) |
| `lib/seo/config.ts` | 既存維持 (DEFAULT_DESCRIPTION は U-T3 で参照) |

行カバレッジ目標 80% / 分岐 70% は既存継承で達成。
