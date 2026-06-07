# service-status 変更仕様書（リアルタイム鮮度: read-through refresh）

> **改修種別**: 機能変更（更新戦略の再設計）
> **issue / slug**: C20260608-001 / realtime-refresh-gap
> **基準 SPEC**: `../001_service-status_SPEC.md`
> **起点クレーム**: `../claim_C20260608-001_20260608_realtime-refresh-gap/001_TRIAGE.md`
> **最終更新**: 2026-06-08
> **タグ**: feature, realtime

---

## 1. 変更概要

稼働一覧の鮮度を Vercel Cron（日次・Hobby 制約）に依存させていたため、HUB に新規登録されたサービス（および up/down 変化）が最大 ~24h 反映されず、concept §1.1 の「リアルタイム稼働状況」価値提案と乖離していた（claim C20260608-001 = naze-bako が表示されない）。本改修は **読み取り経路に read-through cache（最終同期日時ベースの TTL + graceful fallback）** を追加し、訪問者リクエストに refresh を相乗りさせる: **最終同期日時を保存し、訪問者リクエスト時に前回同期から TTL（既定 1 時間）以上経過していたら HUB を再取得**する。これにより Vercel cron 非依存で鮮度を TTL（既定 1 時間）に短縮する。日次 cron は cold-start プライマー兼 backstop として残す。

**Vercel Hobby 制限との関係**: 本改修は cron 頻度を上げない（Hobby 制限は破らない）。鮮度の担保を「Vercel がスケジュールする cron」から「通常のリクエスト処理内での条件付き fetch」へ移すことで、プラットフォーム制約の外側で鮮度を実現する。

**UI 表示（追加要件）**: 稼働一覧に **最終同期日時を「{日時}現在」形式**（例: 「2026年6月8日 8:30 現在」）で表示する。これにより訪問者は「いつ時点の稼働状況か」を把握できる（read-through で鮮度が上がったことを可視化し、concept §1.1「本当に動いている」信頼を補強）。

## 2. 変更前 vs 変更後

### 2.1 UC 変更
| UC ID | 変更前 | 変更後 | 理由 |
|---|---|---|---|
| UC-S5（最新化） | Vercel Cron（日次）のみが cache を更新 | Cron（日次 backstop）+ **読み取り時 read-through refresh（TTL 超過時のみ HUB fetch）** | 日次では realtime 価値提案を満たせない（claim C20260608-001） |
| UC-S1（一覧表示） | cache を listAll でそのまま表示 | 表示前に TTL 判定 → 必要時 refresh → 最新を表示。**さらに最終同期日時を「{日時}現在」形式で表示** | 新規サービス / up-down を TTL 内で反映 + 鮮度の可視化 |

### 2.2 入出力変更
| 対象 | 変更前 | 変更後 | 互換性 |
|---|---|---|---|
| `GET /api/services` | DB cache を即返す（HUB を叩かない） | DB cache が TTL 超なら HUB fetch + upsert を試行してから返す（失敗時は前回値・graceful） | **後方互換**（レスポンス形状不変、`{ services: PublicServiceView[] }`） |
| トップ / `/services` ページ | `loadStatusSafe` が cache をそのまま返す | `loadStatusSafe` が read-through 経由（TTL 超で refresh）。例外は従来通り握り潰し空配列 | 後方互換 |
| `StatusList` コンポーネント | services のみ受け取り一覧描画 | `syncedAt`（最終同期日時 = 最新 fetchedAt）prop を追加し、一覧に「{日時}現在」を表示。0 件時（EmptyState）は非表示 | 後方互換（prop 追加、省略時は非表示） |
| `GET /api/services` レスポンス | `{ services: [...] }` | `{ services: [...], syncedAt: string \| null }`（最終同期日時を top-level に追加） | 後方互換（additive、既存消費側は新フィールド無視） |
| `GET /api/cron/refresh-status` | 日次で全更新 | 変更なし（backstop として継続） | 互換 |

### 2.3 データモデル変更
| エンティティ | 変更内容 | マイグレーション要否 |
|---|---|---|
| `service_status_cache` | **変更なし**（既存 `fetchedAt` 列を TTL 判定に流用） | **不要** |

### 2.4 バリデーション・エラー変更
| 対象 | 変更前 | 変更後 |
|---|---|---|
| read-through 時の HUB fetch 失敗 | （該当なし） | 既存 `refreshStatusCache` の graceful（前回値保持・例外を投げない・PII を出さない、S-E1 踏襲）を read 経路でも適用 |
| HUB 過負荷 / リクエスト増幅 | cron のみなので無関係 | **TTL gate** で「fetchedAt が fresh なら fetch しない」+ **in-memory throttle**（warm instance 単位、既定 60s 再試行抑制）で増幅を抑制 |

## 3. 影響範囲

| 対象 | 影響度 | 説明 |
|---|---|---|
| 機能 service-status | 高 | 直接対象（読み取り経路に refresh 相乗り） |
| _shared/hub-client | 高 | `lib/hub/cache.ts` に read-through 関数追加（`refreshStatusCache` 再利用） |
| landing | 中 | トップ埋め込みの稼働一覧が read-through 経由になる（表示形状は不変） |
| SEC（concept §3.7） | 中 | read-through も Zod 安全サブセットのみ受信（不変）。新たな PII 経路なし。**増幅 DoS 観点**は TTL gate + throttle で緩和（§7.5） |

## 4. 後方互換性

- **互換維持**: ✅
- レスポンス形状・DB スキーマ・公開フィールドは不変。read-through は内部実装の追加であり、消費側（landing 埋込・/services）の契約は変わらない。
- 非互換変更: なし。

## 5. ロールバック方針

- **コード revert で戻せる**: ✅（read-through 導入コミットを revert すれば従来の cron-only に戻る。DB 変更なし）
- **DB マイグレーションのロールバック**: 不要（スキーマ無変更）
- **手順**: 該当コミット revert + redeploy のみ。env `STATUS_REFRESH_TTL_SEC` 未設定でも既定値で動作。

## 6. リリース戦略

- **方式**: 一括（additive・低リスク・互換維持のためフラグ不要）
- **フィーチャーフラグ**: なし（ただし `STATUS_REFRESH_TTL_SEC` env で TTL を運用調整可。未設定時 300 秒）
- **ロールアウト**: tdd GREEN → preview deploy で `/api/services` の fetchedAt が訪問ごとに更新されることを確認 → 本番 redeploy → smoke（HUB 3 件が shipyard に反映）。

## 7. 詳細仕様（新仕様）

### 7.1 詳細 UC（新仕様）

**UC-S5'（read-through 最新化）**:
- トリガー: トップ / `/services` / `GET /api/services` への各リクエスト。
- 最終同期日時 = `service_status_cache` の最新 `fetchedAt`（既存列）。各 upsert 時に `fetchedAt=now` で更新済みのため、追加列なしでこれを「最終同期日時」として使う。
- 処理:
  1. `repo.listAll()` で現行 cache を取得。
  2. cache が空、または最新 `fetchedAt`（最終同期日時）が `now - TTL`（既定 1 時間 = 3600s）より古い、かつ in-memory throttle 未抑制 → `refreshStatusCache`（HUB fetch + upsert、既存ロジック再利用）を試行。
  3. refresh 成功 → 再 `listAll` で最新を返す。失敗 → 既存 cache（前回値）を返す（graceful、S-E1）。
  4. cache が fresh（最終同期から TTL 未満）→ HUB を叩かず即返す（従来同等のレスポンス速度）。
- 既存 Cron（日次）は **backstop**: 無トラフィック期間の cold cache を埋め、read-through が一度も走らなくても最低日次で更新される。

### 7.2 入出力（新仕様）
- `GET /api/services` → `{ services: PublicServiceView[], syncedAt: string | null }`。内部で UC-S5' を実行。`syncedAt` = services の最新 `fetchedAt`（ISO 文字列、0 件なら null）。
- 公開フィールドは従来通り安全サブセットのみ（`toPublicStatus`、内部指標を出さない U-B1）。`syncedAt` は最終同期日時のみで内部指標ではない（安全）。

### 7.2.1 最終同期日時の表示（新仕様 UI）
- **データ**: 最終同期日時 = 稼働一覧 services の `fetchedAt` 最大値。サーバ側（`app/page.tsx` / `app/services/page.tsx`）で算出し `StatusList` に `syncedAt` prop で渡す。
- **表示形式**: 「**{日時}現在**」。例: 「2026年6月8日 8:30 現在」。タイムゾーンは JST（Asia/Tokyo）で表記。
- **配置**: 稼働一覧（StatusList）の近傍（一覧見出し直下 or 一覧末尾）。控えめなテキスト（design SoT のミュート系トーン）。
- **0 件時**: EmptyState 表示中は最終同期日時を出さない（同期実績が無い/取得不可のため）。
- **コピー方針**: 技術用語を避ける（O38）。「同期」は内部用語寄りのため、最終文言は `/flow:wording` で調整余地（候補: 「{日時}現在」「{日時}時点」）。本 PJ は i18n カタログ無し（JP ハードコード）のため、既存 UI 同様ハードコード JP で実装。

### 7.3 データモデル（新仕様）
- 変更なし。`fetchedAt`（既存）を鮮度判定に使用。throttle 状態は DB に持たず module-level in-memory（永続不要、ベストエフォート）。

### 7.4 バリデーション・エラー（新仕様）
- HUB fetch は既存 `fetchHubStatus`（Zod 安全サブセット parse、5s timeout、不正 status reject、余剰 strip）をそのまま使用。
- read 経路の例外は `loadStatusSafe` の既存 try/catch で空配列に握り潰し（技術詳細を出さない、SEC-001）。

### 7.5 機能固有 NFR + 既存連携（新仕様）
- **HUB 負荷**: TTL gate により「fresh の間は fetch 0 回」。TTL=1 時間なら最悪でも warm instance あたり 1 時間に 1 回程度。低トラフィックなショーケースかつ HUB は内部サービスのため十分に軽い。
- **増幅耐性**: 公開リクエストが HUB fetch を誘発する経路だが、(a) fetchedAt TTL gate（fresh なら 0 fetch）、(b) in-memory throttle（同一 warm instance で 60s 以内の再 fetch を抑制）で、リクエスト量に対し HUB fetch は TTL あたり概ね 1 回に律速。
- **鮮度**: 新規サービス・up/down ともに、訪問がある限り最大 TTL（1 時間）で反映。無訪問時は日次 cron backstop。
- **SEC**: 安全サブセット維持（Zod strip）、新規 PII 経路なし、cron secret 経路は不変。

## 8. タグ別追加項目

### realtime
- 鮮度 SLA（目標）: 訪問トラフィックがある状態で新規サービス出現 ≤ TTL（既定 1 時間）。
- push ではなく pull + TTL（concept hub-client §53「リアルタイム push はしない、ポーリング + キャッシュ」方針を踏襲。pull の発火を cron→リクエスト駆動に変更）。

## 9. 未決事項

### [論点-001] TTL の既定値 — ✅ 解決済（2026-06-08, seiji 指示）
- **決定**: **1 時間**（3600s）。「最終同期日時を保存し、訪問者リクエストから 1 時間以上経っていたら refresh する」とユーザー指示。
- **最終同期日時の保持**: 既存 `service_status_cache.fetchedAt` の最新値を流用（追加列・マイグレーション不要）。
- **調整余地**: env `STATUS_REFRESH_TTL_SEC` で無停止調整可（未設定時 3600）。

> 現時点で他の論点なし (2026-06-08)。

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-08 | 初版作成（claim C20260608-001 ハンドオフ） | /flow:revise |
