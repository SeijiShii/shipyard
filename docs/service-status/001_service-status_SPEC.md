# service-status 機能仕様書

> **役割**: 稼働サービス一覧の表示（リアルタイム up/down + 各サービスへのリンク）+ キャッシュ配信 API + 定期取得。
> **タグ**: feature
> **最終更新**: 2026-05-27
> **入力**: `../concept.md` §1.1 UC1/2/5 / §5.2 / §3, `../_shared/hub-client/001_*`, `../_shared/db/001_*`, `./README.md`

---

## 1. 詳細 UC

### UC-S1: 稼働一覧を見て信頼する（concept §1.1 #1）
- **トリガー**: トップ表示（landing が本 component を埋込）or `/services`
- **処理**: `getCachedStatus()` → StatusCard 一覧（状態ドット + 名前 + 稼働日数 + →）
- **出力**: 各サービスの up/down/unknown が plain 文言で表示、`fetched_at` で「〜時点」
- **例外**: 0 件/取得不可 → EmptyState

### UC-S2: 個別サービスへ遷移（concept §1.1 #2）
- **処理**: StatusCard クリック → サービス `url`（外部）へ（`rel=noopener`、別タブ）

### UC-S5: 運用者の手を介さず最新化（concept §1.1 由来、Cron）
- **トリガー**: Vercel Cron（N 分間隔）
- **処理**: `refreshStatusCache()`（hub-client）→ HUB fetch → cache upsert。失敗時は前回値保持。

## 2. 入出力
### 2.1 API
| メソッド | パス | 入力 | 出力 | 認証 |
|---|---|---|---|---|
| GET | `/api/services` | — | キャッシュ済 status 一覧（安全サブセット） | 不要（公開、軽 rate limit 検討） |
| GET | `/api/cron/refresh-status` | Vercel Cron header | refresh 実行結果 | Cron secret（`CRON_SECRET`） |

### 2.2 副作用
- cron: service_status_cache 更新（hub-client.refreshStatusCache）。

## 3. データモデル
新規なし。service_status_cache（_shared/db）を hub-client 経由で read/write。

## 4. バリデーション + エラーケース
| ID | 条件 | 振る舞い |
|---|---|---|
| S-E1 | HUB ダウン（cron 時） | 前回値保持、エラーログ（PII なし）、画面は graceful |
| S-E2 | /api/cron に Cron secret 不一致 | 401（外部からの手動叩き防止） |
| S-E3 | status 不明値 | 'unknown'（グレー + 確認中）にフォールバック |

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| HUB 負荷 | 画面は cache のみ、HUB は cron 経由（叩きすぎない） | concept §1 |
| 可用性 | HUB ダウン時も最終既知ステータス表示 | concept §3 |
| 安全性 | 安全サブセットのみ表示（内部指標非表示） | concept §1.2 除外 |
- 連携: _shared/hub-client（fetch/cache）/ _shared/db（cache）/ _shared/ui（StatusCard/StatusBadge/EmptyState）/ landing（埋込）

## 6. タグ別追加
feature（UI）。視覚レビュー（O34）は Phase 3。

## 7. スコープ外
- 過去稼働履歴グラフ（service-hub の責務、本サービスは現在の up/down のみ）
- 内部指標表示（絶対除外、§1.2）

## 8. 未決事項
現時点で論点なし (2026-05-27)。
> Cron 間隔は実装時に確定（Vercel Hobby の cron 制約 + HUB 負荷で N 分、preferences §2.17）。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
