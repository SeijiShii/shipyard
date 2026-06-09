# AI_LOG セッション: /flow:revise legal tokushoho-stripe

- **実行日時**: 2026-06-10 (Asia/Tokyo)
- **コマンド**: /flow:revise
- **対象機能 + issue**: legal / tokushoho-stripe
- **実行者**: seiji
- **状態**: 設計完了（4 文書生成、実装待ち）

## 含まれる decision 範囲
改修要望取得 / Read スコープ確定 / 改修固有 5 項目 (動機・後方互換・リリース・テスト扱い・ロールバック) / タグ判定 / マイグレ要否 / 特商法 対象・課金形態の Class C 判断。

## 主要決定サマリ
| decision_id | テーマ | chosen | type |
|---|---|---|---|
| D20260610-001 | 改修要望の確定 | 特商法ページ追加 (Stripe審査) + 業態を寄付→マイクロサービス運営に整合 + givers.work apex を shipyard へ + footer "powered by givers.work" | explicit-choice |
| D20260610-002 | 特商法の対象 (Class C) | 公開済みサービスへの作者応援寄付(主) + 追加オプション販売(従)、事業者(QUADii)直接受領。プラットフォーム型でない | explicit-choice |
| D20260610-003 | 課金形態 (Class C) | 単発のみ（継続課金セクション削除） | explicit-choice |
| D20260610-004 | Read スコープ | legal feature + Footer + concept §1.2/§9/§4.7 + 旧GIVErS特商法 | auto-recommended |
| D20260610-005〜009 | 改修固有5項目 | 動機=Stripe審査+業態整合 / 互換維持 / 一括 / 既存テスト全維持+追加 / コードrevert | auto-recommended |
| D20260610-010 | タグ | feature (静的SSG) | auto-recommended |
| D20260610-011 | マイグレ要否 | 不要 (DB変更なし) | auto-recommended |

## 依存関係
- 親機能 SPEC: `docs/legal/001_legal_SPEC.md` 初版 (2026-05-27, /flow:feature)
- concept §1.2 スコープ / §9 法務 (特商法 不要 と記載) / §4.7 ドメイン — 本改修で反転・更新対象
- 関連: giving_platform repo `backend/legal/ja/commerce-law.md` (旧 GIVErS 特商法、事業者情報の流用元)

## 生成・更新したアーティファクト
- 新規: `docs/legal/revise_tokushoho-stripe_20260610/` {README, INDEX, 001_REVISE_SPEC, 002_REVISE_PLAN, 003_REVISE_UNIT_TEST, 004_REVISE_E2E_TEST}
- 更新: `docs/legal/INDEX.md` (サブフォルダ行追加) / `docs/INDEX.md` (legal 改修件数 0→1)
- 未生成: 005_REVISE_MIGRATION (マイグレ不要のため)

## 学習・改善
- ユーザー回答が提示 3 択のいずれにも完全一致せず Other で実態を記述 → 「事業者単位の包括開示」推奨をベースに「作者応援寄付 + 追加オプション」へ精緻化。Class C で推奨が部分的にしか当たらないケースは、推奨を起点に回答で補正する運用が有効。
- 法定公開情報（屋号/住所/電話/メール）は SEC-001 (PII 秘匿) の対象外という整理を SPEC §7.5 + PLAN §8 に明記（code-review/audit の誤検出防止）。

## 依存関係
- 親機能 SPEC: `docs/legal/001_legal_SPEC.md` 初版 (2026-05-27, /flow:feature)
- concept §1.2 スコープ / §9 法務 (特商法 不要 と記載) / §4.7 ドメイン — 本改修で反転・更新対象
- 関連: giving_platform repo `backend/legal/ja/commerce-law.md` (旧 GIVErS 特商法、事業者情報の流用元)

## 生成・更新したアーティファクト
（進行中。Phase 1-4 で順次追記）

## 学習・改善
（完了時に記載）

---

## Decisions

```yaml
- id: D20260610-001
  timestamp: 2026-06-10T00:00:00+09:00
  command: /flow:revise
  phase: Step 1.2 改修要望取得
  question: 改修要望の確定
  options:
    - 引数末尾の長文要望をそのまま採用
  recommended: 引数要望をサマリ化して採用
  chosen: |
    (1) Stripe審査提示用に特定商取引法に基づく表記ページを shipyard に追加する。
    (2) shipyard を seiji の個人事業 (マイクロサービス運営) の公式ホームページと位置づけ、
        旧 givers (寄付募集プラットフォーム) の業態から、マイクロサービス運営主体の業態へ整合させる。
    (3) 旧 GIVErS では Stripe はプラットフォーム型アカウントだったが、マイクロサービス運営では
        一般的な決済用アカウントとなるため特商法の細部 (運営手数料/プロジェクトオーナー/返金フロー等) が異なる。
    (4) 特商法ページ完成後、givers.work apex ドメインを shipyard に向ける (現状 shipyard は shipyard.givers.work)。
    (5) shipyard のページに "powered by givers.work" の文言を入れる。
  chosen_type: explicit-choice
  depends_on: []
  context: |
    引数末尾に長文要望あり。giving_platform repo の特商法 (QUADii / 四伊清司 / quadii.shii@gmail.com) を
    事業者情報の流用元として確認。shipyard は本番稼働中 (shipyard.givers.work, SCENARIO Phase 5)。
    concept §1.2/§9 は「本サイトでの課金なし → 特商法 不要」と明記しており、本改修はこの文書化済み判断を反転する。

- id: D20260610-002
  timestamp: 2026-06-10T00:05:00+09:00
  command: /flow:revise
  phase: Step 3.1 Class C — 特商法の対象 (有償提供の実体)
  question: shipyard 特商法が記載する有償提供の実体は何か (concept §1.2/§9 の「課金なし」反転を伴う)
  options:
    - 事業者単位の包括開示 (各サービス利用料、価格は各サービス参照) [推奨提示]
    - shipyard 自体が販売者 (課金機能を新設)
    - 特定サービス1つに限定
  recommended: 事業者単位の包括開示
  chosen: |
    ユーザー回答 (Other = 実態に即した独自記述):
    「各種マイクロサービスを展開し、公開済みのサービスについて作者応援寄付を募ることを主な業態として
     運営している (未公開サービス等へのクラウドファンディングではない)。サービスによっては、より快適に
     利用していただくための追加オプションを販売している。」
    → 特商法の対象 = (主) 公開済みマイクロサービスへの「作者応援寄付」 + (従)「追加オプション」販売。
       事業者 = QUADii (四伊清司) が直接の受領者/販売者。プラットフォーム型ではない (旧 GIVErS と決定的に異なる)。
  chosen_type: explicit-choice
  depends_on: [D20260610-001]
  context: |
    旧 GIVErS との差分: 旧 = 寄付者↔第三者プロジェクトオーナーを仲介する寄付プラットフォーム
    (Stripe = プラットフォームアカウント、運営手数料、プロジェクトオーナーのリターン/特商法義務)。
    新 = QUADii 自身が公開済み自作サービスへの応援寄付を直接受領 + 追加オプションを直接販売
    (Stripe = 一般的な決済 (マーチャント) アカウント、運営手数料なし、第三者オーナーなし)。

- id: D20260610-003
  timestamp: 2026-06-10T00:06:00+09:00
  command: /flow:revise
  phase: Step 3.1 Class C — 課金形態 (定期課金の有無)
  question: 記載する有償提供に定期課金 (サブスク) を含めるか
  options: [単発のみ [推奨/現状], 定期課金あり, 未定・両方想定]
  recommended: 単発のみ
  chosen: 単発のみ。継続課金 (定期寄付/サブスク) セクションは特商法に含めない。
  chosen_type: explicit-choice
  depends_on: [D20260610-002]
  context: |
    旧 GIVErS 特商法には「定期寄付 (継続課金)」セクションがあったが、新業態では削除。
    作者応援寄付・追加オプションともに単発 (都度決済) のみ。将来サブスク追加時に特商法を追記する運用。

- id: D20260610-004
  timestamp: 2026-06-10T00:07:00+09:00
  command: /flow:revise
  phase: Step 2.2 Read スコープ確定
  question: 改修分析の Read スコープ
  options: [推奨範囲 (legal feature + footer + concept §1.2/§9/§4.7 + giving_platform 特商法), 絞る, 広げる]
  recommended: 推奨範囲
  chosen: |
    legal feature 全文書 + 実装 (PrivacyContent/TermsContent/legal.test.tsx/app/legal/*) +
    components/layout/Footer.tsx + concept §1.2/§9/§4.7 + giving_platform backend/legal/ja/commerce-law.md (流用元)。
    CLAUDE.md「読み取り操作は自動 OK」に従い確認なしで実施 (スコープは legal 機能 + footer + concept 該当節に限定)。
  chosen_type: auto-recommended
  depends_on: [D20260610-001]
  context: 静的ページ改修のためスコープ小。DB/API なし。

- id: D20260610-005
  timestamp: 2026-06-10T00:08:00+09:00
  command: /flow:revise
  phase: Step 3.1 改修固有 — A 動機
  question: 改修の動機・背景
  options: []
  recommended: Stripe 事業者審査の必須要件 + 公式 HP としての業態整合
  chosen: |
    (1) QUADii の Stripe 決済アカウント審査に提示する特商法ページが必要。
    (2) shipyard を個人事業 (マイクロサービス運営 + 作者応援寄付 + 追加オプション販売) の公式 HP と位置づけ、
        旧 givers (寄付プラットフォーム) 業態から実態へ整合させる。
  chosen_type: auto-recommended
  depends_on: [D20260610-002]
  context: 引数要望 (1)(2)(3) から自動構成。

- id: D20260610-006
  timestamp: 2026-06-10T00:09:00+09:00
  command: /flow:revise
  phase: Step 3.1 改修固有 — B 後方互換性
  question: 後方互換性方針
  options: [互換維持, 段階的非互換, 一括非互換]
  recommended: 互換維持
  chosen: |
    互換維持。新規ページ (/legal/commerce or /legal/tokushoho) 追加 + Footer リンク1行追加 +
    concept §1.2/§9 の「特商法 不要」記述を「必要・作成」に更新。既存 privacy/terms ページ・既存 URL は不変。
    破壊的変更なし → MIGRATION 不要。
  chosen_type: auto-recommended
  depends_on: [D20260610-002]
  context: 静的ページ追加 + ドキュメント記述更新のみ。DB・API・既存ルート変更なし。

- id: D20260610-007
  timestamp: 2026-06-10T00:10:00+09:00
  command: /flow:revise
  phase: Step 3.1 改修固有 — C リリース戦略
  question: リリース戦略
  options: [一括, 段階的, フィーチャーフラグ]
  recommended: 一括
  chosen: |
    一括リリース (新規静的ページ、フラグ不要)。ただし「givers.work apex → shipyard」の DNS 切替は
    特商法ページ本番反映後の別ステップ (ユーザー手動、Class B)。"powered by givers.work" footer は同梱。
  chosen_type: auto-recommended
  depends_on: [D20260610-006]
  context: 静的ページは即時公開で問題なし。ドメイン切替は要望(4)で特商法完成後と順序指定あり。

- id: D20260610-008
  timestamp: 2026-06-10T00:11:00+09:00
  command: /flow:revise
  phase: Step 3.1 改修固有 — D 既存テストの扱い
  question: 既存テストの扱い
  options: [全維持, 一部修正, 一部削除]
  recommended: 全維持 + 追加
  chosen: |
    既存 legal.test.tsx (privacy/terms) は全維持。特商法ページのレンダリング + Footer "powered by givers.work" +
    Footer 特商法リンクのテストを追加。削除なし。
  chosen_type: auto-recommended
  depends_on: [D20260610-006]
  context: 新規ページ追加のため既存挙動の破壊なし。

- id: D20260610-009
  timestamp: 2026-06-10T00:12:00+09:00
  command: /flow:revise
  phase: Step 3.1 改修固有 — E ロールバック方針
  question: ロールバック方針
  options: [コード revert, フラグ OFF, DB rollback]
  recommended: コード revert
  chosen: コード revert で完全に戻る (静的ページ + Footer 変更 + concept 記述のみ、DB 変更なし)。DNS 切替は別途 DNS で戻す。
  chosen_type: auto-recommended
  depends_on: [D20260610-007]
  context: 永続データ変更なし。

- id: D20260610-010
  timestamp: 2026-06-10T00:13:00+09:00
  command: /flow:revise
  phase: Step 3.2 機能性質タグ判定
  question: 機能性質タグ
  options: [feature (静的 UI)]
  recommended: feature
  chosen: feature (静的 SSG ページ)。auth 不要・状態なし・i18n は現状 JA 単一 (既存 legal 同様)。
  chosen_type: auto-recommended
  depends_on: [D20260610-001]
  context: 既存 legal SPEC のタグ (feature) を継承。

- id: D20260610-011
  timestamp: 2026-06-10T00:14:00+09:00
  command: /flow:revise
  phase: Step 4.1 マイグレーション要否
  question: マイグレーション (DB/データ/設定) 要否
  options: [要, 不要]
  recommended: 不要
  chosen: 不要。DB スキーマ・データ・ストレージ変更なし。Phase 5 MIGRATION は生成しない。
  chosen_type: auto-recommended
  depends_on: [D20260610-006]
  context: 静的ページ + Footer + concept 記述更新のみ。
```
