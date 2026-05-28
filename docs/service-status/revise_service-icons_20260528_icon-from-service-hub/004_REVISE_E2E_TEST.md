# service-status E2E テスト計画 (service-icons)

> **入力**: [`./001_REVISE_SPEC.md`](./001_REVISE_SPEC.md), [`../../concept.md`](../../concept.md) §1.1 UC#1/#2, [`../004_service-status_E2E_TEST.md`](../004_service-status_E2E_TEST.md)
> **最終更新**: 2026-05-28

---

## 1. 変更 UC シナリオ

### UC-S1: 稼働一覧を見て信頼する (改修版 + icon 表示)

| シナリオ ID | 前提 | 操作ステップ | 期待結果 |
|---|---|---|---|
| **S1-S1' (icon あり)** | service-hub mock で iconUrl 付き | LP `/` を開く → StatusList visible | 各サービスカード左端に `<img src=iconUrl>` 表示 + 状態ドット + name + 稼働日数 |
| **S1-S2' (icon 不在 = フォールバック)** | service-hub mock で iconUrl undefined | 同上 | 各サービスカード左端に `<div>` + イニシャル 1 文字 + ブランドカラー背景 表示 |
| **S1-S3' (icon 読み込み失敗)** | service-hub mock で iconUrl = 存在しない URL (`https://invalid.example.com/notfound.png`) | 同上、画像読み込み失敗を待つ | フォールバック `<div>` イニシャル表示に自動切替 (React onError → setState) |
| **S1-S4' (a11y)** | icon あり | 同上 → screen reader (Playwright accessibility tree) | `<img alt={name}>` で name が読み上げられる |

### UC-S2: 個別サービス遷移 (変更なし、リグレッション)

| シナリオ ID | 前提 | 操作ステップ | 期待結果 |
|---|---|---|---|
| S2-S1 (既存維持) | icon あり/不在 両方 | StatusCard クリック | 外部 url へ遷移 (rel=noopener、別タブ) — icon 領域クリックでも同遷移 (tap target 拡大効果、変更なし) |

## 2. リグレッションシナリオ (既存 UC、重要度高)

| UC | シナリオ ID | 確認観点 |
|---|---|---|
| UC-S1 (構造) | S1-S1 (happy) | 稼働一覧表示 + 各サービスの状態ドット + name 表示 — 既存維持 |
| UC-S1 (graceful) | S1-S3 (edge、0 件/取得不可) | EmptyState 表示 — 既存維持 (iconUrl 追加と無関係) |
| UC-S5 (Cron) | (Cron 経由 refresh) | refresh 後に DB に iconUrl 含めて upsert + 再表示で反映 |

## 3. 移行検証シナリオ (Phase 5 MIGRATION ある時)

| シナリオ ID | 移行前データ | 移行後期待状態 |
|---|---|---|
| **M1 (column 追加)** | service_status_cache テーブルに既存 N 行 (iconUrl 列なし) | drizzle migrate 後、N 行全てで iconUrl = NULL (既存 row 無破壊)、新規 INSERT で iconUrl 保存可 |
| **M2 (rollback)** | M1 完了後 | drizzle rollback (`DROP COLUMN icon_url`) で iconUrl 列削除、既存 N 行は他フィールド維持 |

## 4. 環境要件差分

| 項目 | 前回 | 今回 | 理由 |
|---|---|---|---|
| ブラウザ | Chromium + WebKit | **変更なし** | UI 変更だが標準的な `<img>` + CSS |
| 画面サイズ | モバイル / デスクトップ | **変更なし** | icon 32×32px は両サイズで適切表示 |
| service-hub mock | iconUrl なし | iconUrl あり / 不在 / 無効 URL の 3 fixture | 変更 UC test に必須 |
| Level 1 snapshot fixture | 既存 fixture (icon なし) | **新 fixture (icon あり)** を別シナリオで撮影 | 視覚回帰検証 |

## 5. レイアウト・ビジュアル検証 (O34)

### 5.1 Level 1 (snapshot, CI)

| シナリオ | スクショ | mask | 備考 |
|---|---|---|---|
| S1-S1' (icon あり) | `status-list-with-icons.png` | 稼働日数 (動的時刻) | 新 fixture |
| S1-S2' (フォールバック) | `status-list-fallback.png` | 同上 | 新 fixture |

### 5.2 Level 2 (意味的)

| # | 要件 | アサーション |
|---|---|---|
| **L2-1** (icon size) | icon 領域は 32×32px (or design SoT 規定) | `<img>` boundingBox width/height ≈ 32 |
| **L2-2** (フォールバックレンダリング) | フォールバック背景色 = ブランドカラートークン | `<div>` computed style backgroundColor が design SoT トークン値 |
| **L2-3** (tap target) | icon + name 領域全体が link として機能 | clickable area boundingBox が icon + name を含む |

### 5.3 Level 3 (AI Vision)

- 採用: ❌ (MVP)、Level 1+2 + `/flow:design --review-only` で十分

### 5.4 採用 Level

- Level 1 ✅ / Level 2 ✅ / Level 3 ❌

## 6. 期待 KPI

| 指標 | 目標 |
|---|---|
| シナリオ成功率 | 100% (S1-S1', S1-S2', S1-S3', S1-S4', S2-S1, M1, M2) |
| Level 1 差分 | 0 (新 fixture コミット後) |
| Level 2 pass | 100% |
| LCP 影響 | < +100ms (icon は `loading="lazy"` + CDN cache) |

## 7. 実行ステータス

**現状**: [論点-005] Playwright scaffold 未完了のため、E2E 実装は scaffold 完了後に着手。本 revise 設計時点では計画のみ。

`/flow:e2e` 実行時に本 004 を入力に Playwright spec を実装。Phase 5 MIGRATION 実行検証 (M1/M2) は drizzle CLI で手動確認可能 (E2E 外で代替可)。

## 8. 更新履歴

| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 | /flow:revise |
