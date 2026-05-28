# service-status 変更仕様書 (service-icons — service-hub から各サービスのアイコン情報を受け取り表示)

> **改修種別**: 機能拡張 (UI + データモデル + 外部契約消費)
> **issue / slug**: service-icons / icon-from-service-hub
> **基準 SPEC**: [`../001_service-status_SPEC.md`](../001_service-status_SPEC.md)
> **最終更新**: 2026-05-28
> **タグ**: feature (UI)
> **AI_LOG**: [D20260528_009_revise_service-status_service-icons](../../AI_LOG/D20260528_009_revise_service-status_service-icons.md)

---

## 1. 変更概要

service-hub の公開 status API レスポンスに新規追加される `iconUrl` フィールドを shipyard 側で受信し、稼働サービス一覧 (StatusList) に各サービスのアイコン (favicon / プロダクトロゴ等の CDN 画像) を表示する。視覚的識別性向上 + 信頼感強化 (concept §1.1 UC#1「稼働一覧を見て信頼する」)。**iconUrl 不在時は service 名イニシャル 1 文字 + ブランドカラー背景でフォールバック表示** (charter §2.2 + design SoT §6 ボイス、撤退コストゼロ)。

## 2. 変更前 vs 変更後

### 2.1 UC 変更

| UC ID | 変更前 | 変更後 | 理由 |
|---|---|---|---|
| UC-S1 | 出力: 各サービスの状態ドット + 名前 + 稼働日数 + → | 出力: 同上 + **各サービスのアイコン (左端、24-32px)** — iconUrl 配信時は `<img>`、不在時はイニシャル 1 文字 + ブランドカラー背景の正方形 | concept §1.1 UC#1 視覚的識別性向上、信頼感強化 |
| UC-S2 | 個別サービス遷移 (StatusCard クリック → 外部 url) | **変更なし** (icon タップでも同じ遷移、tap target 拡大効果) | — |
| UC-S5 | Cron で refresh | **変更なし** (refresh 対象に iconUrl 含まれる、cache.ts で transparent に保存) | — |

### 2.2 入出力変更

| 対象 | 変更前 | 変更後 | 互換性 |
|---|---|---|---|
| `GET /api/services` レスポンス | `[{slug, name, url, status, since?, lastCheckedAt?, fetchedAt}, ...]` | `[{slug, name, url, status, since?, lastCheckedAt?, **iconUrl?**, fetchedAt}, ...]` | 互換維持 (新フィールド optional、既存 client は無視可) |
| service-hub からの fetch (`HUB_STATUS_URL`) | `Service[]` (camelCase、lastCheckedAt) | `Service[]` (camelCase) + **iconUrl optional 追加** | service-hub 側の contract 改訂後、shipyard contract.ts で受信可能に (Zod optional) |

### 2.3 データモデル変更

| エンティティ | 変更内容 | マイグレーション要否 |
|---|---|---|
| `service_status_cache` | 新規カラム **`icon_url text NULL`** 追加 (drizzle field `iconUrl`) | ✅ 要 (Phase 5 `005_REVISE_MIGRATION.md` 参照、drizzle で `ALTER TABLE service_status_cache ADD COLUMN icon_url text`) |

### 2.4 バリデーション・エラー変更

| 対象 | 変更前 | 変更後 |
|---|---|---|
| S-E3 status 不明値 | 'unknown' フォールバック | **変更なし** |
| (新規) **icon URL 無効** (z.string().url() で reject) | — | `.catch(undefined)` で graceful (iconUrl のみ undefined に降格、service エントリは保持してフォールバック表示) <!-- spec-review R3: 元 service エントリ全体 strip は UX 過剰反応、.catch(undefined) で graceful 化、SEC は他 field validate で担保 --> |
| (新規) **icon 画像読み込み失敗** (ブラウザ側 `<img>` onerror) | — | フォールバック (イニシャル) に切替 (client 側 React state) |

## 3. 影響範囲

| 対象 | 影響度 | 説明 |
|---|---|---|
| 機能 `service-status` | 高 | 直接対象 — StatusList component + cache + contract |
| 横断 `_shared/hub-client` (`lib/hub/contract.ts` + `cache.ts`) | 高 | contract に iconUrl 追加、cache.ts で DB 保存 |
| 横断 `_shared/db` (`lib/db/schema.ts` + `repositories/statusCache.ts`) | 高 | テーブル schema + repo の型に iconUrl 追加 |
| 機能 `landing` | 低 | StatusList を埋め込むだけ、コード変更なし (icon 表示は StatusList 内部で完結) |
| **外部 service-hub PJ** | **高** (前提依存) | producer 側 contract 改訂が **前提**、CF-016 連動改修対象 |

## 4. 後方互換性

- **互換維持**: ✅
- 理由:
  - iconUrl は **optional フィールド** (Zod `z.string().url().optional()`、DB column nullable)
  - 既存 service-hub レスポンス (iconUrl 不在) で動作 → undefined → DB に NULL 保存 → UI でフォールバック表示
  - 既存 client (もし `/api/services` を外部から叩く第三者があれば) は新フィールドを無視可能
  - 既存 cache 行は NULL のまま、refresh 時に iconUrl が含まれていれば update

## 5. ロールバック方針

- **コード revert で戻せる**: ✅ (ただし DB column 残存)
- **DB マイグレーションのロールバック**: ✅ 有 (`005_REVISE_MIGRATION.md` §3 逆操作 SQL = `ALTER TABLE service_status_cache DROP COLUMN icon_url`)
- **手順**:
  1. `git revert <commit hash>` で contract / schema / cache / StatusList を巻き戻し
  2. drizzle migration rollback で column 削除
  3. dev branch (Phase 1) または本番 main branch (本番化時) で apply
- **副作用**: 既存 row への影響なし (他フィールド維持、column 削除のみ)

## 6. リリース戦略

- **方式**: 一括
- **フィーチャーフラグ名**: 不要
- **理由**: フィーチャーフラグ不要 (icon 不在 = フォールバック表示で graceful)。本 PJ は無課金 LP + 単一運用者で段階展開のリスク管理不要。
- **ロールアウト計画**:
  1. **service-hub PJ 側 contract 改訂** (別 revise、shipyard より前): producer 側で iconUrl をレスポンスに含める
  2. shipyard PJ Phase 1 = drizzle migration (Neon dev branch に `ALTER TABLE` apply、`! npm run db:migrate`)
  3. shipyard PJ Phase 2 = contract.ts + cache.ts + statusCache.ts + StatusList.tsx 更新
  4. テスト green 確認 (`/flow:tdd` で 101/102 生成)
  5. ローカル動作確認 (`! bash scripts/cron-refresh.sh` → LP で icon 表示確認)
  6. 本番デプロイ前に本番 main branch にも drizzle migration apply (Phase 3 release で実施)

## 7. 詳細仕様 (新仕様)

### 7.1 詳細 UC (新仕様)

#### UC-S1: 稼働一覧を見て信頼する (改修版)

- **トリガー**: トップ表示 (landing が StatusList を埋込) or `/services`
- **処理**: `getCachedStatus()` → StatusCard 一覧
  - 各 StatusCard 左端に **アイコン領域 (32×32px、丸角 8px)**:
    - `iconUrl` あり → `<img src={iconUrl} alt="" role="presentation" loading="lazy" onerror={fallback}>` <!-- spec-review R4: 装飾画像 alt="" (name は隣接 text で a11y name 担保、WCAG 1.1.1) -->
    - `iconUrl` 不在 / 読み込み失敗 → `<div>` に **service 名イニシャル 1 文字** (UTF-8 1 文字、`name.slice(0,1)`) + **ブランドカラー背景** (design SoT トークン `--color-brand-bg-soft` 等、固定 1 色)
  - 右側に 状態ドット + name + 稼働日数 + → 矢印
- **出力**: 各サービスが視覚的に区別可能 + 状態 + 名前
- **例外**: 0 件 / 取得不可 → EmptyState (**変更なし**)

#### UC-S2 / UC-S5: **変更なし**

### 7.2 入出力 (新仕様)

#### 7.2.1 API

| メソッド | パス | 入力 | 出力 | 認証 |
|---|---|---|---|---|
| GET | `/api/services` | — | `[{slug, name, url, status, since?, lastCheckedAt?, **iconUrl?**, fetchedAt}, ...]` | 不要 |
| GET | `/api/cron/refresh-status` | Cron header | `{ok, updated}` | CRON_SECRET |

### 7.3 データモデル (新仕様)

| field | 型 | 制約 | 備考 |
|---|---|---|---|
| (既存) slug / name / url / status / since / lastCheckedAt / fetchedAt | 既存型 | 変更なし | — |
| **iconUrl** (新規) | text | nullable | service-hub から受信した CDN URL、null = フォールバック |

drizzle schema:
```ts
export const serviceStatusCache = pgTable("service_status_cache", {
  // ...既存...
  iconUrl: text("icon_url"), // nullable
});
```

### 7.4 バリデーション・エラー (新仕様)

- S-E1〜S-E3 (既存): **変更なし**
- **新規 S-E4**: service-hub レスポンスの iconUrl が無効 URL (`z.string().url()` reject) → `.catch(undefined)` で iconUrl のみ undefined に降格、service エントリは保持してフォールバック表示 (graceful、PII なし) <!-- spec-review R3: 元 service エントリ全体 strip は UX 過剰反応 -->
- **新規 S-E5**: ブラウザ `<img>` 読み込み失敗 (404 / ネットワークエラー / CORS 等) → client 側 React state で `<div>` フォールバック (イニシャル) に切替

### 7.5 機能固有 NFR + 連携 (新仕様)

| 項目 | 目標 | 根拠 |
|---|---|---|
| HUB 負荷 | 画面は cache のみ、HUB は cron 経由 | **変更なし** |
| 可用性 | HUB ダウン時も最終既知 status (icon 含む) を表示 | **変更なし** |
| 安全性 | 安全サブセットのみ表示 (内部指標非表示) | **変更なし**、iconUrl は公開情報のみ |
| **icon 読み込み性能 (新規)** | `loading="lazy"` + CDN 画像 + 32×32px なら 1 画像 < 5KB 想定 + ブラウザ image cache 活用 | LCP/CWV 影響を最小化 |
| **icon フォールバックトーン** | イニシャル 1 文字 + ブランドカラー背景 (controlled、シンプル、誠実) | charter §2.2 + design SoT §6 ボイス + 撤退コストゼロ |
| **連動改修対象 (CF-016 (F))** | YES = service-hub PJ (producer 側 contract に iconUrl 追加が前提) | CF-20260528-016 |

連携: `_shared/hub-client` (contract + cache に iconUrl 追加) / `_shared/db` (schema + repo に iconUrl 追加) / `_shared/ui` (StatusCard component が icon 表示 region を持つ) / `landing` (StatusList を埋込、変更なし)

## 8. タグ別追加項目

- **feature (UI)**: 視覚レビュー (O34) は Phase 3 `/flow:design --review-only` で実施。icon 表示 + フォールバック両方を視覚確認。

## 9. 未決事項

### [論点-007] icon フォールバック背景色のデザイントークン — **accepted (spec-review D1)**
- **影響範囲**: design/design-system.md (既存 `--color-brand-bg-soft` 流用)
- **結論 (2026-05-28 spec-review D20260528-039 D1)**: 案 A 単一色 (`var(--color-brand-bg-soft)`) 採用、design SoT §6 ミニマル路線整合。実装は StatusCard.tsx 内インライン JSX (R2 + D4)。
- **判断期限**: 解消済
- **担当**: seiji <!-- spec-review D1: 案 A 単一色採用、design SoT §6 ミニマル路線整合 -->

## 10. 更新履歴

| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 — CF-016 (F) 連動改修対象 = service-hub PJ | /flow:revise |
