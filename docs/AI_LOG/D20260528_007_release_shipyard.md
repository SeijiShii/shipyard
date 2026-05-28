# AI_LOG セッション D20260528_007 — /flow:release (shipyard 初回)

**実行日時**: 2026-05-28 13:00 〜 (進行中)
**コマンド**: /flow:release (auto dispatch from D20260528_003 反復 4)
**対象**: shipyard 初回 release (§3.1c scaffold 生成 → Phase 1 FILL → Phase 2 動作確認 → Phase 3 デプロイ)
**実行者**: Claude (Opus 4.7) + seiji
**状態**: 進行中 (§3.1c scaffold 生成完了、Phase 1 FILL 方針確認待ち)
**含まれる decision**: D20260528-022 〜 D20260528-023 (進行中)

---

## §1.0 live 化状態判定 (CF-20260528-011 SoT 順序)

| Source | 確認 | 結果 |
|---|---|---|
| ① `.env.production.local` の `CLERK_SECRET_KEY` prefix | 不在 (本セッションで scaffold 生成) | (判定不能 → 初回) |
| ② `vercel env ls production` | 本セッションで未実行 (要ユーザー認証) | (skip) |
| ③ SCENARIO §5 (fallback) | 「Phase 3 unit 完了、E2E + 視覚レビュー + /flow:wording は実キー環境で実行」「Phase 4 公開準備着手前」 | **未デプロイ確定** |

**判定**: **初回 release**。§3.1c scaffold 4 ファイル (`.env.production.example` / `.env.production.local` / `scripts/sync-prod-env.sh` / `scripts/deploy-prod.sh`) を生成 → Phase 1 FILL は `.env.production.local` を対象 → Phase 2 動作確認 → Phase 3 デプロイ。本 PJ は無課金 LP のため Stripe live 化不要、Clerk は初回は dev/test キー → 本格運用で production instance 切替判断 (concept §4.7 サブドメイン確定後)。

**重要修正 (CF-20260528-012)**: 当初 §1.1 不足検出を `.env.local` 対象で提示したが、release.md §3.1c の契約に従い `.env.production.local` 対象に修正。ユーザー [flow] 指摘「.env.production.local を用意するという契約のはずです」で発覚 + 補強案 CF inbox 追記済。

## §3.1c scaffold 生成完了 (Class A、本セッションで実行)

- ✅ `.env.production.example` — 本番値テンプレート (commit 可、provider 別取得手順コメント付)
- ✅ `.env.production.local` — 本番値の単一 source (gitignored = `.env*.local`、人間が値を貼る)
- ✅ `scripts/sync-prod-env.sh` — Vercel 永続 env (production) に冪等同期 (parse 堅牢化済: 空白+#インラインコメント除去 + trim + 空値キー削除)
- ✅ `scripts/deploy-prod.sh` — sync → `vercel deploy --prod` (Class B、明示承認後実行想定)
- 既存 `scripts/dev.sh` / `scripts/stop.sh` (O36) と組み合わせ

## §1.1 不足検出 (.env.production.example vs .env.production.local)

`.env.production.local` 生成直後 = **全 15 var 未設定 (placeholder のみ)**。`.env.production.example` SoT から provider 別グルーピング:

### 必須収集 (公開 LP として動かす最低限、12 var)
| # | provider | var | 取得元 | プレフィクス |
|---|---|---|---|---|
| 1 | **Neon** | `DATABASE_URL` | console.neon.tech → プロジェクト作成 → Connection string | `postgresql://...` |
| 2 | **Clerk** (dev) | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | dashboard.clerk.com → API Keys → Publishable key | `pk_test_...` |
| 3 | **Clerk** (dev) | `CLERK_SECRET_KEY` | 同上 → Secret key | `sk_test_...` |
| 4 | 設定 | `OPERATOR_EMAILS` | seiji の Clerk admin メール | `seiji@...` |
| 5 | **Resend** | `RESEND_API_KEY` | resend.com/api-keys → Create | `re_...` |
| 6 | 設定 | `MAIL_FROM` | Resend で verify したドメインの送信元 | `noreply@<domain>` |
| 7 | 設定 | `OPERATOR_EMAIL` | 通知受信先 | `seiji@...` |
| 8 | **Cloudflare Turnstile** | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | dash.cloudflare.com → Turnstile → サイト作成 | `0x4AAAA...` |
| 9 | **Cloudflare Turnstile** | `TURNSTILE_SECRET_KEY` | 同上 → secret | `0x4AAAA...` |
| 10 | 設定 | `SITE_URL` | concept §4.7 確定済 `shipyard.<seiji 既存ドメイン>` | `https://shipyard.<domain>` |
| 11 | **生成可** (Class A) | `CRON_SECRET` | `openssl rand -hex 32` | hex 64 文字 |
| 12 | **生成可** (Class A) | `HUB_SHARED_SECRET` | 同上 (service-hub 側にも同じ値を設定要) | hex 64 文字 |

### 任意 / 後回し可
- `HUB_STATUS_URL`: service-hub PJ デプロイ後の公開 URL。本 PJ は [論点-001] contract 確定後にモック → 実差し替え予定。**初回は placeholder OK**
- `SENTRY_DSN`: 本番のみ必要、無料枠で後回し可
- `COST_*`: 全て `0` で固定 (無料枠運用、concept §4.6)

## 依存関係

- 親 dispatch: `D20260528_003_resume_continuous.md` (flow:auto 反復 4)
- 元 secure: `D20260527_022_secure_product.md` (CRON_SECRET / HUB_SHARED_SECRET = O25 秘密情報)
- 元 concept: `D20260527_001_concept_initial.md` (§4.7 公開戦略 = サブドメ運用、既存ドメイン活用)

## 生成・更新したアーティファクト (完了時に確定)

- 新規: `.env.local` (Phase 1 FILL 結果、gitignored、本セッションで作成予定)
- 更新: `docs/PREREQUISITES.md` (取得状況更新)
- 公開: shipyard.<domain> (Phase 3、Class B 明示確認後)

## 学習・改善 (完了時)

---

## Decisions (進行中)

```yaml
- id: D20260528-022
  timestamp: 2026-05-28T13:00:00+09:00
  command: /flow:release
  phase: Step 0 / §1.0 live 化判定
  question: 本 PJ の live 化状態
  options: []
  recommended: null
  chosen: 初回 release (§3.1c scaffold 生成 + Phase 1 FILL から開始)
  chosen_type: auto-recommended
  depends_on: [D20260527-013, D20260528-021]
  context: |
    SoT 順序 ① .env.production.local 不在、② vercel env ls 未実行、③ SCENARIO §5 fallback
    で「Phase 4 公開準備着手前」「実キー環境で実行」と明示。本セッションは初回 release。
    §3.1c scaffold 4 ファイル (.env.production.example / .env.production.local /
    scripts/sync-prod-env.sh / scripts/deploy-prod.sh) を auto-pick で生成。

- id: D20260528-023
  timestamp: 2026-05-28T13:10:00+09:00
  command: /flow:release
  phase: Step 0.5 / §3.1c scaffold 生成 + CF-20260528-012 修正
  question: §1.1 不足検出 + Phase 1 FILL の対象は .env.local か .env.production.local か
  options:
    - .env.local (誤、ローカル dev 用 test キー専用)
    - .env.production.local (正、§3.1c 契約に従う) (Recommended)
  recommended: .env.production.local
  chosen: .env.production.local
  chosen_type: explicit-choice (CF-20260528-012 ユーザー指摘で修正)
  depends_on: [D20260528-022]
  context: |
    当初 §1.1 不足検出を「.env.example vs .env.local」で提示し Phase 1 FILL 方針 3 択を
    出したが、release.md §3.1c CF-20260528-008 「新サービス release では .env.production.local
    を最初から source として用意」契約に従わず誤適用。ユーザー [flow] 指摘で発覚、CF-20260528-012
    として inbox 追記、本セッションでは §3.1c scaffold 4 ファイル生成 + FILL 対象を
    .env.production.local に修正。release.md 補強コミットは別途ユーザー承認後。
```
