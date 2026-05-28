<!-- auto-generated-start -->
# 設計レビューレポート — service-status/revise_service-icons_20260528_icon-from-service-hub

**レビュー日**: 2026-05-28 17:10 (+09:00)
**レビュー実施者**: Claude (Opus 4.7) + seiji
**対象**: `service-status` 機能の icon 表示 revise (5 文書 001-005、commit 62facd4)
**入力**: 001-005 設計文書 + 既存実装 (contract.ts / cache.ts / StatusList.tsx / StatusCard.tsx / statusCache.ts) + concept §1.1
**観点ソース**: 組み込みチェックリスト (review-perspectives.md は時間制約により非ロード、本回限定)
**モード**: auto-pick (既定)
**severity-threshold**: low (Info 除外)
**親 dispatch**: /flow:auto (D20260528_010) → /flow:audit (D20260528_011) → /flow:scenario --update (D20260528_012) → 本 (D20260528_013)

## 1. レビューサマリー

| 観点 | 評価 | 備考 |
|------|------|------|
| 仕様の明確性 | 要確認 | iconUrl 失敗時の挙動は明示済だが contract 過剰反応に懸念 (R3) |
| 既存パターンとの一貫性 | 要確認 | url field は `.url()` 未使用、iconUrl だけ `.url()` 厳格 = 一貫性ずれ (R3)。UI 責務は StatusCard 集約 (R6) |
| API 設計 | OK | `/api/services` レスポンスに optional iconUrl 追加で後方互換 |
| エラーハンドリング | 要確認 | 無効 iconUrl 時に service エントリ全体 strip は過剰 (R3)、`<img>` onError graceful (OK) |
| テストカバレッジ | 要確認 | U-IC1-10 で主要ケース網羅、ただし cache.ts iconUrl propagation 単体テスト不足 (R7) + R3 の境界テスト追加要 |
| 影響範囲・副作用 | **要確認 (R2 High)** | StatusListItem 型 + StatusCardService 型 + app/page.tsx + app/services/page.tsx の Props passthrough 漏れ (PLAN §1 未言及) |
| API 流用・責務逸脱 | OK | ServiceIcon 外出しは LP 単独 = feature 内で OK、_shared/ui 不要 |
| 既存実装の再利用 | OK | 既存 _shared/ui に Avatar/Icon 無し (調査済)、StatusCard が単一行 UI 集約パターン (再利用先) |
| データ移行・互換性 | OK | nullable + fast metadata-only ALTER (005 MIGRATION §4)、既存 row 無影響 |
| 権限・認可 | OK | iconUrl は公開情報、認可不要 |
| UX・操作性 | 要確認 | alt 属性は装飾扱い `alt=""` が screen reader 二重読み回避で適切 (R4)、name 併記前提 |

## 2. 指摘事項 (severity 降順)

### [R1] cache.ts mapping に iconUrl 行追加が漏れると DB に永遠に保存されない (severity=**Critical**)
- **対象**: `lib/hub/cache.ts:33-43` (`data.services.map((s) => ({ ... }))`) + 002_REVISE_PLAN.md §1
- **現状**: PLAN §1 の cache.ts 行に「`iconUrl: s.iconUrl ?? null` 追加」と書かれているが、現 cache.ts は明示列挙の object literal mapping。実装者が漏らすと iconUrl は upsertMany に渡らず DB に保存されない = LP では永遠にフォールバック表示のみ
- **問題**: Phase 1.4 (cache.ts refresh) の責務記述が「1 行追加」と過小評価、実装漏れリスク高
- **推奨**: PLAN §1 cache.ts 行に **「明示列挙 mapping に iconUrl 行追加が必須 (明示列挙パターンなので自動継承されない)」** を補足、+ U-IC11 (cache.ts iconUrl propagation) test を 003 に追加して機械的に担保
- **種別**: 指摘事項 (自動反映)
- **chosen**: 推奨通り + U-IC11 追加
- **chosen 根拠**: 明示列挙 mapping パターンが既存 cache.ts/statusCache.ts 両方に採用済 = 漏れリスクは構造的、テストで担保が筋
- **反映先**: 002 §1 補足コメント、003 §1.1 U-IC11 追加

### [R2] StatusListItem / StatusCardService 型 + Props passthrough の更新漏れ (severity=**High**)
- **対象**: `features/service-status/StatusList.tsx:7-13` (StatusListItem)、`components/status/StatusCard.tsx:6-12` (StatusCardService)、`app/page.tsx:30`、`app/services/page.tsx:17`、002_REVISE_PLAN.md §1
- **現状**: PLAN §1 は「StatusList.tsx に icon 表示領域追加」のみ列挙。実態は型 (×2) + 表示 component (StatusCard) + Props 受け渡しの計 4 箇所影響
- **問題**: 実装責務が StatusList に集約と誤読されやすい。実際の表示集約点は **StatusCard.tsx** (`design SoT §5 で [状態ドット] サービス名 … 稼働N日 →` の 1 行 UI を担う既存パターン)
- **推奨**: PLAN §1 を **3 行に分割** — (a) `StatusListItem` 型 + (b) `StatusCardService` 型 + (c) `StatusCard.tsx` icon 表示領域追加 + (d) `StatusList.tsx` は型と passthrough のみ。`app/page.tsx` / `app/services/page.tsx` 側 mapping は repo 戻り値が `$inferSelect` で iconUrl 自動含有のため変更不要 (型透過、確認だけ)
- **種別**: 指摘事項 (自動反映)
- **chosen**: 推奨通り、PLAN §1 表を 4 行に分割
- **chosen 根拠**: 既存 StatusCard が単一行 UI 集約パターン、責務分離尊重
- **反映先**: 002 §1、001 §7.1 詳細 UC 記述 (icon 描画は StatusCard 内部)

### [R3] contract.ts の iconUrl `.url()` 過剰反応 — 無効 URL で service エントリ全体 strip は UX 過剰 (severity=**Medium**)
- **対象**: `lib/hub/contract.ts:10-17` + 001 §2.4 S-E4 + 003 §1.2 U-IC7/U-IC8
- **現状**: 既存 `url: z.string()` は `.url()` 未使用 (validate 緩い)、新規 `iconUrl: z.string().url().optional()` だけ厳格。無効 iconUrl で Zod array parse 内の object reject = 当該 service エントリ全体 strip = LP に表示されない
- **問題**: icon 1 つの URL 不備で service 全体が消える = UX 過剰反応。service-hub MVP の signing は事前 validate 済前提だが、防御線として graceful にすべき
- **推奨**: `iconUrl: z.string().url().optional().catch(undefined)` に変更 = 無効 URL は undefined に降格、service エントリは生かす (フォールバック表示で graceful)。**SEC 観点**: 内部指標が混入する余地は無い (z.string() なので XSS risk 限定的、表示時は `<img src>` で React が attribute escape)
- **種別**: 設計判断項目 (auto-pick で確定)
- **chosen**: `.catch(undefined)` 採用、U-IC7/U-IC8 の期待動作を「iconUrl が undefined になり service エントリは保持」に修正
- **chosen 根拠**: graceful 優先 + 他 field validate (url=string、status=enum) は維持なので最低限の整合性は確保
- **反映先**: 001 §2.4 S-E4、003 §1.2 U-IC7/U-IC8 期待動作修正

### [R4] icon alt 属性は装飾扱い `alt=""` 推奨 (severity=**Medium**、a11y)
- **対象**: 001 §7.1 UC-S1 (`<img alt={name}>`)、002 §8 注意点 (a11y)
- **現状**: SPEC §7.1 で `alt={name}` 推奨、name が StatusCard 内で text 表示と併記される (現 `StatusCard.tsx:4` design SoT §5 の単一行 UI)
- **問題**: 同じ意味 (service 名) が画像 alt とテキストで二重読みされる = screen reader でユーザー体験低下 (NVDA / VoiceOver)
- **推奨**: `<img alt="" role="presentation">` (装飾画像) に変更 = name の visible text が a11y name を担う。アイコン視覚情報は装飾、意味は隣接 text が担保 (WCAG 1.1.1 の装飾的画像パターン)
- **種別**: 設計判断項目 (auto-pick で確定)
- **chosen**: `alt=""` 採用、001 §7.1 + 002 §8 を更新
- **chosen 根拠**: WCAG 1.1.1 装飾的画像原則 + 隣接 text に意味が冗長付与されないことが screen reader UX として優れる
- **反映先**: 001 §7.1 UC-S1、002 §8 a11y 注意点

### [R5] CSP img-src 制限は現状無し → 将来注意点として記録 (severity=**Low**)
- **対象**: 002 §8 注意点 (CSP img-src)、`next.config.*` / `middleware.ts` / `app/`
- **現状**: grep 確認 (`Content-Security-Policy`, `img-src`, `cspHeader`) で本 PJ に CSP 設定なし → service-hub CDN ドメインから img 取得しても制限なし
- **問題**: 現状問題なし。ただし将来 CSP 導入時に service-hub CDN ドメイン許可リスト追加が必要 = drift 候補
- **推奨**: 002 §8 注意点に「**現状 CSP 未設定、将来 CSP 導入時は service-hub CDN ドメイン (Cloudflare R2 等) を `img-src` 許可リストに追加が必要**」と明記
- **種別**: 指摘事項 (自動反映)
- **chosen**: 002 §8 に CSP 状況 + 将来注意点を 1 行追記
- **chosen 根拠**: 現状無問題、将来再評価ポイントとしてトレース確保
- **反映先**: 002 §8

### [R6] PLAN §1 cache.ts 行 + StatusList.tsx 行の責務記述ズレ (severity=**Medium**) — R1/R2 と複合
- **対象**: 002_REVISE_PLAN.md §1 表
- **現状**: cache.ts は「1 行追加」、StatusList.tsx は「icon 表示領域追加」と簡略表現
- **問題**: R1 (cache.ts mapping 漏れリスク) + R2 (UI 集約点は StatusCard) と複合。PLAN §1 の表現が実装者 (将来の Claude or seiji) の認知負荷を下げない
- **推奨**: 002 §1 表を **修正後の正しい責務分割で書き直す** (R1/R2 で確定した内容を反映、4-5 行に増える)
- **種別**: 指摘事項 (自動反映)
- **chosen**: R1+R2 で確定した変更を 002 §1 表に反映
- **chosen 根拠**: 設計文書の自己整合性確保 = tdd 着手前の品質ゲート責務
- **反映先**: 002 §1

### [R7] U-IC11 (cache.ts iconUrl propagation 単体テスト) 追加 (severity=**Medium**) — R1 の機械担保
- **対象**: 003_REVISE_UNIT_TEST.md §1.1
- **現状**: U-IC6 (cache.ts refresh で hub レスポンス iconUrl 含む → upsertMany 引数の iconUrl が正しく渡される) で機能担保しているが、**hub.test.ts 既存 U-3 (`upsertMany` を fetched_at 付きで呼ぶ) の assertion を iconUrl 含めて補強する形が実装パターンとして既存整合**
- **問題**: U-IC6 は新規 test として書かれているが、既存 U-3 拡張で iconUrl 含む rows を assert する方が hub.test.ts mockRepo パターン (lib/hub/hub.test.ts:27-33) と整合
- **推奨**: U-IC6 を「既存 U-3 を拡張して iconUrl assertion 追加」に書き換え (test 1 件追加でなく既存補強)
- **種別**: 指摘事項 (自動反映)
- **chosen**: 003 §1.1 U-IC6 → 003 §2 修正テストケースに移動 (既存 U-3 拡張)
- **chosen 根拠**: 既存 mockRepo パターン尊重 + テストの重複回避
- **反映先**: 003 §1.1 / §2

## 3. コードベース調査結果

### 3.1 既存パターン
- **contract.ts (commit 7e775a1)**: Zod union + transform でレスポンス形を normalize、未知キーは strip。`z.string()` は url() validate 未使用 (LP 表示は href として渡すだけ、open in new tab は client 側 anchor 任意)
- **cache.ts (現在)**: `data.services.map((s) => ({ slug, name, url, status, since, lastCheckedAt, fetchedAt }))` の **明示列挙 mapping** — spread (`...s`) を使わない設計 = 安全サブセット強制 + 型エビデンス。**新フィールド追加は明示列挙への追加必須** (R1)
- **statusCache.ts (現在)**: 同じく明示列挙の values mapping + onConflictDoUpdate set 句も明示列挙。`$inferSelect` 経由で listAll 戻り値型は自動継承 (新カラム追加で型自動拡張)
- **StatusCard.tsx**: 単一行 UI 集約パターン (`[状態ドット] サービス名 … 稼働N日 →`)。design SoT §5 準拠
- **StatusList.tsx**: items を map → StatusCard へ passthrough する shell only
- **app/page.tsx / app/services/page.tsx**: `getCachedStatus()` → StatusList に passthrough

### 3.2 影響範囲分析
| 変更対象 | 既存呼び出し箇所 | 呼び出し元の前提 (契約) | 破壊リスク |
|---|---|---|---|
| `serviceStatusSchema` (contract.ts) | `lib/hub/client.ts` (fetchHubStatus 内 parse)、`lib/hub/hub.test.ts` (test fixture) | parse 成功時に `{slug, name, url, status, since?, lastCheckedAt?}` を返す | **中** (iconUrl optional 追加で型拡張、無効 iconUrl の挙動は R3 で graceful 化必須) |
| `serviceStatusCache` table (schema.ts) | `lib/db/repositories/statusCache.ts` (`$inferSelect`)、`lib/hub/cache.ts` (upsert)、`lib/db/seed.ts` (DEV_STATUS_SEED) | drizzle pgTable 定義の column list | **低** (nullable 追加、既存 row 無影響、MIGRATION §4) |
| `StatusCacheInput` (statusCache.ts) | `lib/hub/cache.ts:33`、`lib/db/seed.ts:8`、`lib/hub/hub.test.ts:28` | 明示列挙の Input 型 | **中** (iconUrl 追加必要、seed.ts は dev データなので null 化で OK) |
| `cache.ts refreshStatusCache` | `app/api/cron/refresh-status/route.ts` (cron 呼び出し)、`app/api/services/route.ts` (?) | `RefreshResult` 戻り値 | **低** (戻り値型不変、内部 mapping 拡張のみ) |
| `StatusCard` (StatusCard.tsx) | `features/service-status/StatusList.tsx:29` | `service: StatusCardService` prop | **中** (type 拡張で iconUrl 受信、UI render 追加) |
| `StatusListItem` (StatusList.tsx) | `app/page.tsx:30`、`app/services/page.tsx:17` | `services: StatusListItem[]` | **低** (type 拡張、$inferSelect → listAll 経由なら自動継承) |

### 3.3 API 責務の評価
- ServiceIcon component 外出し: **不要** = LP 単独使用、StatusCard 内インライン JSX で完結 (LOC 30 以下、責務集約優先)
- _shared/ui に Avatar/Icon/FallbackImage 無し (調査済): 既存再利用候補なし、StatusCard 内 inline 実装が妥当
- StatusList は items map shell に専念、表示集約は StatusCard (既存パターン保持) = **責務逸脱なし** (R2 で PLAN 表記を修正)

## 4. 設計判断ログ

| # | 判断項目 | 結論 | chosen_type | 反映先 |
|---|---|---|---|---|
| D1 | [論点-007] icon フォールバック背景色 | 案 A 単一色 (`var(--color-brand-bg-soft)` 流用、design SoT §6 ミニマル路線) | auto-recommended | 001 §9 [論点-007] status=accepted、001 §7.1 UC-S1 |
| D2 | alt 属性方針 | `alt=""` (装飾画像、name 併記の二重読み回避) | auto-recommended | 001 §7.1、002 §8 |
| D3 | contract iconUrl 無効 URL graceful | `.catch(undefined)` で graceful (元 service 残す) | auto-recommended | 001 §2.4 S-E4、003 §1.2 U-IC7/U-IC8 |
| D4 | ServiceIcon 外出し vs インライン | StatusCard 内インライン (LOC 30 以下、責務集約) | auto-recommended | 002 §2 (新規ファイル列から削除候補としてマーク) |
| D5 | U-IC6 vs 既存 U-3 拡張 | 既存 U-3 拡張で iconUrl assertion 追加 (mockRepo パターン尊重) | auto-recommended | 003 §1.1 / §2 |

## 5. 次のステップ
- 反映済み 001-005 を確認
- service-hub PJ で `/flow:revise service-icons` 起動 (連動改修対象、producer 側 contract に iconUrl 追加)
- service-hub 改訂後に `/flow:tdd revise_service-icons_*` で実装着手 (Phase 1 → Phase 2)
- 視覚レビューは [論点-005] Playwright scaffold 後

## 6. AI_LOG 追跡

decision_id: D20260528-039 (R1〜R7 + D1〜D5 計 12 件、`chosen_type=auto-recommended`)
セッションファイル: `docs/AI_LOG/D20260528_013_spec-review_service-status-revise-icons.md`
<!-- auto-generated-end -->
