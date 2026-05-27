# admin 実装計画書

> **入力**: `./001_admin_SPEC.md`, `../_shared/{auth,db,email,ui}/*`
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `app/admin/layout.tsx` | ClerkProvider + requireOperator ガード | auth, ui | 30 |
| `app/admin/page.tsx` | スレッド一覧（listRecent） | db, ui | 60 |
| `app/admin/threads/[id]/page.tsx` | スレッド詳細 + 返信フォーム | db, ui | 80 |
| `app/api/admin/threads/[id]/reply/route.ts` | 返信（requireOperator → message + email） | auth, db, email | 50 |
| `app/api/admin/threads/[id]/close/route.ts` | クローズ（setStatus） | auth, db | 30 |
| `features/admin/replySchema.ts` | Zod（返信 body） | — | 15 |

## 2. 実装 Phase 分割
- **Phase 1**: layout ガード（requireOperator）+ 一覧（listRecent、mock）
- **Phase 2**: 詳細 + reply API（message + email best-effort）
- **Phase 3**: close API + 一覧の状態表示

## 3. 依存関係順序
```
auth(requireOperator) → layout → page(一覧) → threads/[id](詳細+reply) → close
```

## 4. 既存ファイルへの影響
- inquiry と同 thread/message を操作（admin=id 経由、visitor=token）。`middleware.ts`（auth）が /admin/* 保護。

## 5. リスク・注意点
- 全 admin API で requireOperator（二重: middleware + handler、SEC-002）。
- 一覧/詳細の本文をログ・Analytics に出さない（SEC-001）。
- 返信本文も Zod + プレーンテキスト表示（SEC-003）。
- email 失敗で返信追加を巻き込まない（best-effort）。

## 6. 完了の定義
- [ ] /admin/* が未認証/allowlist 外で弾かれる（403）
- [ ] 一覧（listRecent）+ 詳細 + 返信（message+email）+ close
- [ ] PII 非混入 / IDOR（admin は認証済 id、訪問者 token と分離）
- [ ] 視覚レビュー（Phase 3）

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
