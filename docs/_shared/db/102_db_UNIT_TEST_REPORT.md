# 単体テストレポート: _shared/db

## 実施日時
2026-05-27 15:22 (JST)

## 関連ドキュメント
- [003_db_UNIT_TEST.md](./003_db_UNIT_TEST.md) - 単体テスト項目（計画）

## テスト実行環境
- ランタイム: Node.js v22.11.0
- テストフレームワーク: Vitest 2.1.9
- テスト DB: `@electric-sql/pglite`（in-memory Postgres）+ 生成済み Drizzle migration 適用
- 環境ディレクティブ: repository テストは `// @vitest-environment node`（pglite が jsdom 非対応のため）

## テスト結果

| # | テストケース | テストファイル | 結果 | 備考 |
|---|------------|-------------|------|------|
| U-1 | inquirerRepo.upsertByEmail（新規） | repositories.test.ts | ✅ | id 返却 + findById で確認 |
| U-2 | inquirerRepo.upsertByEmail（既存） | repositories.test.ts | ✅ | 既存 id を返す（重複作成なし） |
| — | inquirerRepo.findById（不存在） | repositories.test.ts | ✅ | null |
| U-3 | threadRepo.create → token | repositories.test.ts | ✅ | base64url, 長さ≥22（128-bit） |
| U-4 | threadRepo.findByToken（IDOR 経路） | repositories.test.ts | ✅ | SEC-002、status='open' |
| U-E1 | findByToken（不存在 token） | repositories.test.ts | ✅ | null |
| U-B2 | token 一意性（既定 generator） | repositories.test.ts | ✅ | 連続生成で重複なし |
| U-E3 | token 衝突リトライ（最大 3 回） | repositories.test.ts | ✅ | 衝突→再生成→成功、generator 2 回呼ばれる |
| U-E3b | リトライ上限超過 | repositories.test.ts | ✅ | throw（追加ケース） |
| U-8 | setStatus open→closed / touchActivity | repositories.test.ts | ✅ | status 更新 + last_activity_at 更新 |
| U-E4 | 不正 status 拒否（thread） | repositories.test.ts | ✅ | app 層 enum 検証で throw |
| U-B3 | listRecent（desc + offset 範囲外） | repositories.test.ts | ✅ | last_activity desc、範囲外は空配列 |
| U-5 | messageRepo.add / listByThread | repositories.test.ts | ✅ | created_at 時系列で取得 |
| U-E2 | message.add（不存在 thread_id） | repositories.test.ts | ✅ | FK 例外 |
| U-E4 | 不正 sender 拒否（message） | repositories.test.ts | ✅ | app 層 enum 検証で throw |
| U-B1 | message.body（空/Unicode/絵文字） | repositories.test.ts | ✅ | 保存・取得で壊れない |
| U-6 | rateLimitRepo.hitAndCount | repositories.test.ts | ✅ | 同 key/窓で increment、別窓は独立 |
| U-7 | statusCacheRepo.upsertMany/listAll | repositories.test.ts | ✅ | 上書き（行増えず）+ 全件取得 |
| U-E4 | 不正 status 拒否（statusCache） | repositories.test.ts | ✅ | app 層 enum 検証で throw |
| — | upsertMany([]) no-op | repositories.test.ts | ✅ | 空配列で何もしない |
| — | seedStatusCache（Phase 3 dev seed） | repositories.test.ts | ✅ | DEV_STATUS_SEED 投入 |
| (Phase 1) | schema 形 / enum default / token UNIQUE 等 6 件 | schema.test.ts | ✅ | 先行セッション |

## 追加テストケース

| # | 対象 | テストケース | 追加理由 |
|---|------|------------|---------|
| 1 | threadRepo.create | U-E3b リトライ上限超過で throw | 衝突リトライの上限挙動を明示担保 |
| 2 | inquirerRepo.findById | 不存在 id → null | null 経路のカバレッジ |
| 3 | statusCacheRepo.upsertMany | 空配列 no-op | 境界（空入力）の防御 |
| 4 | seed | seedStatusCache(db) | Phase 3 dev seed の動作担保 |

## サマリー

| 項目 | 値 |
|------|-----|
| 計画テスト数 | 17 件（U-1〜U-8, U-E1〜U-E4, U-B1〜U-B3） |
| 追加テスト数 | 4 件 |
| 合計（repositories） | 21 件 |
| schema（Phase 1） | 6 件 |
| 全体スイート合計 | 29 件 |
| 成功 | 29 件 |
| 失敗 | 0 件 |
| 成功率 | 100% |

## カバレッジ要点（UNIT_TEST §3 目標）
- repository IDOR 経路（findByToken）: visitor 経路を専用テスト（U-4/U-E1）で担保（SEC-002 必須 100%）。
- 行/分岐目標（80%/70%）: 全 repository メソッド + 異常系（FK/UNIQUE/enum）を網羅。
