# E2E テストレポート: landing (元 LP + revise messaging-shift 統合)

- **状態**: red (scaffold 未完了 — Playwright bootstrap 必要)
- **FW**: Playwright (@playwright/test 1.49.1、devDependencies install 済) — ただし config + e2e/ + browser binary すべて未 scaffold
- **実行コマンド**: `npm run e2e` (= `playwright test`、config 不在のため起動失敗)
- **対象 URL**: ローカル dev server (`next dev`、本セッションでは未起動 — `.env.local` の Neon/Clerk 環境変数も未確認)
- **last_updated**: 2026-05-28 12:45 (+09:00)
- **session**: [D20260528_005_e2e_landing](../AI_LOG/D20260528_005_e2e_landing.md)

## 計画入力 (実行できなかったもの)

### 元 LP 計画 `004_landing_E2E_TEST.md`
| journey | spec ファイル (予定) | 結果 |
|---|---|---|
| L1-S1 (happy、ヒーロー+稼働一覧+CTA 表示) | `e2e/landing.spec.ts` | ❌ 未実装 (scaffold 待ち) |
| L1-S2 (入口理解 O41) | 同上 | ❌ 未実装 |
| L1-S3 (edge、稼働一覧 0/失敗 → EmptyState) | 同上 | ❌ 未実装 |
| L2-S1 (CTA → /contact 遷移) | 同上 | ❌ 未実装 |
| Level 1 snapshot `landing-happy.png` | 同上 | ❌ 未撮影 |
| Level 2 (L2-1〜L2-3 構造アサーション) | 同上 | ❌ 未実装 |

### revise messaging-shift 追加計画 `revise_messaging-shift_20260528_*/004_REVISE_E2E_TEST.md`
| journey | spec ファイル (予定) | 結果 |
|---|---|---|
| L1-S2' (入口理解、新スタンスキーワード 2 種以上) | `e2e/landing.spec.ts` | ❌ 未実装 |
| L1-S4 (アンチパターン NG キーワード非含) | 同上 | ❌ 未実装 |
| L1-S5 (metadata description にスタンスキーワード) | 同上 | ❌ 未実装 |
| L2-S2 (CTA テキスト短文 + 控えめトーン) | 同上 | ❌ 未実装 |
| L2-4 (新規、スタンス DOM ビューポート可視) | 同上 | ❌ 未実装 |
| Level 1 snapshot 新コピー版で再撮 | 同上 | ❌ 未撮影 |

## red 原因切り分け (`/flow:e2e` 根本原則 7)

- **(a) テスト側の問題**: 該当せず (spec がまだ実装されていない)
- **(b) 実装側のバグ / setup 不足**: ✅ **PJ の Playwright scaffold 未完了**
  - playwright.config.ts が存在しない (`playwright test` が config を解決できず起動不能)
  - e2e/ ディレクトリが存在しない
  - browser binary が未 install (`npx playwright install` 未実行)
  - dev server 起動環境が未準備 (`.env.local` 未作成 = Neon DB connection string / Clerk publishable key / Resend API key / Turnstile keys が未収集)

## fix seed (次アクション候補)

### Seed 1: Playwright bootstrap
- **種別**: 新規基盤実装 (元の SCENARIO §1.3.2 横断「_shared/e2e」として扱うのが自然)
- **アクション候補**: `/flow:feature _shared/e2e` で E2E 基盤を新規 feature として設計 → tdd で scaffold (playwright.config.ts + e2e/ 構造 + dev server fixture + mock helpers)
- **影響範囲**: 全機能フォルダの 004 計画
- **想定工数**: 2-4 時間 (PJ 性質: Next.js + Neon mock + Clerk test mode)

### Seed 2: dev server 環境構築
- **種別**: Release 工程 (`/flow:release` Phase 1: `.env.local` FILL)
- **アクション候補**: Playwright が dev server 立ち上げを伴うなら、env 構築は release を経由する必要あり
- **代替**: Neon dev branch + Clerk dev instance + mock-only mode で no-key E2E を成立させる (scaffold 設計で吸収)

## flaky / quarantine

該当なし (実行に到達していないため)。

## artifacts

なし (実行未到達)。

## metrics

```yaml
metrics:
  wall_clock: 5min
  active_minutes: 5
  tokens: ~15k
  loc: 0  # spec 実装なし
  e2e_specs: 0
  pass: 0
  fail: 0
  flaky: 0
  scaffold_status: not_initialized
```

## 次のステップ (flow:auto loop への hint)

本 103 が red 完了したことで、`/flow:auto` 次反復は以下のいずれかを選定する:

1. **P4.45 Wording gate** (Recommended) — scaffold 不要 + 1 度も未実行 + UI 変更直後で必須。`/flow:wording` で文言校正
2. **P4.4 Design gate (b)** — wording 後の画面に対して `/flow:design --review-only` で視覚レビュー
3. **Playwright bootstrap** — `/flow:feature _shared/e2e` で新規基盤設計 (後日)
4. **P4.7 Release gate** — wording/design 通過後、実キー FILL + 動作確認 + デプロイ
5. **P4.5 E2E gate 再評価** — Playwright bootstrap 完了後に本 103 を green 化

## Open 論点 (concept §8 登録予定)

### [論点-005] Playwright E2E bootstrap (scaffold 不在)
- **影響範囲**: 全 feature の 004 E2E 計画 (landing / service-status / inquiry / admin / legal)
- **詰めるべき問い**:
  1. _shared/e2e として横断基盤化するか、各機能ごとに spec を散在させるか
  2. dev server 起動に Neon dev branch を使うか、mock-only mode を整備するか
  3. CI 統合 (GitHub Actions で playwright headless 実行) はいつ着手するか
- **候補案**:
  - 案 A (Recommended): `/flow:feature _shared/e2e` で横断 feature として設計、Neon dev branch + Clerk test mode を使う公式 dev server 起動 fixture を整備、CI 連携も同 feature 内で実装
  - 案 B: 各機能ごとに ad-hoc spec、共通 helper のみ `e2e/_helpers/` に切り出し
- **推奨**: 案 A (基盤として一元管理する方が長期保守性高、`/flow:auto` の E2E gate も target 単位で進められる)
- **判断期限**: Release gate (P4.7) 通過後、本格運用前
- **担当**: seiji
