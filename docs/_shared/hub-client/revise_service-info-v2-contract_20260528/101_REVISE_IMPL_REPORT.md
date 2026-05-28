# 実装レポート: _shared/hub-client service-info-v2-contract retrofit

## 実装日時
2026-05-28 20:20 (JST)

## モード
revise (AUDIT-perspective-001 撃ち落とし、O48 v2 favicon-projection 契約 retrofit)

## 関連ドキュメント
- [001_REVISE_SPEC.md](./001_REVISE_SPEC.md) — 変更仕様書
- [002_REVISE_PLAN.md](./002_REVISE_PLAN.md) — 変更計画書
- [003_REVISE_UNIT_TEST.md](./003_REVISE_UNIT_TEST.md) — 単体テスト計画
- [004_REVISE_E2E_TEST.md](./004_REVISE_E2E_TEST.md) — E2E テスト計画
- [AI_LOG D20260528_022_tdd__shared_hub-client_revise_service-info-v2-contract.md](../../AI_LOG/D20260528_022_tdd__shared_hub-client_revise_service-info-v2-contract.md)
- AUDIT_20260528_2000.md §3.2 [AUDIT-perspective-001]
- perspectives.md O48 (CF-20260528-010 + CF-20260528-019)

## 注意事項
本レポートのファイルパスと行番号は実装日時時点のものです。以後の変更により行番号がずれる場合があります。

## 変更一覧

### Phase 1: producer ロジック retrofit + env rename (commit `11b3d8d`)

#### `lib/hub/service-info.ts` (改修)
- `ServiceInfo` interface 改修:
  - `schemaVersion: 1` → `schemaVersion: 2` (literal type で型保護)
  - `iconUrl?: string` 追加 (v2 favicon-projection、コメントで意図明示)
  - 既存 `version?` / `extra?` 維持
- `serviceInfoPayload(now, version?, siteUrl?)` signature 拡張:
  - 第3引数 `siteUrl?: string` 追加
  - siteUrl 指定時に `iconUrl: ${siteUrl}/icon.svg` を payload に含める (spread + 条件式)
  - siteUrl 省略時は iconUrl プロパティ不在 (v1 互換 path)
- コメント rename: `HUB_SHARED_SECRET` → `HUB_SERVICE_INFO_SECRET`、CF-20260528-019 言及追加

#### `lib/hub/service-info.test.ts` (改修)
- describe ブロック名 v2 化
- `serviceInfoPayload (v2)`:
  - 「最小固定契約 v2」test: `schemaVersion: 2` を expect
  - 「version は optional」test: 既存維持
  - 「siteUrl 指定時に iconUrl を組み立てる」**新規 U-V2-1**: `iconUrl === "https://shipyard.example.com/icon.svg"` 検証
  - 「siteUrl 省略時に iconUrl は不在」**新規 U-V2-2**: `.not.toHaveProperty("iconUrl")` 検証 (version 指定有/無 両方)
- `isAuthorizedHub (HUB_SERVICE_INFO_SECRET v2)`:
  - test name rename
  - 既存 4 ケースは挙動変更なし

#### `app/api/hub/service-info/route.ts` (改修)
- env 参照: `process.env.HUB_SHARED_SECRET` → `process.env.HUB_SERVICE_INFO_SECRET`
- `serviceInfoPayload()` 呼び出し: `serviceInfoPayload(undefined, process.env.npm_package_version, process.env.SITE_URL)` に拡張
  - 第1引数 undefined = デフォルト Date()
  - 第2引数 = Next.js が自動 inject する package version (現状 undefined のため optional 維持)
  - 第3引数 = SITE_URL env で iconUrl 自動生成
- コメント rename + v2 言及

#### `.env.example` / `.env.development.example` / `.env.production.example` (3 ファイル改修)
- `HUB_SHARED_SECRET=...` → `HUB_SERVICE_INFO_SECRET=...` rename
- コメント追加: 「全サービス共通シークレット 1 本」「旧 HUB_SHARED_SECRET / per-service token は廃止」「CF-20260528-019 v2 favicon-projection 改訂」

### Phase 2: ドキュメント同期 (本 commit)

#### `docs/PREREQUISITES.md` §1 (改修)
- 表に新 row 追加: `service-hub service-info (O48 v2)` / `HUB_SERVICE_INFO_SECRET` / 用途・取得方法 (`openssl rand -hex 32` → HUB に同値) を明示
- 既存 `HUB_STATUS_URL` row は維持 (consumer 側、別系統)

#### `docs/concept.md` §6 (line 438 改修)
- service-info row の env 名: `HUB_SHARED_SECRET` → `HUB_SERVICE_INFO_SECRET`
- 説明追記: `schemaVersion=2`、`iconUrl` favicon-projection、全サービス共通シークレット
- CF-20260528-019 v2 改訂反映を明示

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | なし |
| 計画から省略した変更 | なし (全 7 ファイル + 2 ドキュメント = PLAN §1 通り) |
| 想定外の問題と対処 | なし (auto-pick で機械的に完遂、O48 v2 spec が SoT として明確だったため Class C 衝突なし) |

## PR Description

### タイトル
_shared/hub-client: service-info v2 (favicon-projection) 契約 retrofit (HUB_SERVICE_INFO_SECRET + iconUrl)

### 概要
AUDIT_20260528_2000 §3.2 [AUDIT-perspective-001] の唯一の High finding (O48 v2 契約 drift) を撃ち落とすための retrofit。perspectives.md O48 (CF-20260528-010 + CF-20260528-019) で 2026-05-28 改訂された v2 favicon-projection 契約に shipyard producer 側 (`lib/hub/service-info.ts` + `app/api/hub/service-info/route.ts` + .env*) を追従させる。Release Phase 3 デプロイ前必須。

### 変更内容
- ServiceInfo interface: `schemaVersion: 1` → `2`、`iconUrl?: string` 追加
- serviceInfoPayload(now, version?, siteUrl?) signature 拡張: siteUrl 指定時に `iconUrl = ${siteUrl}/icon.svg` 自動組み立て
- route.ts: `process.env.HUB_SHARED_SECRET` → `process.env.HUB_SERVICE_INFO_SECRET` rename、SITE_URL + npm_package_version 渡し
- env files 3 つ全 rename
- test: schemaVersion=2 反映、iconUrl set/unset の 2 新規 test、env name rename
- docs/PREREQUISITES.md §1 + docs/concept.md §6 同期

### 後方互換性
- HTTP API: **完全 additive** (iconUrl optional + schemaVersion=2 bump)、HUB v1 receiver は無視可能
- wire: 互換 (運用者が新 env 名に旧と同値設定すれば HUB 側無変更で疎通)
- 内部 env: 非互換 (.env\*.local 手動 rename 必須、Release Phase 1 FILL で確認)

### テスト
- npm run test -- --run: **176/176 GREEN** (174 → +2 net = iconUrl set + unset)
- grep HUB_SHARED_SECRET in lib/+app/+.env*.example: **0 件** (歴史言及コメントは保持)
- grep HUB_SERVICE_INFO_SECRET in new code + env*.example + docs/PREREQUISITES + docs/concept §6: **検出済 ✓**

### Release 前の手順
1. release-pre 必須監査 再実行 (`/flow:audit --scope=full` → `/flow:secure`)
2. `.env.development.local` + `.env.production.local` の env 名手動 rename (運用者、Release gate Phase 1 FILL)
3. Vercel env: `HUB_SHARED_SECRET` 削除 + `HUB_SERVICE_INFO_SECRET` 同値で新規作成
4. Preview → Production デプロイ
5. HUB から `GET /api/hub/service-info` 実 pull で 200 + iconUrl 受信確認
