# クレーム判定レポート

**claim id**: C20260608-001
**判定日**: 2026-06-08
**判定者**: Claude (Opus 4.8) + seiji
**判定**: 仕様検討漏れ (revise)

## 1. 三項照合

### 1.1 期待 (Expected)
HUB に登録された全サービス（3 件）が shipyard 稼働一覧に**タイムリーに**表示される（concept §1.1「リアルタイム稼働状況」由来の期待）。

### 1.2 既存仕様 (Spec)
- `docs/service-status/001_*_SPEC.md` UC-S5: **「トリガー: Vercel Cron（N 分間隔）」** — リアルタイム最新化を意図。
- 同 SPEC §62: **「Cron 間隔は実装時に確定（Vercel Hobby の cron 制約 + HUB 負荷で N 分）」** — 間隔の確定を実装時に委譲。
- `docs/_shared/hub-client/001_*_SPEC.md` §46: 「Cron N 分間隔、画面は cache のみ」。
- concept §1.1: 中核価値 =「リアルタイム稼働状況による『本当に動いている』実装力の信頼」。

### 1.3 現実 (Actual)
- `vercel.json` crons: `{ "path": "/api/cron/refresh-status", "schedule": "0 0 * * *" }` = **日次 1 回**。
- この値は AI_LOG `D20260529_001` 記載の commit **`4a1466a` "vercel.json cron Hobby 対応"** で、**Vercel Hobby プランの cron 制約（無料プランは 1 日 1 回まで）に合わせて意図的に設定**されたもの（ユーザー確認: 「cron 日次は Vercel の仕様でしょう」）。
- 実測: HUB = 3 件 / shipyard `/api/services` = 2 件（naze-bako 欠落）、`fetchedAt` 全行 `2026-06-07T00:24:12Z`。コード経路（client→cache→repo→page）に欠陥はなく、日次 cron が設計通り（=制約通り）動作している結果。

### 1.4 照合結果
- 期待 = SPEC の「N 分間隔（リアルタイム）」意図と一致。
- 現実 = 実装は SPEC §62 の「実装時に確定」条項に従い、**Vercel Hobby 制約で日次に確定**。実装は SPEC に違反していない（= バグではない）。
- ただし「日次確定」という解決が **concept のリアルタイム価値提案と乖離**しており、その乖離を埋める補償機構（オンデマンド再検証 / リクエスト駆動 read-through / 別取得経路 / プラン変更）が**設計されていない** = **仕様検討漏れ**。

## 2. 判定根拠

1. cron が壊れている事実はない。前回 06-07 00:24 / 次回 06-08 00:00 UTC で、調査時点のキャッシュ状態は健全な日次 cron と完全に整合する（即時症状は次回 cron で自然解消）。よって「現実 ≠ SPEC」型の**バグ (fix) ではない**。
2. 日次 schedule は Vercel Hobby のプラットフォーム制約による意図的設定。`*/5 * * * *` 等への一行変更は Vercel Hobby が拒否するため、**schedule 修正では直せない**。これも fix を否定する。
3. SPEC §62 が間隔確定を実装に委譲しており、実装はその条項を満たしている。一方で「日次では concept のリアルタイム価値提案を満たせない」という**設計上の穴は誰も埋めていない** → 灰色ケースは仕様明確化優先（claim 根本原則 #6）+「SPEC 記載あるが意図と乖離 → revise」ガイドに該当。
4. 該当機能（service-status）の SPEC は存在する → **feature ではない**。
5. 以上より **仕様検討漏れ (revise)**。Vercel Hobby 制約下でリアルタイム鮮度を担保する更新戦略の再設計が必要。

## 3. 推奨分岐先

- **コマンド**: `/flow:revise`
- **引数**: `service-status C20260608-001 --from-claim=C20260608-001`
- **scope**: medium（更新戦略の再設計 + hub-client/cache 連携。DB schema 変更は最小〜不要見込み）
- **優先度**: medium（中核価値に関わるが即時症状は次回 cron で解消、データ毀損なし）
- **revise で詰める設計論点（候補）**:
  - 案 A: **リクエスト駆動 read-through cache（TTL）** — `/api/services`・トップ描画時に最新 `fetchedAt` が N 分超なら inline で HUB fetch + upsert。Vercel cron 非依存。HUB 負荷は TTL + キャッシュで抑制。Hobby でも実現可・追加コストなし（**有力**）。
  - 案 B: **オンデマンド再検証 webhook** — HUB が registry 変更時に shipyard を叩く。即時性は最高だが HUB 側改修が必要（別 repo）。
  - 案 C: **クライアント側ポーリング** — ブラウザが定期取得。ただし参照先キャッシュ自体が古いままなら無意味 → 案 A と併用前提。
  - 案 D: **Vercel プラン変更（Pro）で頻繁 cron** — コスト発生、撤退容易性（concept の軽量構成方針）と相性悪。
  - 補足: up/down 鮮度（障害時の「up」誤表示）も同根。再設計はこの観点も含めること。

## 4. 却下時の対応
（該当なし）

## 5. 判定保留時の論点
（該当なし）

## 6. 関連

- クレーム原文: `./000_CLAIM_REPORT.md`
- 基準 SPEC: `../001_service-status_SPEC.md` §UC-S5 / §62、`../../\_shared/hub-client/001_hub-client_SPEC.md` §46
- 実装: `vercel.json`（cron schedule）/ `lib/hub/cache.ts` / `app/api/services/route.ts` / `app/api/cron/refresh-status/route.ts`
- 根拠 commit: `4a1466a`（vercel.json cron Hobby 対応、AI_LOG `D20260529_001`）
- 分岐先サブフォルダ: `../revise_C20260608-001_20260608_realtime-refresh-gap/`（Step 6 で生成）
