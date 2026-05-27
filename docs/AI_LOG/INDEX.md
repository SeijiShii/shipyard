# AI_LOG インデックス — shipyard

**最終更新**: 2026-05-27 14:55 (+09:00)
**総セッション数**: 7
**総 decision 数**: 30

> このフォルダは AI 主導の自走 / 後追いトレースを目的とする詳細ログ。
> セッションごとに 1 ファイル、append-only、過去ファイルは削除・編集禁止。
> 人間向けサマリは `../concept.md` §7 決定事項ログ を参照。

<!-- auto-generated-start -->

## セッション一覧（新しい順）

| ファイル | 実行日 | コマンド | 対象 | decision 範囲 | 状態 |
|---|---|---|---|---|---|
| [D20260527_007_feature__shared_ui.md](./D20260527_007_feature__shared_ui.md) | 2026-05-27 | /flow:feature | _shared/ui | D20260527-030 | 完了 |
| [D20260527_006_feature__shared_db.md](./D20260527_006_feature__shared_db.md) | 2026-05-27 | /flow:feature | _shared/db | D20260527-026〜027 | 完了 |
| [D20260527_005_design_system.md](./D20260527_005_design_system.md) | 2026-05-27 | /flow:design | system | D20260527-023〜024 | 完了 |
| [D20260527_004_estimate_whole.md](./D20260527_004_estimate_whole.md) | 2026-05-27 | /flow:estimate | whole | D20260527-021 | 完了 |
| [D20260527_003_secure_concept.md](./D20260527_003_secure_concept.md) | 2026-05-27 | /flow:secure | concept | D20260527-015〜019 | 完了 |
| [D20260527_002_resume_continuous.md](./D20260527_002_resume_continuous.md) | 2026-05-27 | /flow:auto | continuous | D20260527-014, 020〜 | 進行中 |
| [D20260527_001_concept_initial.md](./D20260527_001_concept_initial.md) | 2026-05-27 | /flow:concept | initial | D20260527-001〜013 | 完了 |

## decision_id 索引（grep 用、新しい順）

| ID | command | phase | chosen (短縮) | type | ファイル |
|---|---|---|---|---|---|
| D20260527-019 | /flow:secure | O25/O27/O28 | 対応済み/deps 繰延 | auto-recommended | D20260527_003_secure_concept.md |
| D20260527-018 | /flow:secure | O24 入力検証 | accepted-as-requirement (High) | auto-recommended | D20260527_003_secure_concept.md |
| D20260527-017 | /flow:secure | O23 認可/IDOR | accepted-as-requirement (High) | auto-recommended | D20260527_003_secure_concept.md |
| D20260527-016 | /flow:secure | O26 PII ログ | accepted-as-requirement (Critical) | auto-recommended | D20260527_003_secure_concept.md |
| D20260527-015 | /flow:secure | PJ 性質判定 | 複数U/公開/個人情報あり | auto-recommended | D20260527_003_secure_concept.md |
| D20260527-014 | /flow:auto | 反復 1 | /flow:secure --phase=design | auto-recommended | D20260527_002_resume_continuous.md |
| D20260527-013 | /flow:concept | Step 7.7 / Git | git init + 自動コミット | auto-recommended | D20260527_001_concept_initial.md |
| D20260527-012 | /flow:concept | Step 7.5 / preferences | すべて更新 | auto-recommended | D20260527_001_concept_initial.md |
| D20260527-011 | /flow:concept | Step 5.5 / wants | アーカイブして空に | auto-recommended | D20260527_001_concept_initial.md |
| D20260527-010 | /flow:concept | Step 3 / 論点 | (open) HUB contract | open | D20260527_001_concept_initial.md |
| D20260527-009 | /flow:concept | Q12.5 外部 AI | 使わない | auto-recommended | D20260527_001_concept_initial.md |
| D20260527-008 | /flow:concept | Q11 リソース選定 | §3.1 無料枠バンドル | auto-recommended | D20260527_001_concept_initial.md |
| D20260527-007 | /flow:concept | Step 3 / FW | Next.js (Vite override) | auto-recommended | D20260527_001_concept_initial.md |
| D20260527-006 | /flow:concept | Q12.12 デザイン | 信頼感×ミニマル×クラフト | auto-recommended | D20260527_001_concept_initial.md |
| D20260527-005 | /flow:concept | スパム対策 | 不可視スタック | auto-recommended | D20260527_001_concept_initial.md |
| D20260527-004 | /flow:concept | 問い合わせ識別 | メアド必須+検証 | explicit-choice | D20260527_001_concept_initial.md |
| D20260527-003 | /flow:concept | 問い合わせ形式 | サイト内スレッド | explicit-choice | D20260527_001_concept_initial.md |
| D20260527-002 | /flow:concept | 永続化 | Neon-backed | non-recommended | D20260527_001_concept_initial.md |
| D20260527-001 | /flow:concept | Step 1.7 | preferences 読込 | auto-recommended | D20260527_001_concept_initial.md |

## Open 論点（chosen_type=open、全期間横断）

| ID | 論点タイトル | 採番セッション | 関連 decision |
|---|---|---|---|
| D20260527-010 | service-hub GET /api/public/status contract 確定（concept §8 [論点-001]） | D20260527_001 | D20260527-003 |

## Superseded chain（旧 Open → 新解決）

| 旧 ID | 新 ID | 解決日 | 解決セッション |
|---|---|---|---|
| (なし) | | | |

<!-- auto-generated-end -->

<!-- user-edit-start -->
<!-- user-edit-end -->
