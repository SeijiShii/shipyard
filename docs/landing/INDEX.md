# landing ドキュメントインデックス

**最終更新**: 2026-05-28 12:30
**生成元**: /flow:concept (初期化) / /flow:tdd (unit 実装完了 + messaging-shift Phase 1 完了) / /flow:revise (messaging-shift 設計完了)

<!-- auto-generated-start -->

## 状態: unit 実装完了 (2026-05-27)
Phase 1（page + Hero）+ Phase 2（Value/ConsultPitch + 稼働一覧埋込）完了。単体 5 件 GREEN。JSON-LD/OGP 配線、CTA→/contact。**E2E（004）+ 視覚レビュー + wording は後続ゲート**。

## 機能概要 (短縮、詳細は README.md)
（README.md 参照）

## ファイル一覧（番号順）
| 番号 | ファイル | 種別 | 状態 | 最終更新 | 短い説明 |
|---|---|---|---|---|---|
| 001 | 001_landing_SPEC.md | SPEC | 設計済 | 2026-05-27 | LP（ヒーロー/価値/コンサル/O41 入口理解） |
| 002 | 002_landing_PLAN.md | PLAN | 設計済 | 2026-05-27 | page + Hero/Value/ConsultPitch |
| 003 | 003_landing_UNIT_TEST.md | UNIT_TEST | 設計済 | 2026-05-27 | セクション render + CTA + metadata |
| 004 | 004_landing_E2E_TEST.md | E2E_TEST | 設計済（未実行） | 2026-05-27 | journey + Level1/2（/flow:e2e） |
| 101 | 101_landing_IMPL_REPORT.md | IMPL_REPORT | 実装完了 | 2026-05-27 | page/Hero/Value/ConsultPitch + JsonLd |
| 102 | 102_landing_UNIT_TEST_REPORT.md | UNIT_TEST_REPORT | 実装完了 | 2026-05-27 | 5 件 GREEN（CTA/metadata/JsonLd） |

## サブフォルダ（改修・バグ修正・クレーム判定履歴）
| パス | 種別 | issue/slug | 状態 | 概要 | INDEX |
|---|---|---|---|---|---|
| [revise_messaging-shift_20260528_tone-shift-together-thinking/](./revise_messaging-shift_20260528_tone-shift-together-thinking/) | revise | messaging-shift | 実装完了 (Phase 1 unit 10/10 GREEN、E2E 待ち) | LP メッセージング転換 (lead-gen → 「共に考える相談相手」スタンス) | [INDEX](./revise_messaging-shift_20260528_tone-shift-together-thinking/INDEX.md) |

## 関連
- 親 concept: `../concept.md` §1.3.1 landing 行 / §4.8
- 依存: _shared/ui, _shared/seo, service-status（埋込）, inquiry（CTA 遷移先）
- 実装コード: `app/(public)/page.tsx` `features/landing/`（§1.4 参照）

## AI アクセスガイド（読み込み順推奨）
- 機能概要 → README.md
- 仕様詳細 → 001_landing_SPEC.md

## 機能性質タグ
- feature（UI、LP）

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
