# AI_LOG セッション D20260527_001 — /flow:concept (initial)

**実行日時**: 2026-05-27 (+09:00)
**コマンド**: /flow:concept
**対象**: プロジェクト全体（初版作成）
**実行者**: Claude (Opus 4.7) + seiji
**状態**: 完了
**含まれる decision**: D20260527-001 〜 D20260527-013 (13 件)
**ファイル**: `D20260527_001_concept_initial.md`

---

## 主要決定サマリ（1〜10 件、人間向け要約）

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260527-002 | 永続化 | Neon-backed (問い合わせスレッド管理のため DB 必要) | non-recommended |
| D20260527-003 | 問い合わせ形式 | サイト内スレッド形式 (会話継続) | explicit-choice |
| D20260527-004 | 問い合わせ者識別 | メアド必須 + メールバリデーション | explicit-choice |
| D20260527-005 | スパム対策 | 不可視スタック (Turnstile+honeypot+timing+rate limit+MX)、検証リンクなし | auto-recommended |
| D20260527-006 | デザイン方向 | 信頼感 × ミニマル × クラフト感 | auto-recommended |
| D20260527-007 | フロント FW | Next.js (App Router、SEO のため Vite override) | auto-recommended |
| D20260527-008 | リソース選定 | §3.1 無料枠バンドル (Neon/Clerk(admin)/Resend/Turnstile/Vercel/Sentry) | auto-recommended |
| D20260527-009 | 外部 AI | 使わない | auto-recommended |
| D20260527-010 | HUB contract | (open) §8 [論点-001] | open |

## 依存関係（このセッションが依存する他セッションの decision）

- D20260527-002 → 依存: [D20260527-003]（同セッション内）
- D20260527-005 → 依存: [D20260527-003, D20260527-004]（同セッション内）
- D20260527-007, 008 → 依存: [D20260527-001]（preferences）
外部依存: なし（初版セッション）

## 生成・更新したアーティファクト

- 新規: `docs/concept.md`（§1〜§11）
- 新規: `docs/INDEX.md` / `docs/DOC_MAP.md` / `docs/PREREQUISITES.md` / `docs/SCENARIO.md`
- 新規: 機能フォルダ 5（landing / service-status / inquiry / admin / legal）の README + INDEX
- 新規: 横断フォルダ 7（_shared/{db,ui,seo,hub-client,email,spam,auth}）の README + INDEX
- 新規: `docs/AI_LOG/INDEX.md` + 本セッションファイル
- 新規: `README.md`（ルート）
- 更新: `docs/wants.md`（クリーンアップ、Step 5.5）
- 更新: `~/.claude/flow-data/preferences.md`（Step 7.5、承認後）

## 学習・改善（このセッションで /flow:concept に組み込んだ自己学習）

- 特になし（既存テンプレートで充足）。問い合わせ機能を「サイト内スレッド形式」に再定義する
  際の「スパム防止 vs メール到達保証の分離」議論は perspectives O27 の運用知見として有用。

---

## Decisions

```yaml
- id: D20260527-001
  timestamp: 2026-05-27T12:09:00+09:00
  command: /flow:concept
  phase: Step 1.7 / preferences 読込
  question: preferences.md 読込
  options:
    - 読込結果サマリ
  recommended: null
  chosen: |
    preferences.md (最終更新 2026-05-27、学習元 4 PJ: hana-memo / service-hub /
    bousai-bag-checker / naze-bako) を読込。強い選好 (採用 4): React+TS(Vite) /
    Vercel Hobby / Sentry / GitHub Actions+Vercel Preview / shadcn/ui+Tailwind。
    傾向 (採用 3): Vercel Functions / Neon / Clerk / Drizzle。§3.1 個人ツール/無料枠
    パターンが本 PJ (公開マイクロサービス連発) に適合。
  chosen_type: auto-recommended
  depends_on: []
  context: |
    Step 1.7 で seiji の PJ 横断選好を推奨バイアス源として読込。
    本 PJ は公開・認証なしのため Clerk(認証) は end-user 向けには不要な可能性。

- id: D20260527-002
  timestamp: 2026-05-27T12:15:00+09:00
  command: /flow:concept
  phase: Step 2 / 永続化アーキテクチャ
  question: データ永続化を DB-less にするか Neon-backed にするか
  options:
    - DB-less (Vercel ネイティブ) (recommended)
    - Neon-backed (既存スタック踏襲)
  recommended: DB-less (Vercel ネイティブ)
  chosen: Neon-backed (既存スタック踏襲)
  chosen_type: non-recommended
  depends_on: [D20260527-003]
  context: |
    当初は公開 LP で持続的業務データが薄いと判断し DB-less を推奨したが、
    seiji が「問い合わせをサイト内スレッド形式で管理したい」と要件を再定義。
    スレッド/メッセージ/問い合わせ者の永続管理が必要になったため Neon-backed に確定。
    §3.1 個人ツール/無料枠パターン (Neon 無料 10 DB / サービスごと DB 分離) と整合。

- id: D20260527-003
  timestamp: 2026-05-27T12:15:00+09:00
  command: /flow:concept
  phase: Step 2 / 問い合わせ機能の形式
  question: 問い合わせはメール送信完結か、サイト内スレッド形式か
  options:
    - メール/Slack 通知のみ (wants 初期案)
    - サイト内スレッド形式 (会話継続)
  recommended: null
  chosen: サイト内スレッド形式 (会話継続)
  chosen_type: explicit-choice
  depends_on: []
  context: |
    seiji 明示「メールではなく、サイト内スレッド形式にしたい」。
    問い合わせ → スレッド生成 → 運用者(seiji)がサイト内で返信 → 会話継続。
    wants の「送信は通知(メール or Slack)」は『新着のお知らせ通知』として残り、
    会話本体はサイト内スレッドに移行。問い合わせ管理機能 (admin) が必要。

- id: D20260527-004
  timestamp: 2026-05-27T12:15:00+09:00
  command: /flow:concept
  phase: Step 2 / 問い合わせ者の識別とスパム対策
  question: 問い合わせ者の識別子とスパム対策の方式
  options:
    - メアド必須 + メールバリデーション
  recommended: メアド必須 + メールバリデーション
  chosen: メアド必須 + メールバリデーション (spam 対策)
  chosen_type: explicit-choice
  depends_on: [D20260527-003]
  context: |
    seiji 明示「問い合わせる側はメアドを入力する必要がある」
    「スパム対策としてメールバリデーションはする」。
    メアドは問い合わせ者の識別子 + 通知先 + 本人確認に使用。
    バリデーションの厳密度 (format のみ / 検証リンク / MX+使い捨てブロック) は次問で確定。

- id: D20260527-005
  timestamp: 2026-05-27T12:25:00+09:00
  command: /flow:concept
  phase: Step 2 / スパム対策 + スレッド再訪アクセス
  question: メールバリデーションの方式 (検証リンク往復 vs 不可視スタック)
  options:
    - 検証リンク (magic link) 一体型
    - 不可視スタック (検証リンクなし) (recommended)
    - ハイブリッド (疑わしい時のみ検証)
  recommended: 不可視スタック (検証リンクなし)
  chosen: 不可視スタック (検証リンクなし)
  chosen_type: auto-recommended
  depends_on: [D20260527-003, D20260527-004]
  context: |
    当初 magic link を推奨したが seiji が「UX が悪い」と指摘。スパム防止(ボット遮断)
    とメール到達保証を分離し、前者を不可視対策で達成する方針へ転換。
    確定スタック: Cloudflare Turnstile(不可視) + honeypot + 送信タイミング trap +
    rate limit + MX/使い捨てドメインチェック(サーバ側)。
    合格 → 即スレッド生成・表示 (トークン URL を画面表示 + localStorage 保持 +
    メールにもスレッドリンク送付)。メールは「返信通知」専用、本人確認の往復クリックなし。
    タイポでメール不達でも localStorage でグレースフル劣化。
    → Cloudflare Turnstile を §4.3 リソース選定 + PREREQUISITES に追加。

- id: D20260527-006
  timestamp: 2026-05-27T12:30:00+09:00
  command: /flow:concept
  phase: Step 2 / Q12.12 デザイン方向
  question: プロダクトのデザイン方向 (世界観・ムード)
  options:
    - 信頼感 × ミニマル × クラフト感 (recommended)
    - 明るさ × ポップ × 親しみやすさ
    - ダーク × テック感
  recommended: 信頼感 × ミニマル × クラフト感
  chosen: 信頼感 × ミニマル × クラフト感
  chosen_type: auto-recommended
  depends_on: []
  context: |
    提供価値=「実際に動いている」信頼の可視化 + コンサル信頼性、ターゲット=一般(O38)。
    落ち着いた中立トーン / 余白多め(稼働一覧が主役) / 中立サンセリフ /
    ニュートラル基調 + 1 アクセント / 週1ペースのメイカーの誠実さを控えめに。
    詳細デザインシステムは Phase 1.5 /flow:design が concept から導出 (O39)。

- id: D20260527-007
  timestamp: 2026-05-27T12:30:00+09:00
  command: /flow:concept
  phase: Step 3 / フロントエンド FW (preferences override)
  question: フロントエンド FW を Vite(preferences 強選好) のままにするか
  options:
    - Vite + React SPA (preferences §2.1 採用 4)
    - Next.js (App Router) (recommended)
  recommended: Next.js (App Router)
  chosen: Next.js (App Router)
  chosen_type: auto-recommended
  depends_on: [D20260527-001]
  context: |
    preferences §2.1 は Vite+React SPA が採用 4 (強選好) だが、本 PJ は SEO/OGP/初回表示
    軽量が必須 NFR で、Vite SPA は SSR/SSG が弱い。CLAUDE.md「preferences と PJ 性質が
    矛盾する場合は PJ 性質を優先」に従い Next.js App Router (Vercel ネイティブ、SSG/ISR/
    Route Handler 一体) を採用。React+TS / shadcn/ui+Tailwind / Vercel の選好は維持。

- id: D20260527-008
  timestamp: 2026-05-27T12:30:00+09:00
  command: /flow:concept
  phase: Step 2 / Q11 リソース選定 (auto-pick バンドル)
  question: リソース選定たたき台 (PJ 性質に応じたカテゴリセット)
  options:
    - §3.1 個人ツール/無料枠パターン準拠バンドル (recommended)
  recommended: §3.1 個人ツール/無料枠パターン準拠バンドル
  chosen: |
    Next.js(App Router) + React + TS / shadcn/ui + Tailwind / Neon(Postgres) +
    Drizzle / Clerk (operator/admin のみ) / Resend (通知メール) /
    Cloudflare Turnstile (不可視スパム対策) / Vercel Hobby (ホスティング) /
    Vercel Web Analytics (cookieless 流入計測) / Sentry (エラー監視) /
    GitHub Actions + Vercel Preview (CI/CD)。全カテゴリ無料枠厳守、目標 $0/月。
  chosen_type: auto-recommended
  depends_on: [D20260527-001, D20260527-002, D20260527-007]
  context: |
    preferences §3.1 (Neon/Clerk/Vercel/Drizzle/Sentry/GHA、いずれも採用 3-4) に準拠。
    認証は公開側不要・operator(admin)のみ Clerk。アナリティクスは consent banner 回避の
    ため cookieless な Vercel Web Analytics を採用 (preferences §2.7 の GA4 見送り方針と整合)。

- id: D20260527-009
  timestamp: 2026-05-27T12:30:00+09:00
  command: /flow:concept
  phase: Step 2 / Q12.5 外部 AI サービス組み込み
  question: プロダクトで外部 AI サービスを使うか
  options:
    - 使わない (recommended)
    - 使う
  recommended: 使わない
  chosen: 使わない
  chosen_type: auto-recommended
  depends_on: []
  context: |
    shipyard は「AI 駆動開発で速く作る」ことを"打ち出す"サービスであって、
    サービス自体が AI API を叩く要件はない (稼働一覧表示 + LP + 問い合わせスレッド)。
    無料枠厳守原則とも整合。§6 外部連携に「外部 AI 利用: なし」を明記。

- id: D20260527-010
  timestamp: 2026-05-27T12:30:00+09:00
  command: /flow:concept
  phase: Step 3 / 論点抽出
  question: service-hub GET /api/public/status の contract 確定
  options:
    - 提案 contract (slug/name/url/status/since/last_checked_at) を HUB 側に依頼
  recommended: 提案 contract を HUB 側に依頼
  chosen: null
  chosen_type: open
  depends_on: [D20260527-003]
  context: |
    本サービスは HUB の公開 status API を read-only 消費する。安全サブセット
    (slug/表示名/URL/up・down/稼働開始日) のレスポンス形を本 concept で提案し、
    HUB 側の実装は別タスク (service-hub /flow:revise)。HUB 未実装まで本 PJ は
    モック contract で開発。→ §8 [論点-001] に登録。

- id: D20260527-011
  timestamp: 2026-05-27T13:20:00+09:00
  command: /flow:concept
  phase: Step 5.5 / wants クリーンアップ
  question: 入力 wants (docs/wants.md) の処理
  options:
    - アーカイブして空に (recommended)
    - そのまま残す
  recommended: アーカイブして空に
  chosen: アーカイブして空に
  chosen_type: auto-recommended
  depends_on: []
  context: |
    wants 全話題は concept.md / §8 [論点-001] に反映済み。
    docs/_archive/wants_20260527.md に原本退避 → docs/wants.md はクリア
    (処理済みコメントのみ残す)。

- id: D20260527-012
  timestamp: 2026-05-27T13:25:00+09:00
  command: /flow:concept
  phase: Step 7.5 / preferences 更新
  question: 確定 decision を preferences.md に反映するか
  options:
    - すべて更新 (recommended)
    - 一部だけ更新
    - 更新しない
  recommended: すべて更新
  chosen: すべて更新
  chosen_type: auto-recommended
  depends_on: [D20260527-007, D20260527-008]
  context: |
    5 PJ 目として反映。採用 +1: React+TS/Vercel/Sentry/CI/CD/shadcn(→5)、
    Neon/Clerk/Drizzle/Vercel Functions(→4)、Vercel Cron(→3)、Resend(→2)。
    新規: Next.js(App Router) 初採用 (SEO override)、Cloudflare Turnstile (§2.20 新カテゴリ)、
    Vercel Web Analytics cookieless (§2.7)。§3.1 にフロント FW 条件分岐ノート追加。

- id: D20260527-013
  timestamp: 2026-05-27T13:30:00+09:00
  command: /flow:concept
  phase: Step 7.7 / Git 自動コミット
  question: git init + 生成物の自動コミット
  options:
    - git init + 自動コミット (recommended)
    - git init しない
  recommended: git init + 自動コミット
  chosen: git init + 自動コミット
  chosen_type: auto-recommended
  depends_on: []
  context: |
    .git 未初期化 → git init -b main → .gitignore(.env*.local 除外) 作成 →
    docs/ + README + .gitignore を genesis commit (main)。
    秘密情報の staged なし確認済み。push は実施しない (ユーザー手動)。
    commit: docs(flow:concept): initial — shipyard 概念設計初版 (branch=main)。
```
