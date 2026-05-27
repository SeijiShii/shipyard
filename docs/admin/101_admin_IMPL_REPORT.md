# 実装レポート: admin

## 実装日時
2026-05-27 16:23 (JST)

## モード
feature（運用者コンソール・auth-required・stateful）

## 関連ドキュメント
- [001_admin_SPEC.md](./001_admin_SPEC.md) / [002_…_PLAN.md](./002_admin_PLAN.md) / [003_…_UNIT_TEST.md](./003_admin_UNIT_TEST.md)
- [AI_LOG セッション](../AI_LOG/D20260527_019_tdd_continuous.md)

## 変更一覧

### 中核（テスト可能・DI）
- `features/admin/service.ts` — `adminReply`（id→thread→message(operator)+touchActivity+通知 best-effort、不在 404）/ `adminClose`（setStatus closed、不在 404）
- `features/admin/replySchema.ts` — Zod（返信 body、SEC-003）
- `features/admin/ThreadList.tsx` — 一覧（リンク + 対応中/完了 タグ、0 件 EmptyState）

### 画面・API（thin wiring）
- `app/admin/layout.tsx` — ClerkProvider + `requireOperator` ガード（allowlist 外は権限なし表示、A-E2）
- `app/admin/page.tsx` — 一覧（listRecent） / `app/admin/threads/[id]/page.tsx` — 詳細（findById→notFound）+ ThreadView（プレーンテキスト）+ AdminThreadActions
- `features/admin/AdminThreadActions.tsx` — 返信フォーム + 完了ボタン（client）
- `app/api/admin/threads/[id]/reply/route.ts` / `close/route.ts` — requireOperator（二重防御）→ service

### db 拡張（drift 解消）
- `threadRepo.findById(id)` を追加（admin は認証済 id 経由。visitor は token のみ＝SEC-002 分離）。db SPEC §5.2 に無かった id 経路を admin 要件に合わせて補完（db 22/22 再 GREEN）。

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | `threadRepo.findById` を db に追加（admin の id 経路）。reply/close 中核を service.ts に抽出し DI（認可は requireOperator 再利用） |
| 計画から省略した変更 | 認可は middleware（/admin/* 保護）+ layout/route の requireOperator の二重。実 Clerk/Resend 結合は Release。視覚は Phase 3 |
| 想定外の問題 | ThreadList で当初 StatusBadge（service status 用ラベル）を流用しかけたが、thread の open/closed と意味が違うため専用タグ（対応中/完了）に修正 |

## PR Description
### タイトル
admin: 運用者コンソール（Clerk + allowlist gate、一覧/返信/クローズ）
### 概要
運用者のみ（Clerk + allowlist 二重）が問い合わせを一覧・返信・クローズ。返信は問い合わせ者へリンク通知（本文を載せない）。本文はプレーンテキスト表示。
### 変更内容
- adminReply/adminClose（id 経由、404、best-effort 通知）+ Zod + ThreadList
- layout ガード + 一覧/詳細ページ + reply/close API（requireOperator 二重防御）
- threadRepo.findById 追加（admin id 経路、visitor token と分離）
### テスト
- 単体 10 件 + db findById 1 件、全 GREEN。全体 147/147（100%）、typecheck クリーン。認可（requireOperator 401/403）/PII（通知に本文非含有）/404/best-effort 100%。
