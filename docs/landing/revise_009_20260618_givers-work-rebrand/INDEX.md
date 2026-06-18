# revise_009_20260618_givers-work-rebrand — 公開ブランドを givers.work に統一 [論点-009]

**状態**: implemented (unit green、未デプロイ改修)
<!-- ticket-status: implemented | updated: 20260618 | ref: lib/seo/config.ts SITE_NAME=givers.work -->

**種別**: revise (landing + _shared/seo — 公開ブランドのリブランド)
**起点**: concept §8 [論点-009] (status=accepted-as-requirement、2026-06-10 seiji [flow])
**重要度**: — (公開ブランド統一、機能影響なし)

## 概要

shipyard を QUADii の公式ホームページ = **givers.work** として公開向けにリブランド。
「shipyard」は内部コードネームに留め、ユーザー向け表示・SEO title・OGP・ヘッダー/フッターの
ブランド表記を givers.work に統一する ([論点-009])。

## 変更内容

| 対象 | 変更 |
|---|---|
| `lib/seo/config.ts` | `SITE_NAME` "shipyard" → **"givers.work"** (ブランド SoT。title/og:site_name/JSON-LD へ伝播) |
| `lib/seo/og.ts` | `ogTitle` 既定値を hardcode "shipyard" → `SITE_NAME` 参照 (DRY) |
| `app/og/route.tsx` | OG 画像の hardcode "shipyard" → `SITE_NAME` |
| `components/layout/Header.tsx` | ワードマーク hardcode → `SITE_NAME` |
| `components/layout/Footer.tsx` | `© {y} shipyard` → `© {y} {SITE_NAME}` (powered by givers.work は既存維持) |
| `app/legal/{privacy,terms,commerce}/page.tsx` | metadata description の "shipyard" → "givers.work" (commerce は "QUADii（givers.work）") |
| `features/legal/{Privacy,Terms}Content.tsx` | 本文「本サイト（shipyard）」→「本サイト（givers.work）」 |

## スコープ外 (意図的)

- `lib/seo/config.ts` `MAKER_NAME` = "shipyard" → メイカー名義 (JSON-LD Person)。最終表記は `/flow:wording` で調整 (concept 既定)。本 revise の brand 統一とは別軸。
- `features/inquiry/storage.ts` `KEY = "shipyard.threads"` → localStorage 内部キー (非表示)。変更は既存ユーザーのスレッド永続を破壊するため据え置き (内部コードネーム使用は可)。
- [論点-010] summary 表示 / [論点-011] service-hub 上流は別チケット (本 revise 非対象)。

## 検証

- unit/component: 全 **17 files / 192 tests green**、`tsc --noEmit` clean
- audit signal (CF-20260610-003 §2.5): `givers.work` が seo/header/footer に露出 + ユーザー向け表示で `shipyard` がブランド名として出ない (= 未リブランド検出が解消)
- 視覚レビュー (Design gate): 未 (ローカル headless 視覚確認は `/flow:design --review-only` で別途。ブランド文字列差し替えのみで構造変更なし)
- 仕上げ: `/flow:wording` (公式 HP トーン + MAKER_NAME 確定) が後段

## 残

- 未デプロイ改修 (本番反映は `/flow:release` = 人手ゲート)。
