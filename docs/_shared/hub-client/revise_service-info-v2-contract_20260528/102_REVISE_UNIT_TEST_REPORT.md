# 単体テストレポート: _shared/hub-client service-info-v2-contract retrofit

## 実施日時
2026-05-28 20:20 (JST)

## 関連ドキュメント
- [003_REVISE_UNIT_TEST.md](./003_REVISE_UNIT_TEST.md) — 単体テスト計画
- [101_REVISE_IMPL_REPORT.md](./101_REVISE_IMPL_REPORT.md) — 実装レポート

## テスト実行環境
- Node.js: project default (Next.js 推奨)
- Vitest: project default (jsdom 環境、CLAUDE.md `## テスト` 参照)
- 実行コマンド: `npm run test -- --run`

## テスト結果

| # | テストケース | テストファイル | 結果 | 備考 |
|---|---|---|---|---|
| 1 | serviceInfoPayload v2: 最小固定契約 (schemaVersion=2/service/status/generatedAt) | `lib/hub/service-info.test.ts:7` | ✅ pass | 既存 test、schemaVersion 1→2 修正 (U-V2-M1) |
| 2 | serviceInfoPayload: version optional | `lib/hub/service-info.test.ts:18` | ✅ pass | 既存維持 |
| 3 | **U-V2-1** serviceInfoPayload: siteUrl 指定時に iconUrl 組み立て | `lib/hub/service-info.test.ts:23` | ✅ pass | **新規**、`iconUrl === "https://shipyard.example.com/icon.svg"` |
| 4 | **U-V2-2** serviceInfoPayload: siteUrl 省略時に iconUrl 不在 (v1 互換) | `lib/hub/service-info.test.ts:29` | ✅ pass | **新規**、`.not.toHaveProperty("iconUrl")` (version 指定有/無 両方) |
| 5 | isAuthorizedHub: 正しい HUB_SERVICE_INFO_SECRET → true | `lib/hub/service-info.test.ts:38` | ✅ pass | test name rename (U-V2-M2)、挙動変更なし |
| 6 | isAuthorizedHub: 不一致/欠落/secret 未設定 → false | `lib/hub/service-info.test.ts:41` | ✅ pass | 既存維持 |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|---|---|---|
| 1 | `serviceInfoPayload` | **U-V2-1** siteUrl 指定 → iconUrl 組み立て | v2 favicon-projection の機械担保 |
| 2 | `serviceInfoPayload` | **U-V2-2** siteUrl 省略 → iconUrl 不在 | v1 互換 path 維持の機械担保 (HUB v1 receiver 互換性の証拠) |

## サマリー

| 項目 | 値 |
|---|---|
| 計画テスト数 | 6 件 (003 §1.1 + §1.2 + §2) |
| 追加テスト数 | 2 件 (U-V2-1 + U-V2-2、計画通り) |
| 合計 | 6 件 (本ファイル) / 全 176 件 (project-wide) |
| 成功 | 6 件 (本ファイル) / 176 件 (project-wide) |
| 失敗 | 0 件 |
| 成功率 | 100% |

## カバレッジ評価 (定性)

| 種別 | 達成 | 根拠 |
|---|---|---|
| 行カバレッジ | ~100% | `serviceInfoPayload` の全 path (version 有/無 × siteUrl 有/無 = 4 combination) + `isAuthorizedHub` の全 branch (secret undefined / header null / 一致 / 不一致) すべて検証 |
| 分岐カバレッジ | ~100% | spread 条件式 `...(siteUrl ? {...} : {})` の両 branch、Bearer 検証の全 branch |

## 残課題 (本 revise の範囲外)

- **E2E 実機確認** (004_REVISE_E2E_TEST §1): Release Phase 3 デプロイ後の `curl -H "Authorization: Bearer <secret>" https://shipyard.<domain>/api/hub/service-info` で 200 + iconUrl 受信確認。Playwright bootstrap ([論点-005]) 待ちのため手動 curl で代替予定。
- **route.ts ハンドラの integration test**: 現状 unit のみ (純関数 2 件)、`process.env.HUB_SERVICE_INFO_SECRET` 経由の auth は実 env 設定が要るため Release Phase 2 動作確認で目視。
