# AI_LOG セッション D20260528_002 — /flow:revise (landing — messaging-shift)

**実行日時**: 2026-05-28 11:55 〜 12:15 (+09:00)
**コマンド**: /flow:revise landing messaging-shift --slug=tone-shift-together-thinking
**対象**: LP 機能 `landing` の SPEC 改修 (concept §1.1/§1 メッセージング転換と同期)
**実行者**: Claude (Opus 4.7) + seiji
**状態**: 完了
**含まれる decision**: D20260528-003 〜 D20260528-011 (9 件)
**ファイル**: `D20260528_002_revise_landing_messaging-shift.md`

---

## 主要決定サマリ

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260528-003 | 改修要望取得経路 | 親セッション (Skill 引数) 経由 — wants.md 起点 | auto-recommended |
| D20260528-004 | Read スコープ | docs/landing/* 全 6 文書 + design SoT §6/§7 + concept §1.1/§1 (更新済) — src/ Read せず | auto-recommended |
| D20260528-005 | 改修の動機・背景 (A) | concept メッセージング転換と LP 文言を同期 | auto-recommended |
| D20260528-006 | 後方互換性方針 (B) | 互換維持 (公開前 + 文言ベース、ルート/URL/データ変更なし) | auto-recommended |
| D20260528-007 | リリース戦略 (C) | 一括 (フィーチャーフラグ不要、影響範囲は LP テキストのみ) | auto-recommended |
| D20260528-008 | 既存テストの扱い (D) | 全維持 + トーンキーワード存在テストを追加 (U-2 拡張 + U-T1 新設) | auto-recommended |
| D20260528-009 | ロールバック方針 (E) | git revert で十分 (DB/フラグ不要) | auto-recommended |
| D20260528-010 | 機能性質タグ | feature (UI) 維持 + i18n 非該当 (純日本語 LP) | auto-recommended |
| D20260528-011 | マイグレーション要否 | 不要 (DB/設定/ストレージ変更なし — Phase 5 skip) | auto-recommended |

## 依存関係

- 親セッション (本日先行): `D20260528_001_concept_update_messaging.md` (decision D20260528-001, -002)
- 元 feature: `D20260527_013_feature_landing.md` (decision D20260527-037)
- 元 secure: `D20260527_022_secure_product.md` (PII/IDOR/XSS は不変、影響なし)
- 元 design: `D20260527_005_design_system.md` (ボイス&コピー O38 + 入口理解 O41 を踏襲)
- SoT: charter §2.2 (煽り NG) / perspectives O31 / O38 / O41

## 生成・更新したアーティファクト

- 新規: `docs/landing/revise_messaging-shift_20260528_tone-shift-together-thinking/` フォルダ
  - `README.md`
  - `INDEX.md`
  - `001_REVISE_SPEC.md`
  - `002_REVISE_PLAN.md`
  - `003_REVISE_UNIT_TEST.md`
  - `004_REVISE_E2E_TEST.md`
- 更新: `docs/landing/INDEX.md` (サブフォルダ表に revise 追加)
- 更新: `docs/INDEX.md` (landing 改修件数 0 → 1)
- 更新: `docs/DOC_MAP.md` (§9 改修件数 + 最新コマンド)
- 更新: `docs/AI_LOG/INDEX.md` (本セッション追加)
- 新規: 本ファイル

## 学習・改善

- 親セッション (`/flow:concept`) 完了直後に `/flow:revise <feature>` を Skill dispatch する「2 段スコープ」パターンは、concept 側で「中央書類のみ」「LP SPEC 反映は別」と境界を明示しておくと revise 側が depends_on を一意に確定でき、書き出しが速い (今回 ~20 分で 4 文書)。本セッションで実践、`/flow:auto` の Wording/Design gate の前段 hook として活用余地あり。
- 改修要望が「文言/トーン変更」かつ既存実装が「コンポーネント分離済 + テキストプロップ化されていない (現状 LP は文言ハードコード前提)」の場合、Plan §1 既存ファイル変更一覧は「Hero/ConsultPitch/page metadata の文字列定数差し替え」に収束する。テスト改修も「キーワード存在検証」中心になりがちで、構造テスト (U-1/U-2/U-3) は全維持で OK。これは revise の頻出パターンなので将来テンプレ化候補。

---

## Decisions

```yaml
- id: D20260528-003
  timestamp: 2026-05-28T11:55:00+09:00
  command: /flow:revise
  phase: Step 1.2 / 改修要望取得
  question: 改修要望の取得経路
  options:
    - 親セッション (Skill 引数) 経由 — wants.md 起点で詳細指示済 (Recommended)
    - ユーザーへ 1問1答で再ヒアリング
  recommended: 親セッション経由
  chosen: 親セッション経由
  chosen_type: auto-recommended
  depends_on: [D20260528-001, D20260528-002]
  context: |
    本セッションは /flow:concept D20260528-002 の chosen「LP SPEC 反映は別セッション」
    の dispatch 先。Skill 引数に 4 項目の改修要望 + 非機能制約 + Read スコープ指示
    + design SoT 参照点まで網羅されているため、追加ヒアリング不要。

- id: D20260528-004
  timestamp: 2026-05-28T11:56:00+09:00
  command: /flow:revise
  phase: Step 2.2 / Read スコープ
  question: Read 範囲をどこまで広げるか
  options:
    - docs/landing/ 既存 6 文書 + design SoT §6/§7 + concept §1.1/§1 (Recommended、引数で指示済)
    - 上記 + src/features/landing/*.tsx (実装コード)
    - 上記 + src/_shared/ui/* (Header/Footer/CTA 共通)
  recommended: 既存 6 文書 + design SoT 該当節 + concept 該当節
  chosen: 既存 6 文書 + design SoT §6/§7 + concept §1.1/§1
  chosen_type: auto-recommended
  depends_on: [D20260528-003]
  context: |
    引数で「実装コード (src/) は今回 SPEC 改修のみなので必須ではない、文言再配置
    は後続 /flow:tdd」と明示。Plan §1 で参照すべきファイル名は LOC + 役割が
    002_landing_PLAN.md に既出のため、AI_LOG 遡及 + PLAN.md Read で十分。
    総ファイル数: 4 (002/003/004 + design SoT 該当節)、推定 < 5k tokens。

- id: D20260528-005
  timestamp: 2026-05-28T11:57:00+09:00
  command: /flow:revise
  phase: Step 3.1 / 改修固有 A 動機
  question: 改修の動機・背景
  options:
    - concept §1.1/§1 のメッセージング転換と LP 文言を同期 (Recommended)
    - LP 独自の UX 改善 (concept とは独立)
  recommended: concept 転換との同期
  chosen: concept 転換との同期
  chosen_type: auto-recommended
  depends_on: [D20260528-001, D20260527-037]
  context: |
    wants.md 2026-05-28 追記 → /flow:concept で中央書類更新済 → LP SPEC が古い
    まま放置されると docs/landing/001_landing_SPEC.md §1 UC#3 出力欄が concept
    §1.1 UC#3 と矛盾する (audit 検出対象)。本改修はその drift 解消が主目的。

- id: D20260528-006
  timestamp: 2026-05-28T11:58:00+09:00
  command: /flow:revise
  phase: Step 3.1 / 改修固有 B 後方互換性
  question: 後方互換性方針
  options:
    - 互換維持 (Recommended)
    - 段階的非互換
    - 一括非互換
  recommended: 互換維持
  chosen: 互換維持
  chosen_type: auto-recommended
  depends_on: [D20260528-005]
  context: |
    変更対象は LP 内の文言のみ (Hero リード文 / ConsultPitch コピー / metadata
    description / OGP description)。ルート (/) / URL / API / DB スキーマ / 公開
    contract には一切影響しない。公開前のため既存ユーザーへの影響もゼロ。

- id: D20260528-007
  timestamp: 2026-05-28T11:59:00+09:00
  command: /flow:revise
  phase: Step 3.1 / 改修固有 C リリース戦略
  question: リリース戦略
  options:
    - 一括 (Recommended)
    - 段階的
    - フィーチャーフラグ
  recommended: 一括
  chosen: 一括
  chosen_type: auto-recommended
  depends_on: [D20260528-006]
  context: |
    影響範囲が LP テキストのみ。段階展開やフラグ ON/OFF 切替の運用コストに見合う
    リスクなし (誤訳・誤表現リスクは校正で吸収、リリース戦略の問題ではない)。
    本 PJ は公開前 + 個人運用のため一括が自然。

- id: D20260528-008
  timestamp: 2026-05-28T12:00:00+09:00
  command: /flow:revise
  phase: Step 3.1 / 改修固有 D 既存テストの扱い
  question: 既存テストの扱い
  options:
    - 全維持 + トーンキーワード存在テストを追加 (Recommended)
    - 一部修正 (CTA 文言依存テストがあれば再ライト)
    - 一部削除
  recommended: 全維持 + 新規追加
  chosen: 全維持 + 新規追加
  chosen_type: auto-recommended
  depends_on: [D20260528-007]
  context: |
    003_landing_UNIT_TEST.md を Read した結果、既存 U-1/U-2/U-3 は文言文字列を
    アサーションしておらず構造 (href / role / element 存在) ベース。U-2 の
    「コンサル文言」というアサーション語彙は緩く、Hero/ConsultPitch のコピー
    再ライトでも壊れない。よって既存全維持。新規で「『共に考える』『正解の分か
    らない世界で』というスタンスキーワードがレンダリングされている」という
    意味的アサーション U-T1 (Tone) を追加し、メッセージング転換の機能化を担保。

- id: D20260528-009
  timestamp: 2026-05-28T12:01:00+09:00
  command: /flow:revise
  phase: Step 3.1 / 改修固有 E ロールバック方針
  question: ロールバック方針
  options:
    - git revert (Recommended)
    - フィーチャーフラグ OFF
    - DB rollback
  recommended: git revert
  chosen: git revert
  chosen_type: auto-recommended
  depends_on: [D20260528-007]
  context: |
    一括 + 文言のみ + フラグ不要 = git revert で完結。DB/設定変更なしのため
    rollback 副作用ゼロ。実運用ではコミット粒度 1 で行うため revert 1 回で OK。

- id: D20260528-010
  timestamp: 2026-05-28T12:02:00+09:00
  command: /flow:revise
  phase: Step 3.2 / タグ判定
  question: 機能性質タグ
  options:
    - feature (UI) 維持 (Recommended)
    - feature + i18n 追加
  recommended: feature 維持
  chosen: feature 維持
  chosen_type: auto-recommended
  depends_on: [D20260527-037]
  context: |
    本 PJ は純日本語 LP (CLAUDE.md i18n catalog 言及なし)。多言語化は §1.2
    スコープ外で明示除外。文言改修だが言語数は 1 のため i18n タグ不要。
    元 feature タグ「feature」を維持。

- id: D20260528-011
  timestamp: 2026-05-28T12:03:00+09:00
  command: /flow:revise
  phase: Step 4.1 / マイグレーション要否
  question: Phase 5 REVISE_MIGRATION 生成要否
  options:
    - 不要 (Recommended) — Phase 5 skip
    - 必要 — 005_REVISE_MIGRATION.md 生成
  recommended: 不要
  chosen: 不要
  chosen_type: auto-recommended
  depends_on: [D20260528-006]
  context: |
    Plan §1 既存ファイル変更は app/(public)/page.tsx + features/landing/Hero.tsx
    + features/landing/ConsultPitch.tsx の文字列定数差し替えのみ。DB/Storage/
    Config いずれも非該当。引数でも「マイグレーション: 不要」と明示済。
```
