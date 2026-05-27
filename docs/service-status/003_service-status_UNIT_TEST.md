# service-status 単体テスト計画

> **入力**: `./001_service-status_SPEC.md`, `./002_service-status_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | StatusList | up/down/unknown を StatusBadge + リンクで表示 |
| U-2 | uptime | since から稼働日数を正しく計算 |
| U-3 | GET /api/services | getCachedStatus 結果を返す（安全サブセットのみ） |
| U-4 | GET /api/cron | 正しい CRON_SECRET → refresh 実行 |

### 1.2 異常系
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| U-E1 | StatusList | 0 件/取得失敗 | EmptyState |
| U-E2 | /api/cron | secret 不一致 | 401 |
| U-E3 | refresh | HUB 失敗 | 前回値保持（更新しない） |
| U-E4 | StatusList | status 不明値 | 'unknown' フォールバック |

### 1.3 境界 / 安全
| ID | 対象 | 検証 |
|---|---|---|
| U-B1 | /api/services レスポンス | 内部指標フィールドが含まれない（安全サブセットのみ） |
| U-B2 | uptime | since=今日 → 0 日、未来日 → 0 クランプ |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| hub-client（getCachedStatus/refreshStatusCache） | mock |
| CRON_SECRET（env） | 固定注入 |
| 時刻（稼働日数） | 固定注入 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |
| 安全サブセット / secret 検証分岐 | 100%（U-B1/U-E2） |

## 4. テスト実行環境
- Vitest。HUB は mock。視覚は E2E（Level 1）。

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
