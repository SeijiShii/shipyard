# service-status 単体テスト計画（リアルタイム鮮度: read-through refresh）

> **入力**: `./001_REVISE_SPEC.md`, `./002_REVISE_PLAN.md`, 既存 `lib/hub/hub.test.ts` / `../../003_service-status_UNIT_TEST.md`
> **最終更新**: 2026-06-08

---

## 1. 追加テストケース

### 1.1 正常系
| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| RT-1 | `getStatusReadThrough` fresh skip | cache 最新 fetchedAt = now-30min（TTL 1h 内）、fetchStatus=spy | fetchStatus 未呼び出し、cache をそのまま返す |
| RT-2 | `getStatusReadThrough` stale refresh | cache 最新 fetchedAt = now-2h、fetchStatus=3 件返す mock | fetchStatus 1 回呼ばれ、upsert 後 3 件返る |
| RT-3 | `getStatusReadThrough` cache 空 | listAll=[]、fetchStatus=mock | fetchStatus 呼ばれ refresh |
| RT-4 | TTL env 反映 | `STATUS_REFRESH_TTL_SEC=60`、fetchedAt=now-2min | stale 判定 → refresh |
| SA-1 | syncedAt 算出 | rows の fetchedAt = [t1, t2(max), t3] | max(t2) を返す |
| SA-2 | syncedAt 整形 | Date(2026-06-08T08:30 JST 相当) | 「2026年6月8日 8:30 現在」 |
| API-1 | `/api/services` syncedAt | rows あり | レスポンスに `syncedAt`（最新 fetchedAt の ISO）含む |

### 1.2 異常系
| ID | 対象 | 失敗条件 | 期待振る舞い |
|---|---|---|---|
| RT-5 | refresh 中 HUB fetch throw | stale + fetchStatus が reject | 例外を投げず前回 cache を返す（graceful, S-E1） |
| RT-6 | `loadStatusSafe` で repo throw | getRepo() が throw | 空配列（既存挙動維持） |
| SA-3 | syncedAt 0 件 | rows=[] | null（表示しない） |
| API-2 | `/api/services` 0 件 | listAll=[] かつ refresh 失敗 | `{ services: [], syncedAt: null }` |

### 1.3 境界値
| ID | 対象 | 境界 | 期待振る舞い |
|---|---|---|---|
| RT-7 | TTL ちょうど | fetchedAt = now - TTL ちょうど | stale 扱い（>= で refresh）※実装で境界を明確化 |
| RT-8 | throttle 連続 | stale で 2 回連続呼び出し（同 instance）、1 回目 fetch 失敗 | 2 回目は throttle 窓内なら fetch しない |

## 2. 修正テストケース

| ID | 対象 | 修正前 | 修正後 | 理由 |
|---|---|---|---|---|
| EX-1 | `/api/services` レスポンス検証 | `{ services }` のみ assert | `{ services, syncedAt }` を assert | top-level syncedAt 追加 |
| EX-2 | StatusList 表示テスト（あれば） | services のみ | syncedAt 有=「現在」表示 / 無=非表示 を追加 | UI 表示要件 |

## 3. 削除テストケース

| ID | 対象 | 削除理由 |
|---|---|---|
| （なし。getCachedStatus は cron が継続利用のため残す） | | |

## 4. リグレッション強化

- 既存 `getCachedStatus`（listAll そのまま）テストは維持（cron backstop 経路）。
- 安全サブセット（Zod strip / 不正 status reject）テストは不変・維持。
- cron secret 認可（isAuthorizedCron）テスト不変・維持。

## 5. Mock 方針差分

| 対象 | 前回 | 今回 | 理由 |
|---|---|---|---|
| fetchStatus | cache.test で mock | read-through でも fetchStatus を injectable mock（実 HUB 不要、O35） | 実キー無し CI green |
| now | 一部 | read-through / syncedAt 整形で `now` を注入し時刻依存を排除 | 決定的テスト |

## 6. カバレッジ目標

| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | 既存継承（concept §） |
| 分岐 | 70% | read-through の fresh/stale/fail/throttle 分岐を網羅 |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-06-08 | 初版作成 | /flow:revise |
