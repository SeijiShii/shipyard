# AI_LOG インデックス — shipyard

**最終更新**: 2026-05-28 11:50 (+09:00)
**総セッション数**: 23
**総 decision 数**: 72

> このフォルダは AI 主導の自走 / 後追いトレースを目的とする詳細ログ。
> セッションごとに 1 ファイル、append-only、過去ファイルは削除・編集禁止。
> 人間向けサマリは `../concept.md` §7 決定事項ログ を参照。

<!-- auto-generated-start -->

## セッション一覧（新しい順）

| ファイル | 実行日 | コマンド | 対象 | decision 範囲 | 状態 |
|---|---|---|---|---|---|
| [D20260528_001_concept_update_messaging.md](./D20260528_001_concept_update_messaging.md) | 2026-05-28 | /flow:concept | update — messaging shift | D20260528-001〜002 | 完了 |
| [D20260527_022_secure_product.md](./D20260527_022_secure_product.md) | 2026-05-27 | /flow:secure | product-wide (all) | D20260527-069〜070 | 完了 |
| [D20260527_021_audit_standard.md](./D20260527_021_audit_standard.md) | 2026-05-27 | /flow:audit | standard | D20260527-067〜068 | 完了 |
| [D20260527_020_e2e_continuous.md](./D20260527_020_e2e_continuous.md) | 2026-05-27 | /flow:e2e | continuous (P4.5 gate) | D20260527-064〜066 | 完了 |
| [D20260527_019_tdd_continuous.md](./D20260527_019_tdd_continuous.md) | 2026-05-27 | /flow:tdd | continuous (全12ターゲット unit) | D20260527-048〜063 | 完了 |
| [D20260527_018_spec-review_product.md](./D20260527_018_spec-review_product.md) | 2026-05-27 | /flow:spec-review | product | D20260527-043〜046 | 完了 |
| [D20260527_017_feature_legal.md](./D20260527_017_feature_legal.md) | 2026-05-27 | /flow:feature | legal | D20260527-041 | 完了 |
| [D20260527_016_feature_admin.md](./D20260527_016_feature_admin.md) | 2026-05-27 | /flow:feature | admin | D20260527-040 | 完了 |
| [D20260527_015_feature_inquiry.md](./D20260527_015_feature_inquiry.md) | 2026-05-27 | /flow:feature | inquiry | D20260527-039 | 完了 |
| [D20260527_014_feature_service-status.md](./D20260527_014_feature_service-status.md) | 2026-05-27 | /flow:feature | service-status | D20260527-038 | 完了 |
| [D20260527_013_feature_landing.md](./D20260527_013_feature_landing.md) | 2026-05-27 | /flow:feature | landing | D20260527-037 | 完了 |
| [D20260527_012_feature__shared_spam.md](./D20260527_012_feature__shared_spam.md) | 2026-05-27 | /flow:feature | _shared/spam | D20260527-036 | 完了 |
| [D20260527_011_feature__shared_hub-client.md](./D20260527_011_feature__shared_hub-client.md) | 2026-05-27 | /flow:feature | _shared/hub-client | D20260527-035 | 完了 |
| [D20260527_010_feature__shared_auth.md](./D20260527_010_feature__shared_auth.md) | 2026-05-27 | /flow:feature | _shared/auth | D20260527-034 | 完了 |
| [D20260527_009_feature__shared_email.md](./D20260527_009_feature__shared_email.md) | 2026-05-27 | /flow:feature | _shared/email | D20260527-033 | 完了 |
| [D20260527_008_feature__shared_seo.md](./D20260527_008_feature__shared_seo.md) | 2026-05-27 | /flow:feature | _shared/seo | D20260527-032 | 完了 |
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
| D20260528-002 | /flow:concept | LP SPEC 反映タイミング | 後続 /flow:revise landing | auto-recommended | D20260528_001_concept_update_messaging.md |
| D20260528-001 | /flow:concept | Step 1.5 / wants 取り込み | A. 冒頭表+§1+§1.1 UC#3 全面再ライト | explicit-choice | D20260528_001_concept_update_messaging.md |
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
