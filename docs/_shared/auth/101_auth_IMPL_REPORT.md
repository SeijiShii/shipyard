# 実装レポート: _shared/auth

## 実装日時
2026-05-27 15:44 (JST)

## モード
feature（横断基盤・運用者認証）

## 関連ドキュメント
- [001_auth_SPEC.md](./001_auth_SPEC.md) / [002_auth_PLAN.md](./002_auth_PLAN.md) / [003_auth_UNIT_TEST.md](./003_auth_UNIT_TEST.md)
- [AI_LOG セッション](../../AI_LOG/D20260527_019_tdd_continuous.md)

## 変更一覧

### Phase 1: config + isOperator（純ロジック）
- `lib/auth/config.ts` — `operatorEmails()`（OPERATOR_EMAILS パース、trim/小文字/空除去）
- `lib/auth/operator.ts` — `isOperator(email)`（allowlist 判定）/ `isProtectedAdminPath(path)`（保護パス）/ `requireOperator(resolve)`（injectable session resolver で認可、未認証 401 / allowlist 外 403）

### Phase 2: middleware + Clerk resolver
- `middleware.ts` — `clerkMiddleware` + `createRouteMatcher(['/admin(.*)','/api/admin(.*)'])`、admin のみ `auth.protect()`（訪問者導線は matcher 対象外 = 認証ゼロ、D004）
- `lib/auth/clerk.ts` — `clerkSessionResolver`（Clerk auth()+currentUser() で email 解決、runtime のみ）
- `app/admin/layout.tsx` — `ClerkProvider`（admin 配下のみ Clerk を読み込み、公開分離）

### 最終（Release 工程）
- 実 Clerk キーでの dev サインイン確認は Release（実キー必須）

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | Clerk セッション取得を `lib/auth/clerk.ts` に分離し `operator.ts` を Clerk 非依存の純ロジックに（実キー不要で 100% テスト可能）。`requireOperator` は `SessionResolver` を引数注入（O35）。401/403 を `RequireResult` で型表現 |
| 計画から省略した変更 | middleware 自体は edge runtime のため unit せず、保護パス判定は `isProtectedAdminPath` を抽出して unit（U-B2）。実認証フローは Release |
| 想定外の問題 | なし。scaffold の pass-through middleware を Clerk 実装で置換 |

## PR Description
### タイトル
_shared/auth: 運用者認証（Clerk + allowlist 二重防御、訪問者は認証ゼロ）
### 概要
admin（運用者 seiji のみ）を Clerk middleware + allowlist で二重に保護。訪問者導線は一切認証を通さない（D004）。Clerk を injectable に分離し実キー不要で CI green。
### 変更内容
- middleware: /admin・/api/admin のみ保護（matcher で訪問者導線を除外）
- requireOperator（未認証 401 / allowlist 外 403、詳細非開示 SEC-001）+ isOperator
- ClerkProvider を admin layout に限定（公開分離）
### テスト
- 単体 9 件、全 GREEN。全体 76/76（100%）、typecheck クリーン。allowlist/認可/保護パス分岐 100%（SEC-002）。
