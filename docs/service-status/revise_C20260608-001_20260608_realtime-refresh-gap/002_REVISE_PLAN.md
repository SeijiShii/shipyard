# service-status 変更計画書（リアルタイム鮮度: read-through refresh）

> **入力**: `./001_REVISE_SPEC.md`, `../../concept.md` §1.4, Step 2 で読んだ既存実装（lib/hub/cache.ts, client.ts, statusCache.ts, lib/service-status/{load,api}.ts, app/api/services, app/page.tsx, features/service-status/StatusList.tsx）
> **最終更新**: 2026-06-08

---

## 1. 既存ファイル変更一覧

| ファイル | 変更内容（概要） | リスク | 関連 SPEC § |
|---|---|---|---|
| `lib/hub/cache.ts` | `getCachedStatus` を残しつつ、新規 `getStatusReadThrough(deps)` を追加（listAll → 最新 fetchedAt が TTL 超 & throttle 未抑制なら refreshStatusCache 試行 → 再 listAll、失敗時は前回値）。TTL/now/fetchStatus injectable。module-level throttle 変数 | 中（stampede / 二重 fetch）→ TTL gate + throttle で緩和 | §7.1 UC-S5' |
| `lib/service-status/load.ts` | `loadStatusSafe` を `getCachedStatus` → `getStatusReadThrough` 呼び出しに変更（try/catch graceful は維持） | 低（例外は従来通り空配列） | §2.2 |
| `app/api/services/route.ts` | `getCachedStatus` → `getStatusReadThrough`。レスポンスに `syncedAt`（最新 fetchedAt の ISO, 0 件 null）を追加 | 低（additive） | §7.2 |
| `app/page.tsx` | `loadStatusSafe` の戻りから最新 fetchedAt を算出し `StatusList` に `syncedAt` を渡す | 低 | §7.2.1 |
| `app/services/page.tsx` | 同上（`syncedAt` を算出して渡す） | 低 | §7.2.1 |
| `features/service-status/StatusList.tsx` | `syncedAt?: Date \| string \| null` prop 追加。非 0 件かつ syncedAt 有時に「{日時}現在」を控えめ表示。EmptyState 時は非表示 | 低（prop 追加・省略時非表示で後方互換） | §7.2.1 |

## 2. 新規ファイル一覧

| ファイル | 責務 | 依存 | LOC 見積 |
|---|---|---|---|
| `lib/service-status/syncedAt.ts` | 最終同期日時の算出（rows → 最大 fetchedAt）+「{日時}現在」整形（JST、純関数、テスト容易） | なし | ~30 |
| `lib/service-status/syncedAt.test.ts` | 上記の単体テスト | vitest | ~50 |
| `lib/hub/readThrough.test.ts`（または cache.test.ts へ追記） | read-through 分岐（fresh skip / stale refresh / fetch 失敗 graceful / throttle）の単体テスト | vitest, mock fetchStatus | ~80 |

## 3. 削除ファイル一覧

| ファイル | 削除理由 | 代替 |
|---|---|---|
| （なし） | | |

## 4. マイグレーション要否

- DB スキーマ変更: ❌（既存 `fetchedAt` を流用）
- 既存データ変換: ❌
- 設定ファイル変更: ⚠ env `STATUS_REFRESH_TTL_SEC`（任意、未設定時 3600）を `.env.*.example` に追記
- ストレージパス変更: ❌
- → **Phase 5 MIGRATION 不要**

## 5. 実装 Phase 分割（`/flow:tdd-phase` 連携）

### Phase 1: read-through コア（lib/hub）
- 対象: `lib/hub/cache.ts` `getStatusReadThrough` + テスト
- ゴール: fresh=fetch しない / stale=refresh して最新返す / fetch 失敗=前回値（graceful） / throttle で連続 fetch 抑制、を単体 GREEN
- TTL は env `STATUS_REFRESH_TTL_SEC`（既定 3600）、`now`/`fetchStatus` injectable（O35）

### Phase 2: 配信経路結線（load / api）
- 対象: `lib/service-status/load.ts`, `app/api/services/route.ts`
- ゴール: loadStatusSafe と /api/services が read-through 経由。/api/services が `syncedAt` を返す。既存テスト維持 + 追加

### Phase 3: 最終同期日時表示（UI）
- 対象: `lib/service-status/syncedAt.ts`（算出+整形）, `StatusList.tsx`, `app/page.tsx`, `app/services/page.tsx`
- ゴール: 「{日時}現在」が一覧に表示、0 件時非表示、整形ロジック単体 GREEN

## 6. 依存関係順序

```mermaid
graph TD
  A[Phase 1 read-through コア] --> B[Phase 2 load/api 結線]
  C[Phase 3 syncedAt 整形] --> D[StatusList 表示]
  B --> D
  A --> E[/api/services syncedAt]
  C --> E
```

## 7. ロールアウト計画

| ステップ | 内容 | 期日 | 検証方法 |
|---|---|---|---|
| 1 | tdd 実装 GREEN | - | unit 全 GREEN（既存 + 追加） |
| 2 | preview deploy | - | preview で `/api/services` を 1h 跨ぎ/直後に叩き、stale 時に fetchedAt 更新 + naze-bako 出現を確認 |
| 3 | 本番 redeploy（Class B） | - | smoke: HUB 3 件が shipyard に反映 + トップに「{日時}現在」表示 |

## 8. リスク・注意点

- **リクエスト増幅**: 公開リクエスト→HUB fetch 経路。TTL gate（fresh なら 0 fetch）+ in-memory throttle（60s）で TTL あたり概ね 1 fetch に律速。HUB は内部サービスで低トラフィックのため許容。
- **stampede**: TTL 直後の同時多発リクエストで複数 instance が同時 fetch しうる。throttle は warm instance 単位のためベストエフォート。低トラフィックで実害小。気になれば将来 DB レベルの advisory lock を検討（本改修スコープ外）。
- **レスポンス遅延**: stale 時の初回リクエストは HUB fetch（最大 5s timeout）分遅くなる。graceful fallback で失敗時は前回値即返し。`force-dynamic` 既存のため SSR 影響は許容範囲。
- **SEC**: 安全サブセット維持（Zod strip）、syncedAt は日時のみ、新規 PII 経路なし。

## 9. 完了の定義 (DoD)

- [ ] Phase 1-3 完了
- [ ] 単体テストカバレッジ目標達成（行 80% / 分岐 70%）
- [ ] read-through 分岐（fresh/stale/fail/throttle）+ syncedAt 整形 + 表示が単体 GREEN
- [ ] E2E: 新規サービス出現リグレッション + 最終同期日時表示
- [ ] preview で naze-bako 反映を実機確認
- [ ] `.env.*.example` に `STATUS_REFRESH_TTL_SEC` 追記

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-08 | 初版作成 | /flow:revise |
