# _shared/hub-client 変更仕様書 (O48 service-info v2 favicon-projection 契約 retrofit)

> **改修種別**: 既存実装の契約 retrofit (拡張 + rename)
> **issue / slug**: `service-info-v2-contract` (AUDIT-perspective-001)
> **基準 SPEC**: `../001_hub-client_SPEC.md` (consumer 側、service-info producer は未掲載)
> **最終更新**: 2026-05-28
> **タグ**: contract-revise, no-migration, additive-extension

---

## 1. 変更概要

shipyard の **service-info producer** (`lib/hub/service-info.ts` + `app/api/hub/service-info/route.ts`) を perspectives.md O48 v2 (favicon-projection、CF-20260528-010 + CF-20260528-019) 契約に追従させる。**3 点改修**: (1) env var rename `HUB_SHARED_SECRET` → `HUB_SERVICE_INFO_SECRET` (全サービス共通シークレット統一)、(2) `iconUrl?: string` を ServiceInfo に追加 (HUB ダッシュボードでアイコン表示用)、(3) `schemaVersion=2` bump。波及: PREREQUISITES.md §1 + concept.md §6 同期。

## 2. 変更前 vs 変更後

### 2.1 UC 変更
| UC ID | 変更前 | 変更後 | 理由 |
|---|---|---|---|
| UC-SI-1 (HUB pull → service-info) | HUB が `GET /api/hub/service-info` を Bearer `HUB_SHARED_SECRET` で叩く → v1 payload (`schemaVersion=1, service, status, generatedAt, version?`) | 同 endpoint を Bearer `HUB_SERVICE_INFO_SECRET` で叩く → v2 payload (`schemaVersion=2, service, status, generatedAt, version?, iconUrl?`) | O48 v2 改訂で全サービス共通シークレット + favicon-projection を加える |

### 2.2 入出力変更
| 対象 | 変更前 | 変更後 | 互換性 |
|---|---|---|---|
| **env var**: `HUB_SHARED_SECRET` | shipyard 内部のみで使用 (Bearer 検証) | **`HUB_SERVICE_INFO_SECRET`** に rename。HUB が送る Bearer 値自体は同じ string (運用者が同値設定すれば wire 互換) | 内部 (shipyard 内 env + .env*.example) **非互換 = env update 必須**、wire (Bearer 値) は互換 |
| **HTTP response body** (`/api/hub/service-info`) | `{ schemaVersion: 1, service: "shipyard", status: "up", generatedAt: ISO8601, version?: string }` | `{ schemaVersion: 2, service: "shipyard", status: "up", generatedAt: ISO8601, version?: string, iconUrl?: string }` | **完全 additive** (iconUrl optional、HUB v1 receiver は無視可能)。schemaVersion=2 bump で HUB が v2 解釈可能 |
| **`serviceInfoPayload()` signature** | `(now?: Date, version?: string) => ServiceInfo` | `(now?: Date, version?: string, siteUrl?: string) => ServiceInfo` — `siteUrl` 指定時に `iconUrl = siteUrl + "/icon.svg"` を payload に含める | **内部呼び出し側互換** (siteUrl 省略可、省略時は iconUrl 不在 = v1 同等)。route.ts 側で `process.env.SITE_URL` を渡す |
| **`isAuthorizedHub()` signature** | `(authHeader: string \| null, secret: string \| undefined) => boolean` | 同上 (no change) | 互換 |

### 2.3 データモデル変更
| エンティティ | 変更内容 | マイグレーション要否 |
|---|---|---|
| `ServiceInfo` (TypeScript interface) | `schemaVersion: 1` → `schemaVersion: 2`、`iconUrl?: string` 追加 | **不要** (TS interface のみ、DB 影響なし) |

### 2.4 バリデーション・エラー変更
| 対象 | 変更前 | 変更後 |
|---|---|---|
| iconUrl format | (存在しない) | `siteUrl` 引数の HTTPS prefix + 公開ホスト前提 (内部生成のため format check は不要、SSRF 予防は HUB 受信側 `isSafePublicUrl` で担保 = perspectives.md O48 recommend_when_missing で明文化済) |

## 3. 影響範囲

| 対象 | 影響度 | 説明 |
|---|---|---|
| `lib/hub/service-info.ts` | **高** | ServiceInfo interface + serviceInfoPayload() 改修 |
| `app/api/hub/service-info/route.ts` | **高** | env var rename + siteUrl propagation |
| `lib/hub/service-info.test.ts` | **高** | env name + iconUrl 検証 + schemaVersion=2 |
| `.env.example` + `.env.development.example` + `.env.production.example` | **高** | `HUB_SHARED_SECRET` → `HUB_SERVICE_INFO_SECRET` rename |
| `.env.development.local` + `.env.production.local` | **高** | 同上 (.env*.local は gitignore、運用者手動 rename、本 revise 対象外だが Release gate Phase 1 FILL で確認) |
| `docs/PREREQUISITES.md` §1 | **中** | `HUB_SERVICE_INFO_SECRET` 行追加 (現在は HUB_STATUS_URL のみ、service-info producer 用 secret 未掲載) |
| `docs/concept.md` §6 | **中** | service-info 行の `HUB_SHARED_SECRET` → `HUB_SERVICE_INFO_SECRET` rename + `schemaVersion=2` + `iconUrl?` 言及 |

## 4. 後方互換性

- **互換維持**: ✅ (wire レベル) / ❌ (env var 名、shipyard 内部のみ)
- **詳細**:
  - **HTTP API 互換**: response body は additive (iconUrl optional + schemaVersion=2 bump)、HUB v1 receiver は完全互換で受信可能 (perspectives.md O48 で「HUB 受信側は v1 完全許容、producer 順次対応可」明文化)
  - **wire (Bearer 値)**: 互換 (運用者が `HUB_SERVICE_INFO_SECRET` に旧 `HUB_SHARED_SECRET` と同値を設定すれば HUB 側無変更で疎通可)
  - **shipyard 内部 env**: 非互換 (env var rename = .env*.local 手動更新必須、Release gate Phase 1 FILL で実施)
- **移行期間**: なし (即時切替、本 revise = 単発 retrofit)
- **HUB 側対応**: 不要 (本 revise は producer のみ、HUB 側は既に v2 receiver 準備済 = perspectives.md O48 学習ログ確認)

## 5. ロールバック方針

- **コード revert で戻せる**: ✅
- **DB マイグレーションのロールバック**: **不要** (DB 影響なし)
- **手順**:
  1. `git revert <本 revise commit>` で `lib/hub/service-info.ts` + route + test + .env*.example が v1 に戻る
  2. `.env*.local` の `HUB_SERVICE_INFO_SECRET` を `HUB_SHARED_SECRET` に rename (運用者手動)
  3. 再デプロイ
- **想定所要時間**: 5 分

## 6. リリース戦略

- **方式**: **一括** (本 revise + tdd → Release Phase 3 デプロイで切替)
- **フィーチャーフラグ**: 不要 (API additive のため、新旧 receiver 共存可能)
- **ロールアウト計画**:
  1. 設計 + tdd (本 revise セッション内、Class A auto-pick)
  2. release-pre 必須監査 再実行 (CF-20260528-009、retrofit 後の HEAD で full audit + secure)
  3. Release Phase 3 デプロイ (.env.production.local の HUB_SERVICE_INFO_SECRET 設定 → vercel env update → preview → prod)
- **想定**: 1 セッション内で全工程完了

## 7. 詳細仕様 (新仕様)

### 7.1 詳細 UC (新仕様)

#### UC-SI-1: service-hub からの service-info pull (v2 favicon-projection)

| 項目 | 内容 |
|---|---|
| トリガ | service-hub Cron が `GET https://shipyard.<domain>/api/hub/service-info` を Authorization Bearer `<HUB_SERVICE_INFO_SECRET>` で叩く |
| 前提 | env `HUB_SERVICE_INFO_SECRET` 設定済 (Release gate Phase 1 FILL で確認)、env `SITE_URL=https://shipyard.<domain>` 設定済 (既存)、`app/icon.svg` 配線済 (O56 D014) |
| 主シーケンス | (1) route.ts が Authorization header を取得 → (2) `isAuthorizedHub(header, process.env.HUB_SERVICE_INFO_SECRET)` で検証 → (3) **不一致なら 401** / 一致なら (4) `serviceInfoPayload(undefined, process.env.npm_package_version, process.env.SITE_URL)` を呼び出し → (5) **200 + JSON `{ schemaVersion: 2, service: "shipyard", status: "up", generatedAt: <now ISO>, version?: <pkg version>, iconUrl: "https://shipyard.<domain>/icon.svg" }`** を返す |
| 異常系 | env 未設定 (secret undefined) → `isAuthorizedHub` が false → 401 |
| KPI | レスポンス < 100ms (純ロジック + Next.js serverless cold start 除く) |

### 7.2 入出力 (新仕様)

| 種別 | 仕様 |
|---|---|
| Request | `GET /api/hub/service-info` + `Authorization: Bearer <HUB_SERVICE_INFO_SECRET>` |
| Response 200 | `{ schemaVersion: 2, service: "shipyard", status: "up", generatedAt: "<ISO 8601>", version?: "<pkg version>", iconUrl: "<SITE_URL>/icon.svg" }` |
| Response 401 | `{ error: "unauthorized" }` |
| Cache | `dynamic = "force-dynamic"` (既存維持、HUB が新鮮値を期待) |

### 7.3 データモデル (新仕様)

```ts
export interface ServiceInfo {
  schemaVersion: 2;                  // v2 bump
  service: string;                   // "shipyard"
  status: "up" | "down" | "unknown"; // 現状は固定 "up"
  generatedAt: string;               // ISO 8601
  version?: string;                  // package.json version
  iconUrl?: string;                  // v2 新規: producer favicon 絶対 URL
  extra?: Record<string, unknown>;   // 既存維持 (現未使用)
}
```

### 7.4 バリデーション・エラー (新仕様)

| 項目 | 内容 |
|---|---|
| auth | Bearer + 完全一致のみ通過 (timing-safe な比較は将来検討、現状 string === で OK、`isAuthorizedHub` 既存ロジック維持) |
| iconUrl format | producer 内部生成 (`SITE_URL + "/icon.svg"`) で SSRF リスクなし。HUB 受信側で `isSafePublicUrl` check が担保 (perspectives.md O48 v2 spec) |
| schemaVersion | hardcode `2` (literal type で型保護、誤 1 設定を防止) |

### 7.5 機能固有 NFR + 既存連携 (新仕様)

| 項目 | 内容 |
|---|---|
| 互換性 | HUB v1 receiver は iconUrl 無視可能、HUB v2 receiver は iconUrl を取得して dashboard 表示 |
| 認証 | 全サービス共通シークレット 1 本に統一 ([D20260528-002] 秘密ゼロ化)、shipyard 固有 token 廃止 |
| favicon | 既存 `app/icon.svg` を Next.js が自動 serve、追加配線不要 (O56 D014 で配線済) |
| version | `package.json` の `version` field を `process.env.npm_package_version` 経由で取得 (Next.js が自動公開、build 時 inject) |

## 8. タグ別追加項目

### contract-revise
- producer-only 改修、HUB receiver 改修不要 (HUB は既に v2 receiver 準備済)
- 契約 SoT = service-hub 側の v2 spec (perspectives.md O48 学習ログ CF-20260528-019)

### no-migration
- DB スキーマ変更なし、データ移行なし、設定ファイル rename のみ
- Phase 5 REVISE_MIGRATION は生成不要

### additive-extension
- HTTP API は完全 additive (iconUrl optional + schemaVersion=2 bump)
- 旧 receiver (v1) との後方互換性が技術的に保証される

## 9. 未決事項

現時点で論点なし (2026-05-28)。perspectives.md O48 v2 spec が SoT として確定済、retrofit 内容も spec から機械的に導出可能。

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 (AUDIT-perspective-001 撃ち落とし、auto-pick) | /flow:revise |
