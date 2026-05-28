# service-status 単体テスト計画 (service-icons)

> **入力**: [`./001_REVISE_SPEC.md`](./001_REVISE_SPEC.md), [`./002_REVISE_PLAN.md`](./002_REVISE_PLAN.md), [`../003_service-status_UNIT_TEST.md`](../003_service-status_UNIT_TEST.md) + lib/hub/hub.test.ts (commit 7e775a1)
> **最終更新**: 2026-05-28

---

## 1. 追加テストケース

### 1.1 正常系

| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| **U-IC1** | contract (`lib/hub/contract.ts`) | `{slug, name, url, status, iconUrl: "https://cdn.example.com/icon.png"}` | parse 成功、iconUrl 保持 |
| **U-IC2** | StatusCard (icon 表示) <!-- spec-review R2: 表示集約は StatusCard --> | `service={...iconUrl: "https://cdn.example.com/icon.png"}` で render | `<img src="https://cdn.example.com/icon.png" alt="" role="presentation">` が DOM に存在 <!-- spec-review R4: 装飾画像 alt="" --> |
| **U-IC3** | StatusCard (フォールバック) | `service={...iconUrl: undefined}` で render | `<img>` なし、`<div>` にイニシャル 1 文字 (`Array.from(name)[0]`) + `var(--color-brand-bg-soft)` 背景 (design SoT §6) <!-- spec-review D1 --> |
| **U-IC4** | StatusCard (読み込み失敗) | `<img>` の `onError` 発火を simulate | フォールバック `<div>` イニシャル表示に切替 (React state、`useState<boolean>`) |
| **U-IC5** | repository (`statusCache.ts`) | `upsertMany([{...iconUrl: "https://..."}])` | DB INSERT で `icon_url` 列に値保存される (Drizzle mock or pglite)、**明示列挙 mapping 漏れの機械担保** <!-- spec-review R1 --> |
| **U-IC6** | (削除、R7) | — | 既存 hub.test.ts U-3 を拡張 (§2 参照) — mockRepo パターン尊重で重複回避 <!-- spec-review R7 --> |
| **U-IC11** | StatusListItem 型 + StatusCardService 型 | typecheck (型レベル) | iconUrl?: string \| null フィールドを受け入れる、`$inferSelect` 経由で listAll 戻り値型も iconUrl 含有 <!-- spec-review R2 --> |

### 1.2 異常系

| ID | 対象 | 失敗条件 | 期待振る舞い |
|---|---|---|---|
| **U-IC7** | contract (graceful) <!-- spec-review R3 --> | iconUrl が無効 URL (`"not-a-url"`) | `.catch(undefined)` で iconUrl のみ undefined に降格、**service エントリは保持** (graceful、他 field 維持) |
| **U-IC8** | contract (graceful) <!-- spec-review R3 --> | iconUrl が空文字 `""` | `.catch(undefined)` で iconUrl のみ undefined に降格、service エントリは保持 |

### 1.3 境界値

| ID | 対象 | 境界 | 期待振る舞い |
|---|---|---|---|
| **U-IC9** | StatusList | service name が空文字 (`name=""`) かつ iconUrl 不在 | フォールバック表示は `?` or 空表示 (defensive、name 空は本来 service-hub 側でも reject 想定) |
| **U-IC10** | StatusList | service name が絵文字 (`name="🌸花メモ"`) かつ iconUrl 不在 | イニシャル 1 文字 = 絵文字 (UTF-8 grapheme cluster 注意、簡易対応として `Array.from(name)[0]` で抽出) |

## 2. 修正テストケース

| ID | 対象 | 修正前 | 修正後 | 理由 |
|---|---|---|---|---|
| (既存) U-1〜U-7 service-status.test.tsx | 構造 / 状態 / EmptyState 等 | 既存 7 件アサーション (icon 関連なし) | **変更なし** | 既存テストは icon 関連 assertion を持たないため後方互換 |
| (既存) hub.test.ts U-1〜U-C2 | contract / fetch / refresh | 既存 14 件 (commit 7e775a1 で 12→14) | **U-3 拡張** (cache.ts refresh で hub レスポンスに iconUrl 含む場合、upsertMany 引数 rows[0].iconUrl が正しく渡されることを assert) + U-C3 新規 (iconUrl 含む parse) | mockRepo パターン尊重 + cache.ts mapping 漏れの機械担保 <!-- spec-review R1 + R7 --> |

## 3. 削除テストケース

| ID | 対象 | 削除理由 |
|---|---|---|
| (なし) | — | — |

## 4. リグレッション強化

- **既存テスト維持**: service-status.test.tsx 7 件 + hub.test.ts 14 件 + repositories.test.ts (statusCache 関連) 全て pass 維持。
- **追加チェック**:
  - U-IC7/U-IC8 で「無効 URL は strip」を恒久ガード (悪意あるレスポンスから shipyard を守る、SEC 観点)
  - U-IC1 で「optional フィールドが正しく parse される」 = 後方互換性の機械的担保 (service-hub が iconUrl 含めない期間も graceful)

## 5. Mock 方針差分

| 対象 | 前回 | 今回 | 理由 |
|---|---|---|---|
| service-hub レスポンス mock (hub.test.ts) | iconUrl なし | iconUrl ありの fixture を 1 件追加 (U-IC1) | 実 service-hub 改訂版相当を test |
| StatusCacheRepo mock (service-status.test.tsx) | iconUrl なし | iconUrl あり / 不在の 2 fixture | UI 表示 / フォールバック両方を test |
| ブラウザ `<img>` onError (U-IC4) | — | `fireEvent.error()` で simulate (React Testing Library) | 読み込み失敗時のフォールバック切替を test |

## 6. カバレッジ目標

| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | 既存継承 |
| 分岐 | 70% | 既存継承 |
| **新規 ServiceIcon (外出し時)** | 100% | 純データ + 3 分岐 (iconUrl あり/不在/読み込み失敗) |

## 7. 更新履歴

| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 | /flow:revise |
