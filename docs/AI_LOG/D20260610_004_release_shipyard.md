# AI_LOG セッション: /flow:release shipyard

- **実行日時**: 2026-06-10 (Asia/Tokyo)
- **コマンド**: /flow:release
- **対象**: shipyard (本番 redeploy — /legal/commerce 特商法ページ反映)
- **実行者**: seiji
- **状態**: 完了 (本番デプロイ済 + smoke green)

metrics:
  deploy_target: production
  deployed_url: https://shipyard.givers.work
  collected_vars: 0 (新規 env なし)
  check_result: build ✓ + post-deploy /legal/commerce 200 + 特商法コンテンツ/sitemap 確認
  paid_confirmed: n/a (静的ページ、課金なし)

## 含まれる decision 範囲
live 判定 / env 不足検出 / Phase2 build 検証 + sitemap 修正 / Phase3 デプロイ Class B / post-deploy smoke。

## 主要決定サマリ
| decision_id | テーマ | chosen | type |
|---|---|---|---|
| D20260610-018 | live 判定 + 対象 | 本番稼働中の redeploy。Clerk=test だが無課金+admin-only → CF-005 例外で許容。env 不足なし（静的ページ追加）。 | auto-recommended |
| D20260610-019 | Phase2 build 検証 | npm run build ✓ (/legal/commerce static prerender)。sitemap 欠落を検出し PUBLIC_PATHS に追加 (48373a4)。 | auto-recommended |
| D20260610-020 | Phase3 Class B デプロイ | ユーザー承認 → bash scripts/deploy-prod.sh 実行。本番 aliased shipyard.givers.work。 | explicit-choice |
| D20260610-021 | post-deploy smoke | /legal/commerce 200 + 特商法コンテンツ + sitemap 確認 = green。 | auto-recommended |

## 依存関係
- 直前: D20260610_003_tdd (実装完了) / push 済 (d95d96b、ただし push≠deploy = CLI deploy 必要)

## 生成・更新したアーティファクト
- 本番デプロイ: dpl_CTRF5u2WrvJNaoHHLNM4N5R4vsvh → https://shipyard.givers.work (Aliased)
- コード: lib/seo/config.ts (PUBLIC_PATHS に /legal/commerce 追加、48373a4)
- AI_LOG: 本セッション

## 学習・改善
- tdd フェーズで sitemap (PUBLIC_PATHS) への新ページ追加が漏れていた。静的ページ revise では SEO 列挙への追加も DoD に含めるべき (release Phase2 build 検証で捕捉できた)。
- promote HOOK は skip: shipyard は既に launch/promote 済 (D20260529_006)。本リリースは特商法ページ追加の保守 redeploy で新規 launch 告知ではない。

---

## Decisions

```yaml
- id: D20260610-018
  timestamp: 2026-06-10T07:10:00+09:00
  command: /flow:release
  phase: Step 0 / §1.0 live 判定 + 対象確定
  question: リリース対象と live 化状態
  options: []
  recommended: 本番 redeploy (env 変更なし)
  chosen: |
    shipyard は本番稼働中 (shipyard.givers.work, Phase 5)。本リリース = /legal/commerce 特商法ページの本番反映 (redeploy)。
    §1.0 prefix 判定: prod Clerk = pk_test_/sk_test_。ただし shipyard は (a) 本サイト無課金 (lead-gen のみ、決済は各サービス側),
    (b) Clerk は admin gate のみ (単一運用者) のため CF-005 例外 = dev instance 継続許容。本 revise は静的ページ追加で auth/課金に無関係。
    env 不足: .env.example vs .env.production.local 差分なし (新規 env 不要)。
    push≠deploy (ユーザー確認) のため CLI deploy (scripts/deploy-prod.sh) が必要。
  chosen_type: auto-recommended
  depends_on: [D20260610-016]
  context: 既存 live アプリへの静的ページ追加。Phase 1 FILL skip。

- id: D20260610-019
  timestamp: 2026-06-10T07:08:00+09:00
  command: /flow:release
  phase: Phase 2 ローカル動作確認 (build 検証)
  question: 本番ビルドで /legal/commerce が compile するか
  options: []
  recommended: npm run build で検証
  chosen: |
    npm run build ✓。/legal/commerce が ○ (Static) prerender。
    検証中に sitemap (lib/seo/config.ts PUBLIC_PATHS) への新ページ追加漏れを検出 → 追加 (48373a4)、seo+legal test 24 green。
    静的ページのため実機スマホ目視は build 検証 + post-deploy smoke に統合 (課金系なし)。
  chosen_type: auto-recommended
  depends_on: [D20260610-018]
  context: 静的ページ + 既存 live app。

- id: D20260610-020
  timestamp: 2026-06-10T07:12:00+09:00
  command: /flow:release
  phase: Phase 3 デプロイ (Class B 明示確認)
  question: 本番デプロイを実行するか
  options: [本番デプロイ実行, 自分でデプロイ, まだしない]
  recommended: 本番デプロイ実行
  chosen: ユーザー承認 → agent が bash scripts/deploy-prod.sh 実行。dpl_CTRF5u2... → Aliased https://shipyard.givers.work (READY, target=production)。
  chosen_type: explicit-choice
  depends_on: [D20260610-019]
  context: Next.js ネイティブビルド。deploy-prod.sh = sync-prod-env → vercel deploy --prod。masked-secret で agent 実行 (CF-20260529-018)。

- id: D20260610-021
  timestamp: 2026-06-10T07:14:00+09:00
  command: /flow:release
  phase: §3.4 post-deploy smoke
  question: 本番で /legal/commerce が正しく公開されたか
  options: []
  recommended: green
  chosen: |
    https://shipyard.givers.work/legal/commerce → 200。
    特商法コンテンツ (特定商取引法に基づく表記 / QUADii / 四伊清司 / 作者応援寄付 / 追加オプション / powered by givers.work) 全表示。
    sitemap.xml に /legal/commerce 含まれる。
  chosen_type: auto-recommended
  depends_on: [D20260610-020]
  context: 静的ページのため O51 (api 500)・O22 (auth 401)・webhook は非該当 (新規 api/webhook なし)。
```
