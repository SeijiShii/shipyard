# _shared/db 単体テスト計画

> **入力**: `./001_db_SPEC.md`, `./002_db_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| U-1 | inquirerRepo.upsertByEmail | 新規 email | 新 inquirer 作成、id 返却 |
| U-2 | inquirerRepo.upsertByEmail | 既存 email | 既存 id を返す（重複作成しない） |
| U-3 | threadRepo.create | inquirerId | thread 作成、token（base64url, 長さ≥22）返却 |
| U-4 | threadRepo.findByToken | 有効 token | 該当 thread |
| U-5 | messageRepo.add / listByThread | visitor/operator | 時系列で取得 |
| U-6 | rateLimitRepo.hitAndCount | 同 key 連続 | count インクリメント |
| U-7 | statusCacheRepo.upsertMany / listAll | status 行 | 上書き + 全件取得 |
| U-8 | threadRepo.setStatus / touchActivity | open→closed | status 更新、last_activity_at 更新 |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待振る舞い |
|---|---|---|---|
| U-E1 | threadRepo.findByToken | 存在しない token | null（404 を上位で） |
| U-E2 | messageRepo.add | 存在しない thread_id | FK 例外 |
| U-E3 | threadRepo.create | token 衝突（モックで強制） | リトライ後成功（最大 3 回） |
| U-E4 | enum 違反 | status='foo' | 型/制約で拒否 |

### 1.3 境界値
| ID | 対象 | 境界 | 期待振る舞い |
|---|---|---|---|
| U-B1 | message.body | 空文字 / 最大長 / Unicode・絵文字 | 保存・取得で壊れない（body 上限は app/Zod 側、SEC-003） |
| U-B2 | token | 同時生成の一意性 | UNIQUE 制約で衝突しない |
| U-B3 | listRecent | offset 範囲外 | 空配列 |

## 2. Mock 方針
| 対象 | 方針 | 理由 |
|---|---|---|
| Neon DB | テスト用 Postgres（ローカル / Neon dev ブランチ / pglite） | repository は実 SQL を検証したい |
| crypto（token 生成） | 通常は実物、衝突テスト U-E3 のみ固定値注入 | 再現性 |
| 時刻 | 固定値注入（created_at / window_start） | 再現性 |

## 3. カバレッジ目標
| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | concept 継承 |
| 分岐 | 70% | concept 継承 |
| repository の IDOR 経路（findByToken） | 100% | SEC-002 必須 |

## 4. 既存ユーティリティ依存
- token 生成（crypto base64url）— `_shared/spam` と共有する場合はそのモック。

## 5. テスト実行環境
- フレームワーク: Vitest（concept §4.3 スタック）
- DB: ローカル Postgres or Neon dev ブランチ（CI は一時 DB）
- 実行コマンド（例示）: テストツールを実行する（`npm run test`）

## 6. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
