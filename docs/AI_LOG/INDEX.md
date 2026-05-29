# AI_LOG インデックス — shipyard

**最終更新**: 2026-05-29 09:16 (+09:00)
**総セッション数**: 50
**総 decision 数**: 120

> このフォルダは AI 主導の自走 / 後追いトレースを目的とする詳細ログ。
> セッションごとに 1 ファイル、append-only、過去ファイルは削除・編集禁止。
> 人間向けサマリは `../concept.md` §7 決定事項ログ を参照。

<!-- auto-generated-start -->

## セッション一覧（新しい順）

| ファイル | 実行日 | コマンド | 対象 | decision 範囲 | 状態 |
|---|---|---|---|---|---|
| [D20260529_004_secure_product-wide.md](./D20260529_004_secure_product-wide.md) | 2026-05-29 | /flow:secure | release-pre audit→secure pair (L1 delta + L4 deps、Critical/High 0 PASS) | D20260529-003 | 完了 |
| [D20260529_003_scenario_update.md](./D20260529_003_scenario_update.md) | 2026-05-29 | /flow:scenario | --update (§3.0c drift シューティング、AUDIT-structure-001 5連続 撃ち落とし、O48 revert 反映 + deploy 手順訂正) | D20260529-002 | 完了 |
| [D20260529_002_audit_full.md](./D20260529_002_audit_full.md) | 2026-05-29 | /flow:audit | full (release-pre 必須監査 再実行、HEAD 4a1466a O48 revert 後) | D20260529-001 | 完了 (**PASS**: Critical 0/High 0/Medium 1/Low 2、AUDIT-structure-001 SCENARIO §5 stale **5 連続**) |
| [D20260529_001_resume_continuous.md](./D20260529_001_resume_continuous.md) | 2026-05-29 | /flow:auto | continuous loop resume (§3.0c release-pre 鮮度ゲート → audit dispatch) | - | 進行中 |
| [D20260528_025_fix_o48-overkill-revert.md](./D20260528_025_fix_o48-overkill-revert.md) | 2026-05-28 | /flow:release (inline fix) | [論点-008] 確定 + O48 retrofit 全 revert (audit→revise→tdd 誤判定からの整合性回復、170 GREEN) | D20260528-053 | 完了 |
| [D20260528_024_scenario_update.md](./D20260528_024_scenario_update.md) | 2026-05-28 | /flow:scenario | --update (§5 refresh、AUDIT-structure-001 4 連続常習化 reconcile) | D20260528-052 | 完了 |
| [D20260528_023_audit_full.md](./D20260528_023_audit_full.md) | 2026-05-28 | /flow:audit | full (release-pre 再実行) | D20260528-051 | 完了 (**改善**: High 1→0、Medium 3→2、AUDIT-perspective-001 解消 ✅、release-pre ハードゲート通過、AUDIT-structure-001 4 連続常習化深化) |
| [D20260528_022_tdd__shared_hub-client_revise_service-info-v2-contract.md](./D20260528_022_tdd__shared_hub-client_revise_service-info-v2-contract.md) | 2026-05-28 | /flow:tdd | _shared/hub-client revise_service-info-v2-contract (Phase 1+2、174→176 GREEN、AUDIT-perspective-001 撃ち落とし完遂) | D20260528-050 | 完了 |
| [D20260528_021_revise__shared_hub-client_service-info-v2-contract.md](./D20260528_021_revise__shared_hub-client_service-info-v2-contract.md) | 2026-05-28 | /flow:revise | _shared/hub-client — service-info-v2-contract (AUDIT-perspective-001 撃ち落とし) | D20260528-049 | 完了 (4 文書生成、Class A auto-pick、tdd 待ち) |
| [D20260528_020_audit_full.md](./D20260528_020_audit_full.md) | 2026-05-28 | /flow:audit | full (release-pre 必須監査) | D20260528-048 | 完了 (**悪化**: High 1 新規 = O48 v2 contract drift、Medium 3、Low 2、AUDIT-structure-001 3 連続常習化) |
| [D20260528_019_resume_continuous.md](./D20260528_019_resume_continuous.md) | 2026-05-28 | /flow:auto | continuous loop (D018 後再開、release-pre ハードゲート判定) | D20260528-047 | 進行中 |
| [D20260528_018_tdd_inquiry_revise_mail-include-reply.md](./D20260528_018_tdd_inquiry_revise_mail-include-reply.md) | 2026-05-28 | /flow:tdd | inquiry mail-include-reply 実装 (Phase 1+2、172→174 GREEN) | D20260528-046 | 完了 ([論点-006] reconcile 完遂) |
| [D20260528_017_revise_inquiry_mail-include-reply.md](./D20260528_017_revise_inquiry_mail-include-reply.md) | 2026-05-28 | /flow:revise | inquiry mail-include-reply ([論点-006] 案 c reconcile) | D20260528-044/045 | 完了 (4 文書生成、SEC-001 vs [論点-006] 衝突 = 訪問者本人宛例外で解決) |
| [D20260528_016_audit_standard.md](./D20260528_016_audit_standard.md) | 2026-05-28 | /flow:audit | standard (本日 2 回目) | D20260528-042 | 完了 (改善: O56 favicon 解消、Medium 2→1) |
| [D20260528_015_tdd_service-status_revise_service-icons.md](./D20260528_015_tdd_service-status_revise_service-icons.md) | 2026-05-28 | /flow:tdd | service-icons revise (Phase 1+2、161→172 GREEN) | D20260528-041 | 完了 (全パイプライン疎通) |
| [D20260528_014_design_favicon-setup.md](./D20260528_014_design_favicon-setup.md) | 2026-05-28 | (手動 favicon 配線) | O56 retrofit | D20260528-040 | 完了 (AUDIT-perspective-001 Medium reconcile) |
| [D20260528_013_spec-review_service-status-revise-icons.md](./D20260528_013_spec-review_service-status-revise-icons.md) | 2026-05-28 | /flow:spec-review | service-icons revise (auto-pick) | D20260528-039 | 完了 (Critical 1 / High 1 / Medium 4 / Low 1 + 設計判断 5) |
| [D20260528_012_scenario_update.md](./D20260528_012_scenario_update.md) | 2026-05-28 | /flow:scenario | --update (§5 refresh) | D20260528-038 | 完了 (AUDIT-structure-001 Medium reconcile) |
| [D20260528_011_audit_standard.md](./D20260528_011_audit_standard.md) | 2026-05-28 | /flow:audit | standard | D20260528-037 | 完了 (改善: High 1→0、Medium 2 新規) |
| [D20260528_010_resume_continuous.md](./D20260528_010_resume_continuous.md) | 2026-05-28 | /flow:auto | continuous loop (反復 6+) | D20260528-036 | 進行中 |
| [D20260528_009_revise_service-status_service-icons.md](./D20260528_009_revise_service-status_service-icons.md) | 2026-05-28 | /flow:revise | service-status — service-icons | D20260528-028〜035 | 完了 |
| [D20260528_008_resume_continuous.md](./D20260528_008_resume_continuous.md) | 2026-05-28 | /flow:auto | continuous loop (反復 5) | D20260528-024 | 進行中 |
| [D20260528_007_release_shipyard.md](./D20260528_007_release_shipyard.md) | 2026-05-28 | /flow:release | shipyard 初回 | D20260528-022〜027 | 進行中 (Phase 2 動作確認中) |
| [D20260528_006_wording_landing.md](./D20260528_006_wording_landing.md) | 2026-05-28 | /flow:wording | landing | D20260528-021 | 完了 (暫定承認、Wording gate 通過) |
| [D20260528_005_e2e_landing.md](./D20260528_005_e2e_landing.md) | 2026-05-28 | /flow:e2e | landing | D20260528-018〜020 | 完了 (red, scaffold 待ち) |
| [D20260528_004_tdd_landing_revise_messaging-shift.md](./D20260528_004_tdd_landing_revise_messaging-shift.md) | 2026-05-28 | /flow:tdd | revise — landing messaging-shift | D20260528-014〜017 | 完了 |
| [D20260528_003_resume_continuous.md](./D20260528_003_resume_continuous.md) | 2026-05-28 | /flow:auto | continuous loop | D20260528-012〜013 | 進行中 |
| [D20260528_002_revise_landing_messaging-shift.md](./D20260528_002_revise_landing_messaging-shift.md) | 2026-05-28 | /flow:revise | landing — messaging-shift | D20260528-003〜011 | 完了 |
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
| D20260528-021 | /flow:wording | Step 0 / 校正方針 | 暫定文案で承認 (Wording gate 通過) | explicit-choice | D20260528_006_wording_landing.md |
| D20260528-020 | /flow:e2e | Step 7 / loop 次展開 | flow:auto に委譲 (P4.45 Wording 推奨) | auto-recommended | D20260528_005_e2e_landing.md |
| D20260528-019 | /flow:e2e | Step 2/4 / 実行可否 | scaffold fix seed 化、103 red | auto-recommended | D20260528_005_e2e_landing.md |
| D20260528-018 | /flow:e2e | Step 1 / FW 検出 | Playwright (scaffold 未完了) | auto-recommended | D20260528_005_e2e_landing.md |
| D20260528-017 | /flow:tdd | Step 6 / 全テスト | 159/159 GREEN | auto-recommended | D20260528_004_tdd_landing_revise_messaging-shift.md |
| D20260528-016 | /flow:tdd | Phase 1 / アンチパターン回避 | 「とは約束しません」型に書き換え | auto-recommended | D20260528_004_tdd_landing_revise_messaging-shift.md |
| D20260528-015 | /flow:tdd | Phase 1 / copy.ts 外出し | 採用 | auto-recommended | D20260528_004_tdd_landing_revise_messaging-shift.md |
| D20260528-014 | /flow:tdd | Step 4 / Phase 軽重 | 軽 (メイン直接) | auto-recommended | D20260528_004_tdd_landing_revise_messaging-shift.md |
| D20260528-013 | /flow:auto | Step 4 / dispatch | /flow:tdd <landing-revise> | auto-recommended | D20260528_003_resume_continuous.md |
| D20260528-012 | /flow:auto | Step 3 / 優先度判定 | P4 新規 revise 実装 | auto-recommended | D20260528_003_resume_continuous.md |
| D20260528-011 | /flow:revise | Step 4.1 / マイグレーション要否 | 不要 (Phase 5 skip) | auto-recommended | D20260528_002_revise_landing_messaging-shift.md |
| D20260528-010 | /flow:revise | Step 3.2 / タグ判定 | feature 維持 | auto-recommended | D20260528_002_revise_landing_messaging-shift.md |
| D20260528-009 | /flow:revise | Step 3.1 / E ロールバック | git revert | auto-recommended | D20260528_002_revise_landing_messaging-shift.md |
| D20260528-008 | /flow:revise | Step 3.1 / D 既存テスト | 全維持 + U-T1〜T4 追加 | auto-recommended | D20260528_002_revise_landing_messaging-shift.md |
| D20260528-007 | /flow:revise | Step 3.1 / C リリース | 一括 | auto-recommended | D20260528_002_revise_landing_messaging-shift.md |
| D20260528-006 | /flow:revise | Step 3.1 / B 後方互換 | 互換維持 | auto-recommended | D20260528_002_revise_landing_messaging-shift.md |
| D20260528-005 | /flow:revise | Step 3.1 / A 動機 | concept 転換との同期 | auto-recommended | D20260528_002_revise_landing_messaging-shift.md |
| D20260528-004 | /flow:revise | Step 2.2 / Read スコープ | docs/landing/* + design SoT 該当節 + concept §1.1/§1 | auto-recommended | D20260528_002_revise_landing_messaging-shift.md |
| D20260528-003 | /flow:revise | Step 1.2 / 改修要望取得 | 親セッション (Skill 引数) 経由 | auto-recommended | D20260528_002_revise_landing_messaging-shift.md |
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
