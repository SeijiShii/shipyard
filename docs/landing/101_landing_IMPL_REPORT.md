# 実装レポート: landing

## 実装日時
2026-05-27 16:04 (JST)

## モード
feature（UI・トップページ）

## 関連ドキュメント
- [001_landing_SPEC.md](./001_landing_SPEC.md) / [002_…_PLAN.md](./002_landing_PLAN.md) / [003_…_UNIT_TEST.md](./003_landing_UNIT_TEST.md) / [004_…_E2E_TEST.md](./004_landing_E2E_TEST.md)（E2E は /flow:e2e）
- [AI_LOG セッション](../AI_LOG/D20260527_019_tdd_continuous.md)

## 変更一覧

### Phase 1: page 骨格 + Hero
- `app/page.tsx` — トップ（scaffold placeholder を置換）。Header → Hero → 稼働一覧（StatusList）→ ValueSection → ConsultPitch → Footer。`metadata = buildMetadata({path:"/"})`、JSON-LD（WebSite/Person）埋込
- `features/landing/Hero.tsx` — リード文 + CTA（→/contact、O41）

### Phase 2: Value + ConsultPitch + 稼働一覧埋込
- `features/landing/ValueSection.tsx` — 提供価値 3 点（誠実・控えめ）
- `features/landing/ConsultPitch.tsx` — コンサル打ち出し + CTA→/contact（煽らない）
- 稼働一覧は `features/service-status/StatusList`（getCachedStatus）を埋込。取得失敗時も EmptyState で graceful（L-E1）

### SEO 連携
- `components/seo/JsonLd.tsx` — JSON-LD 埋込（静的データのみ、"<" エスケープで </script> ブレイクアウト無害化、SEC-003 の禁止対象=ユーザー本文と峻別）

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | `JsonLd` 共通コンポーネントを新設（escaped、静的データ専用の単一窓口）。リード文/価値/コンサル文言は仮置き（design SoT §7 起点、最終は /flow:wording） |
| 計画から省略した変更 | route group `(public)` は作らず `app/page.tsx` を直接置換（URL 同一、group は組織化のみ・将来導入可）。Phase 3.5 bootstrap は service-status/inquiry 側 |
| 想定外の問題 | SEC-003「dangerouslySetInnerHTML 禁止」と JSON-LD の必要性が衝突 → 静的データ限定 + `<` エスケープの定石で両立（JsonLd に集約、report で明示。security レビュー時に確認可） |

## PR Description
### タイトル
landing: トップ LP（ヒーロー/稼働一覧/価値/コンサル CTA）
### 概要
初見でも「動いているサービス + AI 駆動開発のメイカー + 相談できる」が伝わる LP（O41）。稼働一覧を埋め込み、CTA で問い合わせへ誘導（煽らない）。
### 変更内容
- Hero/ValueSection/ConsultPitch + StatusList 埋込 + Header/Footer
- buildMetadata（OGP/Twitter）+ JSON-LD（WebSite/Person、escaped）
### テスト
- 単体 5 件、全 GREEN。全体 117/117（100%）、typecheck クリーン。視覚レビュー/入口理解/コピーは Phase 3（design --review-only / wording）、E2E は /flow:e2e。
