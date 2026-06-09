# 実装レポート: legal（特商法表記の追加 + 業態整合）

## 実装日時
2026-06-10 06:56 (JST)

## モード
revise

## 関連ドキュメント
- [001_REVISE_SPEC.md](./001_REVISE_SPEC.md) — 変更仕様書（§7.6 = 特商法コンテンツ SoT）
- [002_REVISE_PLAN.md](./002_REVISE_PLAN.md) — 変更計画書
- [003_REVISE_UNIT_TEST.md](./003_REVISE_UNIT_TEST.md) — 単体テスト計画
- [AI_LOG セッション](../../AI_LOG/D20260610_003_tdd_legal_revise_tokushoho-stripe.md) — 設計判断ログ

## 注意事項
本レポートのファイルパス・行番号は実装日時時点のもの。

## 変更一覧

### Phase 1: 特商法ページ（軽・メイン直接）
- **新規** `features/legal/CommerceContent.tsx` — 特商法本文（SPEC §7.6 準拠）。販売事業者（QUADii / 四伊清司 / 所在地 / 電話 / メール / お問い合わせ）/ サービス内容・料金（作者応援寄付・追加オプション・支払・提供時期・動作環境）/ キャンセル・返金 / その他。`Row` ヘルパ（dt/dd grid）で法定項目を表示。法定公開情報＝SEC-001 PII 対象外をコメント明記。
- **新規** `app/legal/commerce/page.tsx` — `/legal/commerce` ルート（SSG, index 可）。privacy/terms と同型（Header + max-w-2xl + Footer）。`buildMetadata({ title: "特定商取引法に基づく表記", path: "/legal/commerce" })`。

### Phase 2: Footer 拡張（軽・メイン直接）
- **変更** `components/layout/Footer.tsx` — nav に「特定商取引法に基づく表記」(`/legal/commerce`) リンク追加（`flex-wrap` 化）。最下部に `powered by givers.work` 文言を追加（既存「AI 駆動開発で週1ペース…」と並記）。

### Phase 3: 設計文書整合（軽・メイン直接、非コード）
- **変更** `docs/concept.md` §1.2（課金・特商法不要 → 業態整合の注記で課金あり・特商法必要に反転）/ §9 リード文 + §9.1 表（特商法 ❌不要 → ✅作成済 `/legal/commerce`）/ §4.7.1（apex `givers.work` → shipyard 方針 + powered by 注記）。
- **変更** `docs/legal/001_legal_SPEC.md` §5 連携 / §7 スコープ外（特商法不要 → スコープ内化、UC-LG3 参照）。

## テスト
- 追加: CommerceContent 4 件（U-CM1 法定見出し / U-CM2 事業者情報 / U-CM3 業態文言 / U-CM5 単発のみ negative）+ commerce metadata 1 件（U-CM4）+ Footer 3 件（U-FT1 特商法リンク / U-FT2 powered by / U-FT3 既存リンク維持）= 計 8 件。
- legal.test.tsx: 5 → 13 件 GREEN。
- 全スイート: **192/192 GREEN**（184 → +8、リグレッションなし）。

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | なし |
| 計画から省略した変更 | なし |
| 想定外の問題と対処 | なし。U-CM5 negative assertion（定期/継続課金/サブスク/解約 を含まない）で旧 GIVErS 条項の混入を機械的に防止 |

## PR Description

### タイトル
legal: 特定商取引法に基づく表記ページ追加 + 業態整合（寄付PF→マイクロサービス運営）

### 概要
QUADii の Stripe 決済アカウント審査に提示する特定商取引法ページ（`/legal/commerce`）を新設。shipyard を「公開済みマイクロサービスへの作者応援寄付 + 有料追加オプション販売（単発）」を行う個人事業の公式 HP と位置づけ、concept の「課金なし→特商法不要」を実態へ反転。Footer に特商法リンク + `powered by givers.work` を追加。

### 変更内容
- 新規 `/legal/commerce` ページ + 本文コンポーネント
- Footer に特商法リンク + `powered by givers.work`
- concept §1.2/§9/§4.7 + legal/001 SPEC の SoT 反転（特商法 不要→必要、apex ドメイン方針）

### テスト
- 単体 +8 件（特商法本文 / metadata / Footer）、全 192/192 GREEN
- DB 変更なし（MIGRATION 不要）

### 残（DoD 外・ユーザー手動 = Class B）
- 本番デプロイ → Stripe 審査への `/legal/commerce` URL 提示 → apex `givers.work` の DNS 切替（特商法本番反映後）
