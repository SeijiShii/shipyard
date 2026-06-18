<!-- auto-generated-start -->
# 設計レベル脆弱性レビュー — shipyard (release-pre 2段目)

**レビュー日**: 2026-06-18
**レビュー実施者**: Claude (Opus 4.8 1M) + seiji
**対象**: [論点-010] summary 表示 (cbb8bb4) + [論点-009] rebrand (7352722) + legal tokushoho revise (D20260610) 差分
**入力**: components/status/StatusCard.tsx / app/api/services/route.ts / lib/hub/contract.ts / components/seo/JsonLd.tsx
**観点ソース**: ~/.claude/flow-data/perspectives.md (O23-O28)
**契機**: §3.0c release-pre 必須監査 2段目 (1段目 = AUDIT_20260618_1210 Critical 0 / High 0)

## 1. PJ 性質判定
- QUADii 公式 showcase サイト (givers.work)、公開・無収益 (応援寄付 + 有料オプションは Stripe 別経路)、operator-gated admin。
- 本差分の新 surface = service-hub 公開 status API から summary を read → StatusCard 描画 (read-only consumer)。

## 2. 脆弱性パターン照合結果 (差分)

### 2.1 サマリ
- Critical: 0 / High: 0 / Medium: 0 / Low: 0 / Info: 1
- 法令必須未対応: 0

### 2.2 詳細

#### [SEC-design] summary (producer 由来テキスト) の表示 — 対応済 ✅
- **O24/XSS**: `StatusCard.tsx` は `<span ...>{summary}</span>` で JSX テキスト式として描画 → **React が自動エスケープ = stored XSS 安全**。`dangerouslySetInnerHTML` 不使用。`summary?.trim()` で正規化済。
- **O23 認可**: `app/api/services/route.ts` は service-hub の**既に公開**の `/api/public/status` 安全サブセットを read-only 消費・cache するのみ。新たな認可境界・書込経路なし。summary は上流が public-safe として露出した値。
- **O25 秘密情報**: summary は producer 自己申告の公開向け showcase 文。内部秘密を含まない (上流 service-hub 側で安全投影済、SECURITY_REVIEW_20260618_1140 で確認)。
- **O28 deps**: lockfile 変更なし = 新規依存なし → CVE 面の変化なし。
- [論点-009] rebrand / legal tokushoho: 静的テキスト変更 (ブランド名・特商法表記)。新たな入力・実行経路なし。

#### [SEC-info-01] JsonLd.tsx の dangerouslySetInnerHTML (pre-existing、Info)
- `components/seo/JsonLd.tsx` が JSON-LD 構造化データを `dangerouslySetInnerHTML` で出力 (既存)。入力は `JSON.stringify` 済の制御された metadata で、**summary field は JSON-LD に流れていない**ため本差分の影響なし。**将来 summary を構造化データに含める場合は `JSON.stringify` + `<` エスケープを維持すること** (今回は非該当)。

## 3. §8 未決事項に登録した論点
- なし (新規 Critical/High SEC finding 0 件)。

## 4. 次のステップ
- release-pre 必須監査 2段クリア (audit Critical 0/High 0 + secure 新規 SEC 0) → P4.7 Release gate 評価可能。
- shipyard redeploy ([論点-009/010] 本番反映、db:migrate summary 列 + redeploy) = Class B、ユーザー承認時に `/flow:release`。
<!-- auto-generated-end -->
