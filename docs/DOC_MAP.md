# プロダクトドキュメントマップ (shipyard)

**最終更新**: 2026-05-28 11:50 (+09:00)
**最新コマンド**: /flow:concept (D20260528_001 — messaging shift)
**統計**: 機能フォルダ 5 / 横断フォルダ 7 / 改修件数 0 / バグ修正件数 0 / クレーム判定件数 0 / Open 論点 1 件

> **このファイルは AI 用エントリポイント**。目的別に「どこから読めばいいか」「次に何を Read すべきか」を示す。

<!-- auto-generated-start -->

## 0. AI 用クイックアクセス（目的別）

| 目的 | 最初に Read | 次に Read | 注記 |
|---|---|---|---|
| プロダクト全体を理解する | `./concept.md` (§1, §1.3, §4.2) | `./INDEX.md` | 5 分で全体像 |
| 次に何をすべきか判断する | `./SCENARIO.md` (§5 現在地カーソル) | `./AI_LOG/INDEX.md` | `/flow:auto` 起動で三点照合 |
| 特定機能を理解する | `./<feature>/README.md` | `./<feature>/INDEX.md` → `001_*_SPEC.md` | feature 一覧は §2 |
| 実装前準備を確認する | `./PREREQUISITES.md` | `./concept.md §4.3` | API キー / アカウント |
| 設計判断の経緯を辿る | `./AI_LOG/INDEX.md` | 該当セッションファイル | decision_id 索引で grep |
| 未決論点を見る | `./concept.md §8` | `./AI_LOG/INDEX.md` Open 論点 | [論点-001] HUB contract |
| 工数感を知る | `./estimates/` | 機能別 estimate | `/flow:estimate` で生成 |
| 法務対応状況を見る | `./concept.md §9` | — | 特商法は不要（課金なし） |
| 観点（考慮漏れ）を確認 | `~/.claude/flow-data/perspectives.md` | — | |

## 1. プロダクト全体

- **概念設計 (SoT)**: [./concept.md](./concept.md)
  - 一行で言うと: 動いているサービス群で実装力の信頼を作り、「正解の見えない世界で共に考える相談相手」として出会う showcase + 相談導線
  - 現フェーズ: 企画（concept 更新 — メッセージング転換 2026-05-28）
  - 最終更新: 2026-05-28
- **プロジェクト INDEX (フラット一覧)**: [./INDEX.md](./INDEX.md)
- **見積もり**: [./estimates/](./estimates/)

## 2. 機能フォルダ（業務ドメイン）

| 優先度 | 基盤 | フォルダ | 状態 | INDEX |
|---|---|---|---|---|
| 3 | ❌ | landing | 設計待ち | [INDEX](./landing/INDEX.md) |
| 3 | ❌ | service-status | 設計待ち | [INDEX](./service-status/INDEX.md) |
| 3 | ❌ | inquiry | 設計待ち | [INDEX](./inquiry/INDEX.md) |
| 3 | ❌ | legal | 設計待ち | [INDEX](./legal/INDEX.md) |
| 4 | ❌ | admin | 設計待ち | [INDEX](./admin/INDEX.md) |

## 3. 横断フォルダ（_shared/*）

| 優先度 | フォルダ | 状態 | INDEX |
|---|---|---|---|
| 1 | _shared/db | 設計待ち | [INDEX](./_shared/db/INDEX.md) |
| 1 | _shared/ui | 設計待ち | [INDEX](./_shared/ui/INDEX.md) |
| 1 | _shared/seo | 設計待ち | [INDEX](./_shared/seo/INDEX.md) |
| 1 | _shared/email | 設計待ち | [INDEX](./_shared/email/INDEX.md) |
| 1 | _shared/auth | 設計待ち | [INDEX](./_shared/auth/INDEX.md) |
| 2 | _shared/hub-client | 設計待ち | [INDEX](./_shared/hub-client/INDEX.md) |
| 2 | _shared/spam | 設計待ち | [INDEX](./_shared/spam/INDEX.md) |

## 4. 設計判断の経緯

- **AI_LOG インデックス**: [./AI_LOG/INDEX.md](./AI_LOG/INDEX.md)
- **最新セッション**: D20260527_001_concept_initial（完了、decision 10 件）
- **Open 論点**: 1 件（[論点-001] HUB status contract、concept §8 と同期）
- **Superseded chain**: 0 件

## 5. 観点・選好データ（PJ 外部参照）

- **観点 SoT**: `~/.claude/flow-data/perspectives.md`
- **開発者選好**: `~/.claude/flow-data/preferences.md`
  - 学習元 PJ 数（累計）: 4（hana-memo / service-hub / bousai-bag-checker / naze-bako）→ shipyard で 5 予定
  - 強い選好（採用 4）: React+TS / Vercel / Sentry / GitHub Actions+Vercel Preview / shadcn/ui

## 6. ファイル種別ガイド（番号体系）

| 種別 | 番号 / パターン | パス例 | 生成元 |
|---|---|---|---|
| 機能 SPEC | `001_*_SPEC.md` | `./inquiry/001_inquiry_SPEC.md` | `/flow:feature` |
| 機能 PLAN | `002_*_PLAN.md` | `./inquiry/002_inquiry_PLAN.md` | `/flow:feature` |
| 単体テスト計画 | `003_*_UNIT_TEST.md` | `./inquiry/003_inquiry_UNIT_TEST.md` | `/flow:feature` |
| E2E テスト計画 | `004_*_E2E_TEST.md` | `./inquiry/004_inquiry_E2E_TEST.md` | `/flow:feature` |
| 実装レポート | `101_*_IMPL_REPORT.md` | `./inquiry/101_inquiry_IMPL_REPORT.md` | `/flow:tdd` |
| AI_LOG セッション | `D<date>_<sess>_<cmd>_<target>.md` | `./AI_LOG/D20260527_001_concept_initial.md` | 各 flow コマンド |
| 見積もり | `<feature>_<date>.md` / `全体_<date>_<slug>.md` | `./estimates/` | `/flow:estimate` |

## 7. 依存・優先度グラフ（concept §1.3.4 から導出）

```
_shared/db (優先度 1, 基盤 ✅)
_shared/ui (優先度 1, 基盤 ✅)
_shared/seo (優先度 1, 基盤 ✅)
_shared/email (優先度 1, 基盤 ✅)
_shared/auth (優先度 1, 基盤 ✅)
_shared/hub-client (優先度 2, 基盤 ✅) ← db
_shared/spam (優先度 2, 基盤 ✅) ← db
landing (優先度 3) ← ui, seo
service-status (優先度 3) ← hub-client, ui
inquiry (優先度 3) ← db, spam, email, ui
legal (優先度 3) ← ui, seo
admin (優先度 4) ← db, auth, email, ui
```
循環依存: なし

## 8. コマンド使い分けガイド

| やりたいこと | コマンド | 入力 | 主要出力 |
|---|---|---|---|
| 概念設計の更新 | `/flow:concept` | wants / 引数 | `./concept.md` + 各 INDEX |
| 次アクション自動実行 | `/flow:auto` | SCENARIO + AI_LOG | 該当 flow コマンド連鎖 |
| 新規機能を設計 | `/flow:feature <feature>` | concept + README | `001`〜`004` |
| デザインシステム | `/flow:design` | concept | `docs/design/design-system.md` |
| 実装 | `/flow:tdd` | 設計 4 文書 | `101` + `102` |
| 工数見積もり | `/flow:estimate` | concept or feature | estimate ファイル |
| 公開周知文面 | `/flow:promote` | concept + URL | `docs/marketing/` |

## 9. 履歴サマリ（改修 / バグ修正 / クレーム判定）

- **改修件数 (累計)**: 0 件
- **バグ修正件数 (累計)**: 0 件
- **クレーム判定件数 (累計)**: 0 件

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
