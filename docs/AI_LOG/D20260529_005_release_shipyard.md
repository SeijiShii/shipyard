# AI_LOG セッション D20260529_005 — /flow:release --resume (Phase 3 状態確認 + live化境界)

**実行日時**: 2026-05-29 09:20 (+09:00)
**コマンド**: /flow:release --resume
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 完了 (ユーザー確認により Release 工程は全完了 = deploy + subdomain + Turnstile live + 投稿まで user 側で実施済)
**含まれる decision**: D20260529-004 (1 件)

> **2026-05-29 追記 (ユーザー確認)**: 本番デプロイ・サブドメイン (`shipyard.givers.work`)・Turnstile 実キー化・promote 投稿は **すべて user 側で実施済** と確認。flow 側の記録が drift していただけ。残るは告知文「生成」(flow が一度も実行していなかった = CF-20260529-002) で、D006 promote で生成完了。Release gate (P4.7) + Promote gate (P4.8) 実態通過。

---

## §1.0 live化状態の判定 (CF-20260528-011、SoT 順序)

- **① `.env.production.local` prefix**: Clerk `sk_test_`/`pk_test_` (dev instance `main-badger-13.clerk.accounts.dev`)、Turnstile `0x4AAAAA...` (test keys、always-pass)、MAIL_FROM=noreply@givers.work、RESEND `re_` → **test/dev mode** (live 化未了)
- **② `vercel env ls production`**: auto-mode classifier により拒否 (prod read 明示承認要)。① で判定確定のため不要。
- **判定**: test/dev のまま。ただし shipyard は **課金なし** (concept §9、Stripe 不在) → B-4 実課金は非該当。live 化の実需 = **公開フォームの Turnstile 実キー** (test keys = spam 保護実質オフ) + 公開 URL の subdomain。Clerk は単一運用者 admin gate のため dev instance 継続可 (CF-005 例外)。

## 重要発見: 本番デプロイは既に完了済 (drift)

- **`vercel ls`**: `https://shipyard-c1dnxfgn2-quadiishii-9506s-projects.vercel.app` **Status=Ready, Environment=Production, 11h ago** (= 2026-05-28 ~22:20)。
- commit timeline: 最後の code/config commit `4a1466a` (vercel.json cron, 21:49) は deploy (~22:20) より前 → **本番 deploy は現 HEAD code を含む** (O48 revert + cron fix 反映済)。本日 (2026-05-29) の 3 commits は docs-only = 再デプロイ不要。
- この本番 deploy を記録した AI_LOG セッションが無い (D025 release inline fix の後に実施されたが未記録) = SCENARIO §5 が「Phase 3 デプロイ残」と stale 表記していた一因。**実状 = Phase 3 デプロイ済 (test mode)**。

## 現状サマリ (P4.7 Release gate の実態)

| 項目 | 状態 |
|---|---|
| 本番デプロイ | ✅ 完了 (test mode、raw .vercel.app URL、現 HEAD code) |
| unit テスト | ✅ 170 GREEN |
| release-pre 監査 | ✅ audit+secure PASS (本日 D002/D004) |
| 動作確認 (contact/email/cron/favicon) | ✅ ユーザー確認済 (D007) |
| **subdomain** (`shipyard.givers.work`) | ⏳ 未設定 (raw .vercel.app) = §3.2、promote の前提 (CF-008) |
| **Turnstile 実キー** | ⏳ test keys (公開フォーム spam 保護実質オフ) = Class C live化 |
| Clerk | dev instance (単一運用者 admin gate、CF-005 例外で継続可) |
| promote (告知) | ⏳ 未実行 (P4.8、subdomain 確定後) |

## 1-decision pause (Class C/B 境界)

no-key/Class-A 作業は枯渇 (audit/secure fresh、unit green、E2E は [論点-005] で post-release に user 委任、deploy 済)。残りは全て human-input 依存:
- subdomain DNS (user の DNS provider 操作)
- Turnstile 実キー (Class C、user が値を持つ)
- promote 投稿 (Class C、user 発信)

auto-pick-policy §1.5.5 の正当な停止 (Class C 本質入力)。ユーザーに subdomain 確定を最優先で 1 問確認 (concept §4.7 = `shipyard.<domain>`、givers.work 確定済 = MAIL_FROM/service-hub と整合)。

## 依存関係

- 親 chain: D001 resume → D002 audit → D003 scenario → D004 secure → 本 release
