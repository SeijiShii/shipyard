# _shared/hub-client 単体テスト計画

> **入力**: `./001_hub-client_SPEC.md`, `./002_hub-client_PLAN.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | contract(Zod) | 正しい PublicStatusResponse をパース |
| U-2 | fetchHubStatus | mock fetch で services を返す |
| U-3 | refreshStatusCache | upsertMany 呼び出し（fetched_at 付与） |
| U-4 | getCachedStatus | listAll を返す |

### 1.2 異常系（可用性・安全性）
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| U-E1 | fetchHubStatus | HUB タイムアウト/5xx | 例外 → refresh は cache 保持 |
| U-E2 | refreshStatusCache | fetch 失敗 | キャッシュ更新しない（前回値維持） |
| U-E3 | contract | 余剰フィールド（cost/churn 等の内部指標） | strip で破棄（安全サブセットのみ） |
| U-E4 | contract | status 不正値 | reject |

### 1.3 境界値
| ID | 対象 | 検証 |
|---|---|---|
| U-B1 | services 空配列 | 正常（空一覧） |
| U-B2 | since/last_checked_at 欠落 | optional として許容 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| HUB fetch | injectable mock（lib/hub/mock.ts、実 HUB 不要） |
| statusCacheRepo | mock（db 連携は db 側でテスト済） |
| 時刻（fetched_at） | 固定値注入 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |
| 安全サブセット strip / フォールバック分岐 | 100%（U-E1/E2/E3） |

## 4. テスト実行環境
- Vitest。HUB は mock。実 HUB 結合は [論点-001] 解決後 + Phase 3。

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
