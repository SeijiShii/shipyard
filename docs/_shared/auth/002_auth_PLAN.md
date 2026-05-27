# _shared/auth 実装計画書

> **入力**: `./001_auth_SPEC.md`, `../../concept.md` §6
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | LOC |
|---|---|---|
| `middleware.ts` | Clerk middleware（/admin/*・/api/admin/* matcher） | 30 |
| `lib/auth/operator.ts` | requireOperator() / isOperator()（allowlist） | 40 |
| `app/admin/layout.tsx` | ClerkProvider + 認証 UI ラップ | 30 |
| `lib/auth/config.ts` | OPERATOR_EMAILS パース | 15 |

## 2. 実装 Phase 分割
- **Phase 1**: config + isOperator（allowlist 判定、純ロジック、mock テスト）
- **Phase 2**: middleware + requireOperator（Clerk セッション、injectable で test）
- **最終**: 実 Clerk キーで dev サインイン確認（Phase 3/Release）

## 3. 依存関係順序
```
config → operator(isOperator) → middleware/requireOperator → admin layout
```

## 4. 既存ファイルへの影響
- ルートに `middleware.ts` 追加。admin 配下に ClerkProvider。

## 5. リスク・注意点
- 訪問者導線（/, /contact, /t/[token], /services, /legal）を **matcher に含めない**（認証ゼロ維持、D004）。
- allowlist を二重防御（Clerk restricted sign-up + requireOperator）。
- CLERK_SECRET はサーバーのみ（O25）。

## 6. 完了の定義
- [ ] /admin/* が未認証で弾かれる
- [ ] allowlist 外は 403
- [ ] 訪問者導線は認証なしで到達可
- [ ] isOperator の allowlist 分岐 100% カバー

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
