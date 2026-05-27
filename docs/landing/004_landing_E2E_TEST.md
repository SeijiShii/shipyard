# landing E2E テスト計画

> **入力**: `./001_landing_SPEC.md`, `../concept.md` §1.1
> **最終更新**: 2026-05-27

---

## 1. ユーザージャーニー
| シナリオ ID | 前提 | 操作ステップ | 期待結果 |
|---|---|---|---|
| L1-S1 (happy) | 稼働一覧あり | `/` を開く | ヒーロー + 稼働一覧 + コンサル CTA が表示 |
| L1-S2 (入口理解 O41) | 初見 | `/` ファーストビュー | 「何のサイトか」がリード文で分かる |
| L2-S1 | — | 「ご相談はこちら」クリック | `/contact` へ遷移 |
| L1-S3 (edge) | 稼働一覧 0/失敗 | `/` を開く | EmptyState、LP 全体は表示（graceful） |

## 2. 環境要件
| 項目 | 要件 |
|---|---|
| ブラウザ | Chromium（主）+ WebKit |
| 画面サイズ | モバイル / デスクトップ |
| オフライン | ❌ |
| 認証 | 不要（公開） |
| HUB status | mock（getCachedStatus をスタブ） |

## 3. データセットアップ
- Seed: service_status_cache に 2-3 件のモック行（up/down/unknown）
- Cleanup: テスト DB リセット

## 4. タグ別追加シナリオ
なし（offline/realtime/i18n 非該当）。

## 5. レイアウト・ビジュアル検証（O34）
### 5.1 Level 1 (snapshot, CI)
| シナリオ | スクショ | mask |
|---|---|---|
| L1-S1 | `landing-happy.png` | 稼働日数（動的時刻） |
### 5.2 Level 2 (意味的)
| # | 要件 | アサーション |
|---|---|---|
| L2-1 | ヒーローが最上部 | Hero.y < 稼働一覧.y |
| L2-2 | CTA が可視・到達可 | CTA boundingBox 存在、role=link |
| L2-3 | 稼働一覧が主役（余白） | section 間 margin が design SoT スケール |
### 5.3 Level 3 (AI Vision)
- 採用: ❌（MVP）。重要 LP だが初期は Level 1+2 + Phase 3 `/flow:design --review-only` の人手視覚レビューでカバー。Level 3 は月次回帰時に検討（Class B-4 コスト）。
### 5.4 採用 Level
- Level 1 ✅ / Level 2 ✅ / Level 3 ❌（design --review-only で代替、コスト回避）

## 6. 期待 KPI
| 指標 | 目標 |
|---|---|
| シナリオ成功率 | 100% |
| Level 1 差分 | 0 |
| Level 2 pass | 100% |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
