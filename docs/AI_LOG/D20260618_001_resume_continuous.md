# D20260618_001_resume_continuous — /flow:auto (hub A2 dispatch)

**状態**: 完了
**モード**: continuous (hub `/flow:hub` A2 → shipyard `/flow:auto`)
**開始**: 2026-06-18
**対象**: [論点-009] givers.work リブランド + [論点-010] summary 表示

## サマリ

hub の「今日やること」A2 (shipyard 自律トラック) を起点に `/flow:auto` を shipyard で実行。
[論点-009] (givers.work リブランド) を完遂。[論点-010] (summary 表示) は cross-PJ 上流
[論点-011] (service-hub public status API) + DB migration (Class B) + Design gate に阻まれる
正当な境界のため、honest boundary で停止し次の hub pick を提示。

## decisions

- id: D20260618-001
  question: Step 0.5 前回停止の適切性ふりかえり
  chosen: 適切 (前回 = D20260529_006 promote、Phase5 launch 完了で正当)
  chosen_type: auto-recommended
  context: 今回は hub A2 からの新規 dispatch

- id: D20260618-002
  question: 反復1 auto-pick ([論点-009] givers.work リブランド)
  chosen: /flow:revise landing (公開ブランド統一)
  chosen_type: auto-recommended
  context: SITE_NAME を SoT に header/footer/OGP/SEO title/legal を givers.work へ統一。
           og.ts/og route/Header/Footer は SITE_NAME 参照に DRY 化。
           17 files / 192 tests green / tsc clean / committed 7352722。
           audit signal (CF-20260610-003 §2.5) = givers.work が seo/header/footer に露出 +
           ユーザー向けに shipyard がブランド名として出ない を満たす。
           MAKER_NAME (wording 後段) と storage KEY (内部永続) は意図的にスコープ外

- id: D20260618-003
  question: 反復2 評価 ([論点-010] summary 表示) の no-key/Class-A 変種チェック (§4.5.1#0)
  chosen: 停止 (honest boundary) — cross-PJ 上流 + DB migration + Design gate の正当な境界
  chosen_type: auto-recommended
  context: |
    [論点-010] (★★★必須、summary 表示) は以下に阻まれる:
    (1) cross-PJ 上流依存 = [論点-011] service-hub 公開 status API が summary を未露出
        (別 repo)。data が流れないため shipyard 単独では完結も視覚検証も不能。
    (2) DB migration (Class B) = shipyard は status を Postgres にキャッシュ (cache.ts→repo→DB)。
        summary 表示には summary 列 + migration apply (実 DB = Class B 人手ゲート) が要る。
    (3) Design gate = StatusCard は単一行レイアウト。summary (1-2 文) 表示は card レイアウト
        変更 = 視覚レビュー対象。
    no-key Class-A 変種 (contract に summary optional 追加のみ) は render なし = 観測可能な
    progress ゼロ。正当な unblock 順序 = [論点-011] (service-hub repo、別 PJ = 別 hub pick) を
    先に → shipyard [論点-010] consumer (migration + UI + 視覚レビュー)。
    producer 側は本日 hana-memo (A1) で v3 summary 露出済 (naze-bako/time-budget も既)。
    残る欠落リンク = service-hub の summary 集約 + 公開 API 露出 ([論点-011])。

## 成果物

- 7352722 revise(landing/seo): 公開ブランドを givers.work に統一 [論点-009]
- docs/landing/revise_009_20260618_givers-work-rebrand/INDEX.md

## 残 (次の hub pick)

- [論点-011] (cross-PJ): service-hub 公開 status API に summary を含める (producer 揃いつつあり、
  HUB 側集約 + 公開サブセット露出が欠落リンク) → service-hub PJ で対応 = 別 hub pick
- [論点-010]: 上記 landing 後、shipyard consumer (DB migration + StatusCard summary 表示 + 視覚レビュー)
- 未デプロイ: [論点-009] リブランドは本番反映待ち (/flow:release = 人手ゲート)
