# _shared/hub-client 単体テスト計画 (O48 service-info v2 retrofit)

> **入力**: `./001_REVISE_SPEC.md`, `./002_REVISE_PLAN.md`, `lib/hub/service-info.test.ts` (既存 2 describe / 4 test)
> **最終更新**: 2026-05-28

---

## 1. 追加テストケース

### 1.1 正常系

| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| **U-V2-1** | `serviceInfoPayload(now, undefined, siteUrl)` で iconUrl が組み立てられる | `siteUrl="https://shipyard.example.com"`, `now=Date(2026-05-27T12:00Z)` | `iconUrl: "https://shipyard.example.com/icon.svg"` が payload に含まれる |
| **U-V2-2** | `serviceInfoPayload(now)` (siteUrl 省略) で iconUrl 不在 (v1 互換 path) | 既存 minimum 呼び出し | `iconUrl` プロパティが**含まれない** (`.not.toHaveProperty("iconUrl")`) |
| **U-V2-3** | `schemaVersion` が `2` (literal) | 任意の呼び出し | `p.schemaVersion === 2` |

### 1.2 異常系

| ID | 対象 | 失敗条件 | 期待振る舞い |
|---|---|---|---|
| (新規異常系なし、`isAuthorizedHub` は既存 test 維持 = env name の rename のみ反映) | — | — | — |

### 1.3 境界値

| ID | 対象 | 境界 | 期待振る舞い |
|---|---|---|---|
| (境界値追加なし、iconUrl format check は producer 側で行わない方針 = SPEC §7.4) | — | — | — |

## 2. 修正テストケース

| ID | 対象 | 修正前 | 修正後 | 理由 |
|---|---|---|---|---|
| **U-V2-M1** | `serviceInfoPayload` 「最小固定契約」test (既存 test:7-16) | `schemaVersion: 1` を expect | `schemaVersion: 2` を expect | v2 bump |
| **U-V2-M2** | `isAuthorizedHub` 「正しい HUB_SHARED_SECRET → true」test name (既存 test:25) | `it("正しい HUB_SHARED_SECRET → true", ...)` | `it("正しい HUB_SERVICE_INFO_SECRET → true", ...)` | env rename |

## 3. 削除テストケース

| ID | 対象 | 削除理由 |
|---|---|---|
| (削除なし、全 4 既存 test は修正 or 維持) | — | — |

## 4. リグレッション強化

- **既存 test 維持**: `serviceInfoPayload` の `version optional` test + `isAuthorizedHub` の 「不一致/欠落/secret 未設定 → false」 test は変更なし維持
- **追加チェック**:
  - U-V2-2 で v1 互換 path (iconUrl 不在) を機械担保 = HUB v1 receiver 互換性の証拠
  - U-V2-3 で schemaVersion=2 を literal type で型保護 + test 検証 (誤 1 設定 = 型エラー or test fail)

## 5. Mock 方針差分

| 対象 | 前回 | 今回 | 理由 |
|---|---|---|---|
| `serviceInfoPayload` | 純関数 (mock 不要) | 同左 | 変化なし |
| `isAuthorizedHub` | 純関数 (mock 不要) | 同左 | 変化なし |
| `process.env.HUB_SHARED_SECRET` | 直接参照 (route.ts 側、test では route を通さず unit のみ) | `process.env.HUB_SERVICE_INFO_SECRET` に rename (route.ts のみ、unit test は引数経由で secret を渡すため env mock 不要) | env rename の波及 |

## 6. カバレッジ目標

| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 100% | 純関数 2 件のみ、全 path カバー (既存維持) |
| 分岐 | 100% | `isAuthorizedHub` 全 branch (secret undefined / header null / 一致 / 不一致) + `serviceInfoPayload` の version optional + iconUrl optional |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 (AUDIT-perspective-001 撃ち落とし、auto-pick) | /flow:revise |
