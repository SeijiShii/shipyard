# _shared/hub-client 実装計画書

> **入力**: `./001_hub-client_SPEC.md`, `../db/001_db_SPEC.md`
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | LOC |
|---|---|---|
| `lib/hub/contract.ts` | Zod schema + 型（安全サブセット、strip 余剰） | 40 |
| `lib/hub/client.ts` | fetchHubStatus（env URL、timeout、Zod 検証） | 60 |
| `lib/hub/cache.ts` | refreshStatusCache / getCachedStatus（statusCacheRepo 経由） | 50 |
| `lib/hub/mock.ts` | モック contract（[論点-001] 未解決時の dev 用） | 30 |

## 2. 実装 Phase 分割
- **Phase 1**: contract（Zod）+ mock（純データ、テスト容易）
- **Phase 2**: client（fetch + 検証、injectable で mock 注入テスト）
- **Phase 3**: cache（refresh/get、db repo 連携）+ Cron route（app/api/cron/refresh-status）は service-status 側 or 本横断で

## 3. 依存関係順序
```
contract → mock → client(contract+mock) → cache(client+db.statusCacheRepo)
```

## 4. 既存ファイルへの影響
- service-status が getCachedStatus を利用。Cron route（refresh）を配線。

## 5. リスク・注意点
- 余剰フィールドの strip を徹底（内部指標誤受信防止、§1.2）。
- HUB 未実装の間は mock で開発（HUB-E4）。実 URL 切替は env のみ。
- fetch は timeout + リトライ最小（HUB を叩きすぎない）。

## 6. 完了の定義
- [ ] contract Zod で安全サブセット strip
- [ ] HUB ダウン時キャッシュ保持（graceful）を test 担保
- [ ] mock で実 HUB 不要 CI green
- [ ] 内部指標フィールドが来ても破棄される test

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
