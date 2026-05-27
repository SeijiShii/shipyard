# 依存ライブラリ脆弱性スキャン結果（L4）

**スキャン日**: 2026-05-27 22:10 (+09:00)
**対象**: `package-lock.json`（npm）
**スキャナ**: `npm audit`
**実行元**: /flow:secure（/flow:auto §3.0c 鮮度ゲート、全 12 ターゲット unit + endpoint 実装後）

## 1. サマリ（スキャン後＝対応済み）

| severity | スキャン時 | 対応後 |
|---|---|---|
| Critical | 0 | 0 |
| **High** | **1** | **0 ✅（修正済）** |
| Moderate | 11 | 11（dev-tooling、record-only） |
| Low / Info | 0 | 0 |

- **対応必須（Critical/High）**: 1 件 → **即時修正完了**
- §8 登録: 0 件（High は本セッションで即解消、未決残なし）

## 2. High 詳細（修正済み）

### [GHSA-gpj5-g38j-94v9] drizzle-orm SQL injection via improperly escaped SQL identifiers
- **パッケージ**: `drizzle-orm@0.38.3`（**直接・本番依存**、shipyard の ORM 全体）
- **severity**: High
- **概要**: 不適切にエスケープされた SQL 識別子経由の SQL インジェクション。
- **shipyard の実際の曝露**: **低**。本 PJ は SQL 識別子（テーブル/カラム名）にユーザー入力を渡していない（全クエリは静的 schema カラム + パラメータ化値。raw `sql` は静的 TRUNCATE と `excluded.*` のみ）。値は drizzle のパラメータ化で常にエスケープ。それでも直接・本番依存の High 助言のためリリース前に解消。
- **対応**: `drizzle-orm@0.38.3 → 0.45.2`（major bump、修正版）+ `drizzle-kit@0.30.6 → 0.31.10`（peer 整合）。
- **検証**:
  - migration 再生成 = **No schema changes**（既存 `0000_init.sql` 有効、drift なし）
  - drizzle 0.45 でエラー形状変更 → `threadRepo.isUniqueViolation` を cause 連鎖走査に修正（U-E3/E3b 衝突リトライ再 GREEN）
  - **全体 154/154 GREEN + typecheck クリーン + production build green**
- **route**: 即時修正完了（`dispatched-to-fix` → closed、同一セッション内）。

## 3. Moderate（11 件、record-only — dev-tooling / framework-transitive）

| パッケージ | direct | 経由 | 性質 |
|---|---|---|---|
| esbuild | 否 | dev server CORS | **dev 専用**（本番非露出） |
| vite / vite-node / @vitest/mocker / vitest | 一部直 | vite | **test/dev 専用** |
| @esbuild-kit/core-utils / esm-loader | 否 | esbuild | dev（drizzle-kit 経由） |
| drizzle-kit | 直 | @esbuild-kit | **dev 専用**（migration 生成のみ） |
| postcss | 否 | next | build-time（CSS stringify XSS、ビルド時のみ） |
| next / @clerk/nextjs | 直 | postcss/next | framework（次期 minor で解消見込み） |

- いずれも **本番ランタイムで実害のある経路ではない**（dev server / build-time / test tooling）。
- クリーンな修正には Next.js / vite / vitest の major/minor 更新が必要 → **Dependabot で追従**（`.github/dependabot.yml` 有効化済、O37）。本セッションでは強制更新しない（framework 連鎖リスク回避）。

## 4. 自動更新メカニズム
- ✅ Dependabot 設定済（`.github/dependabot.yml`、Phase 0 scaffold）— moderate の framework 更新を PR で追従。
- 推奨: CI に `npm audit --audit-level=high`（High 以上でビルド失敗）を追加（任意）。

## 5. L1 設計レビュー再評価（実装後）
- SEC-001 PII / SEC-002 IDOR / SEC-003 XSS = `accepted-as-requirement` だったものが**全 endpoint で実装 + unit 検証済**（inquiry/admin/services/cron/hub-service-info）。新規 Critical/High の設計レベル finding なし。
- 秘密情報（O25）: `.env*.local` gitignore 済、ハードコード秘密なし、`NEXT_PUBLIC_*` に秘密混入なし。✅
- O27 レート制限: `/api/inquiry` は spam 5 段（rate limit 含む）✓。`/api/services`（公開・cache 読み取りのみ）は rate limit 未設定 = **Low**（書き込みなし・低悪用価値、SPEC §2.1「軽い rate limit 検討」。Release 後に edge/middleware で追加可）。
