<!-- auto-generated-start -->
# 設計レベル脆弱性レビュー — shipyard (プロダクト全体 / concept)

**レビュー日**: 2026-05-27
**レビュー実施者**: Claude (Opus 4.7) + seiji
**対象**: プロダクト全体（concept.md 設計レベル）
**入力**: docs/concept.md (§1.1 / §1.3 / §3 / §4.3 / §4.5 / §5 / §6 / §9 / §10)
**観点ソース**: ~/.claude/flow-data/perspectives.md (O23-O28)
**severity-threshold**: medium
**phase**: design (L1 のみ。L2 は各 feature 設計後、L4 deps は実装後)

## 1. PJ 性質判定
- 複数ユーザー（公開訪問者多数 + 運用者 1 名）
- 公開（認証なし、訪問者はメアド + トークン URL）
- 無償（lead-gen、本サイト課金なし）
- 個人情報扱いあり（問い合わせのメール + 本文を収集・保存）
- AI 利用なし（Q12.5 で確認）
- 国内中心（一部グローバル流入想定）

## 2. 脆弱性パターン照合結果

### 2.1 サマリ
- Critical: 1 件（SEC-001）
- High: 2 件（SEC-002, SEC-003）
- Medium: 0 件
- 対応済み（注記のみ）: 2 件（O25, O27）
- 繰延（deps フェーズ）: 1 件（O28）
- 法令必須: 1 件（O26、未対応 → §3 NFR 要件化）

### 2.2 詳細（severity 降順）

#### [SEC-001] 個人情報のログ漏洩 (O26_pii_logging, severity=Critical, legal_required)
- **照合結果**: SPEC 部分対応（§3 NFR「PII 最小=メール+本文のみ」は収集最小化のみ。ログ/監視への混入対策が未明示）
- **不在根拠**: §6 で Sentry 採用だが、`beforeSend` での PII マスク / エラーメッセージへの本文非混入 / Analytics イベントへの PII 非投入が SPEC に記載なし
- **PJ 性質との関連**: 公開 + 個人情報扱い（require 両方該当）
- **推奨対策（§3 NFR 要件化）**: Sentry `beforeSend` で email / 問い合わせ本文 / トークンをマスク。エラーメッセージに DB 内容・本文を含めない。Vercel Web Analytics イベントに PII を入れない（cookieless + anonymous）。
- **route**: `accepted-as-requirement`（concept §3.7 NFR に追記、§8 [論点-002]）

#### [SEC-002] 認可漏れ / thread IDOR + admin RBAC (O23_authorization_check, severity=High)
- **照合結果**: SPEC 部分対応（§1.3 admin=Clerk gate、§5.1 thread.token=推測不能 は明示。だが thread/message エンドポイントのサーバー側所有者検証 = IDOR 防止が未明示）
- **不在根拠**: `POST /api/inquiry/[token]/reply` 等で token 所有者検証ロジックが SPEC に記載なし。thread id 列挙耐性も未明示
- **PJ 性質との関連**: 複数ユーザー（require 該当）
- **推奨対策（§3 NFR 要件化）**: (1) thread.token は暗号論的乱数（128-bit 以上、URL safe）。(2) 全 thread/message 取得・追記エンドポイントで token 一致をサーバー側検証（IDOR 防止、連番 id を URL に露出しない）。(3) `/admin/*` + admin API は Clerk + allowlist(seiji) で RBAC。
- **route**: `accepted-as-requirement`（concept §3.7 NFR に追記、§8 [論点-003]）

#### [SEC-003] 入力検証 / 問い合わせ本文 XSS + スキーマ検証 (O24_input_validation, severity=High)
- **照合結果**: SPEC 部分対応（§3 NFR にスパム対策はあるが入力検証スキーマ・出力エスケープが未明示）
- **不在根拠**: 問い合わせ本文を admin/スレッド画面で表示する設計だが、XSS 対策（エスケープ / sanitize）と API 入力スキーマ（Zod 等）が SPEC に記載なし
- **PJ 性質との関連**: 公開（require 該当）
- **推奨対策（§3 NFR 要件化）**: (1) API 入力は Zod スキーマで検証（email 形式・本文長上限）。(2) 問い合わせ本文は表示時にプレーンテキスト扱い（`dangerouslySetInnerHTML` 禁止）。Markdown 許可する場合は `rehype-sanitize` 必須。(3) SSRF: HUB status URL は env 固定（ユーザー入力でない）ため低リスク、変更時も allowlist。
- **route**: `accepted-as-requirement`（concept §3.7 NFR に追記、§8 [論点-004]）

### 2.3 対応済み（注記のみ、論点化なし）

#### O27_rate_limit_scope (対応済み, 設計の強み)
- 問い合わせフォーム（公開エンドポイント）に**不可視スタック**を設計済み: Cloudflare Turnstile + honeypot + 送信タイミング trap + rate limit + MX/使い捨てドメインチェック（D20260527-005、§4.3 / `_shared/spam`）。O27 の require（公開エンドポイントのレート制限 + ボット対策）を満たす。
- 補足注記: `/api/services`（status キャッシュ配信）にも軽いレート制限を検討（低リスク、実装時 L2 で確認）。

#### O25_secrets_management (対応済み)
- §4.5.3 / §10.7 で `.env.example` / `.env.local` / `.gitignore`（`.env*.local` 除外、作成済み）/ gitleaks 推奨を明示。秘密情報はサーバー側 env のみ。公開可能な値は Turnstile SITE_KEY と Clerk PUBLISHABLE_KEY のみ。
- 補足注記: 実装時に `NEXT_PUBLIC_*` プレフィックスへ秘密値を混入させない（L2 でビルド成果物 grep チェック）。

## 3. §8 未決事項に登録した論点

| 論点 ID | severity | title | status | 期限 |
|---|---|---|---|---|
| [論点-002] | Critical | [SEC-001] PII ログ漏洩対策 | accepted-as-requirement | 実装着手前 |
| [論点-003] | High | [SEC-002] thread IDOR + admin RBAC | accepted-as-requirement | 実装着手前 |
| [論点-004] | High | [SEC-003] 入力検証 / 本文 XSS | accepted-as-requirement | 実装着手前 |

## 4. 次のステップ
- Critical/High は concept §3.7 NFR に要件化済み（accepted-as-requirement）→ 各 feature SPEC（特に inquiry / admin）で具体実装に落とす
- 各 feature 設計完了後に `/flow:secure --phase=pre-impl --scope=feature_<target>`（L2 実装前チェックリスト）
- 実装後に `/flow:secure --phase=deps`（L4 依存 CVE スキャン、lockfile 生成後）
- 実装後に Anthropic `security-review` スキルで L3 コードレビュー
- CI に `npm audit` / Dependabot 組み込み（§10.5）
<!-- auto-generated-end -->
