# service-status E2E テスト計画

> **入力**: `./001_service-status_SPEC.md`, `../concept.md` §1.1
> **最終更新**: 2026-05-27

---

## 1. ユーザージャーニー
| シナリオ ID | 前提 | 操作 | 期待結果 |
|---|---|---|---|
| S1-S1 (happy) | cache に up/down/unknown 各 1 | 一覧表示 | 状態色 + plain 文言 + 稼働日数 + 「〜時点」 |
| S2-S1 | up サービス | StatusCard クリック | 外部 url へ（別タブ、rel=noopener） |
| S1-S3 (edge) | cache 0/失敗 | 一覧表示 | EmptyState |
| S1-S4 (graceful) | HUB ダウン（cache は前回値） | 一覧表示 | 前回値 + 「〜時点」表示（崩れない） |

## 2. 環境要件
| 項目 | 要件 |
|---|---|
| ブラウザ | Chromium + WebKit |
| 画面 | モバイル / デスクトップ |
| 認証 | 不要 |
| HUB | mock（getCachedStatus スタブ、up/down/unknown）|

## 3. データセットアップ
- Seed: service_status_cache に 3 件（status 各種、fetched_at 設定）
- Cleanup: DB リセット

## 4. タグ別追加シナリオ
なし。

## 5. レイアウト・ビジュアル検証（O34）
### 5.1 Level 1 (snapshot)
| シナリオ | スクショ | mask |
|---|---|---|
| S1-S1 | `status-list.png` | 稼働日数 / fetched_at（動的時刻） |
### 5.2 Level 2 (意味的)
| # | 要件 | アサーション |
|---|---|---|
| L2-1 | 状態ドットが色分け | up=緑/down=琥珀/unknown=グレー（computed color） |
| L2-2 | 状態は色のみに依存しない | plain ラベル（「動いています」等）が存在（a11y/色覚） |
| L2-3 | カードがリンク | role=link、href=外部 url |
### 5.3 採用 Level
- Level 1 ✅ / Level 2 ✅（状態色 + 色覚配慮の検証が重要）/ Level 3 ❌（design --review-only 代替）

## 6. 期待 KPI
| 指標 | 目標 |
|---|---|
| 成功率 | 100% |
| Level 2 pass（色覚配慮含む） | 100% |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
