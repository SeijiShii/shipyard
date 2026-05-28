# 単体テストレポート: service-status/revise_service-icons

## 実施日時
2026-05-28 18:35 (JST)

## 関連ドキュメント
- [003_REVISE_UNIT_TEST.md](./003_REVISE_UNIT_TEST.md)

## テスト実行環境
- Node.js / TypeScript / Vitest 2.1.9
- jsdom (React Testing Library)

## テスト結果

| # | テストケース | テストファイル | 結果 | 備考 |
|---|---|---|---|---|
| U-IC1 | contract: iconUrl ありの parse 成功 | lib/hub/hub.test.ts | ✅ | hana-memo CDN URL を保持 |
| U-IC7 | contract: 無効 URL は undefined 降格 (R3 graceful) | lib/hub/hub.test.ts | ✅ | service エントリは保持 (R3 spec-review 反映) |
| U-IC8 | contract: 空文字も undefined 降格 | lib/hub/hub.test.ts | ✅ | R3 同上 |
| U-3-icon | cache: iconUrl propagation (R7 既存 U-3 拡張) | lib/hub/hub.test.ts | ✅ | 明示列挙 mapping 漏れ機械担保 (R1) |
| U-3-icon-null | cache: iconUrl 不在 → null | lib/hub/hub.test.ts | ✅ | mock contract 互換 |
| U-IC5-pub | toPublicStatus: iconUrl を公開出力に含む | features/service-status/service-status.test.tsx | ✅ | 公開安全フィールドとして配信 |
| U-IC2 | StatusCard: iconUrl あり → `<img alt="" role="presentation">` | features/service-status/service-status.test.tsx | ✅ | R4 装飾画像 WCAG 1.1.1 |
| U-IC3 | StatusCard: iconUrl 不在 → イニシャル fallback ("花") | features/service-status/service-status.test.tsx | ✅ | Array.from(name)[0] |
| U-IC4 | StatusCard: onError → React state 切替 | features/service-status/service-status.test.tsx | ✅ | fireEvent.error |
| U-IC9 | StatusCard: name 空 → "?" fallback | features/service-status/service-status.test.tsx | ✅ | defensive |
| U-IC10 | StatusCard: emoji name → "🌸" (grapheme cluster) | features/service-status/service-status.test.tsx | ✅ | Array.from で UTF-8 grapheme |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|---|---|---|
| (なし) | — | — | 003 計画通り 11 件を追加実装、計画外の追加テストなし |

## サマリー

| 項目 | 値 |
|---|---|
| 計画テスト数 | 11 件 |
| 追加テスト数 | 0 件 |
| 合計 | 11 件 |
| 成功 | 11 件 |
| 失敗 | 0 件 |
| 成功率 | 100% |
| 全 PJ 累計 | **172 tests GREEN** (前回 161 → 本 revise で +11) |

## 動作確認 (Phase 2 後、unit test 範囲外)

1. drizzle migration apply: Neon dev branch ✅
2. cron-refresh.sh: `{"ok":true,"updated":1}` (hana-memo) ✅
3. `/api/services` レスポンスに iconUrl 含有 ✅
4. LP ブラウザ表示: ユーザー目視確認 (port 3000 tmux dev)
