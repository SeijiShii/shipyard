# _shared/auth 仕様書（横断基盤・運用者認証）

> **役割**: 運用者(seiji)のみの認証（Clerk）。admin ルート保護 + allowlist。訪問者は認証なし。
> **タグ**: cross-cutting, auth-required
> **最終更新**: 2026-05-27
> **入力**: `../../concept.md` §1.3 admin / §3.7 SEC-002 / §6（Clerk）, `./README.md`

---

## 1. 提供インターフェース
| 機能 | 提供 | 利用機能 |
|---|---|---|
| Clerk Provider / middleware | `/admin/*` と admin API を保護 | admin |
| `requireOperator()` | サーバー側でセッション検証 + allowlist チェック | admin（全 admin API） |
| `isOperator(userId/email)` | allowlist 判定（seiji のメールのみ） | admin |

## 2. 入出力
- middleware: `/admin/*` `/api/admin/*` を matcher 指定、未認証は Clerk サインインへ。
- `requireOperator()`: 認証済 + allowlist 一致 → ok / それ以外 → 403。
- allowlist: env `OPERATOR_EMAILS`（カンマ区切り、seiji のみ）。Clerk の sign-up は restricted（許可メールのみ）。
- **訪問者側は本基盤を一切通さない**（メアド + token URL のみ、concept §1.2）。

## 3. データモデル
なし。Clerk がユーザーを管理。allowlist は env。

## 4. バリデーション + エラーケース
| ID | 条件 | 振る舞い |
|---|---|---|
| AUTH-E1 | 未認証で /admin/* | Clerk サインインへリダイレクト |
| AUTH-E2 | 認証済だが allowlist 外 | 403（「権限がありません」）+ サインアウト導線 |
| AUTH-E3 | admin API に未認証/allowlist 外 | 403 JSON（本文に詳細を出さない、SEC-001） |

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| RBAC | admin は Clerk + allowlist の二重（§3.7 SEC-002） | High |
| 公開分離 | 訪問者導線は認証ゼロ（D004/D005） | concept §1.2 |
| 秘密 | CLERK_SECRET_KEY はサーバー側のみ、PUBLISHABLE はクライアント可 | SEC-001/O25 |
- 連携: admin のみ。Clerk Free 10k MAU（運用者 1 名で十分、§4.3）。

## 6. タグ別追加（auth-required）
- ロール: operator のみ（単一運用者）。RLS は使わない（app 層 + allowlist）。
- パスキー/MFA: MVP では Clerk デフォルト（将来追加可、preferences §5 で MVP パスキー見送り傾向）。

## 7. スコープ外
- 訪問者アカウント（なし）
- 複数ロール / 組織機能

## 8. 未決事項
現時点で論点なし (2026-05-27)。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
