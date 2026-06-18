# D20260618_002_resume_continuous — /flow:auto (hub → shipyard [論点-010])

**状態**: 完了
**モード**: continuous (hub pick → shipyard [論点-010] 自律)
**開始**: 2026-06-18

## サマリ

上流 [論点-011] (service-hub、本日 landed) で summary が公開 status API に流れるように
なったため、shipyard consumer ([論点-010]) を実装。稼働一覧の各カードに名前下の短文紹介を
表示。service-icons (iconUrl) consumer と対称配線。これで summary パイプラインが全層
code-complete (producer → HUB → showcase)。

## decisions

- id: D20260618-001
  question: 反復1 auto-pick ([論点-010] summary 表示 consumer)
  chosen: /flow:revise service-status (contract + db + StatusCard に summary 配線)
  chosen_type: auto-recommended
  context: |
    上流 [論点-011] landed で unblock。iconUrl=service-icons consumer パターンを踏襲:
    contract (zod optional + .catch 降格) → cache.ts upsert 明示列挙 → statusCache repo
    (input + values + onConflict) → schema 列 + migration 0002 (ADD COLUMN) →
    StatusListItem/StatusCardService passthrough → StatusCard 名前下表示 (line-clamp-2)。
    TDD +7 tests (contract SM-C1〜3 / StatusCard SM-Card1〜3 / repo SM-Repo1)。
    全 17 files / 199 tests green / tsc clean。committed cbb8bb4。

- id: D20260618-002
  question: 反復2 Design gate (P4.4(b)) 視覚レビュー判定
  chosen: 視覚レビューを「全層デプロイ後」に defer (honest)、停止して人手ゲートへ
  chosen_type: auto-recommended
  context: |
    StatusCard レイアウト変更 (summary 行) は Design gate 対象だが、実 summary データは
    上流 (service-hub + producer) デプロイ後にしか流れない。実データなしの視覚レビューは
    意味が薄い (機能描画は component テスト SM-Card1〜3 で担保済)。
    → 視覚レビューは pipeline 全層デプロイ後に /flow:design --review-only で実施と記録。
    残るのは全て Class B (db:migrate / db:push / 各再デプロイ) = release 人手ゲート。

## 成果物

- cbb8bb4 revise(service-status): 一覧に summary 短文紹介を表示 [論点-010]
- lib/db/migrations/0002_unknown_network.sql (ADD COLUMN summary)
- docs/service-status/revise_010_20260618_summary-display/INDEX.md

## 残 (Class B 人手ゲート)

- 全層デプロイ: service-hub (db:push summary + redeploy) / producer 再デプロイ / shipyard (db:migrate + redeploy)
- デプロイ後: shipyard 視覚レビュー (/flow:design --review-only、実 summary 表示確認)
