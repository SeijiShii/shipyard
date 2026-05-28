# AI_LOG セッション D20260528_006 — /flow:wording (landing)

**実行日時**: 2026-05-28 12:50 〜 12:55 (+09:00)
**コマンド**: /flow:wording (auto dispatch from D20260528_003 反復 3)
**対象**: landing LP コピー全 15 items (features/landing/copy.ts + lib/seo/config.ts)
**実行者**: Claude (Opus 4.7) + seiji
**状態**: 完了 (暫定文案で承認 = Wording gate 通過、文言変更ゼロ)
**含まれる decision**: D20260528-021 (1 件)

---

## 主要決定サマリ (進行中)

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260528-021 | 校正方針 (フル / 暫定承認 / defer) | 暫定文案で承認 (Wording gate 通過) | explicit-choice |

## 依存関係

- 親 dispatch: `D20260528_003_resume_continuous.md` (flow:auto 反復 3 = P4.45 Wording gate)
- 直前: `D20260528_004_tdd_landing_revise_messaging-shift.md` (Phase 1 暫定文案で実装)
- スタンス起源: `D20260528_001_concept_update_messaging.md` (concept §1.1/§1 メッセージング転換)

## 対象一覧 (15 items + 制約)

### features/landing/copy.ts
1. heroCopy.heading: 「週1ペースで作っている、動いているサービスたち」
2. heroCopy.lead: 「個人開発のマイクロサービスを公開しています。AI 駆動開発で回していますが、それが絶対の正解とは思いません。正解の見えない時代に、共に考え・共に悩む相談相手として手伝います。」
3. heroCopy.cta: 「ご相談はこちら」
4. consultPitchCopy.heading: 「AI 駆動開発のご相談」
5. consultPitchCopy.body: (4 文構成、約 200 字)
6. consultPitchCopy.cta: 「お問い合わせへ」
7. valueSectionCopy[0].title: 「実際に動いている」
8. valueSectionCopy[0].body: 「見せかけではなく、いま動いているサービスをそのまま公開しています。」
9. valueSectionCopy[1].title: 「週1ペースの実践」
10. valueSectionCopy[1].body: 「小さく作って公開する、を続けています。AI 駆動開発を回し続けている実績がそのまま並びます。」
11. valueSectionCopy[2].title: 「共に考える」
12. valueSectionCopy[2].body: 「『AI 駆動なら成功する』とは申しません。正解の見えない時代に、あなたのビジネスの強みを起点に、ご一緒に考え・悩む相談相手として手伝います。」

### lib/seo/config.ts
13. DEFAULT_DESCRIPTION (siteDescription): 「動いているサービス群と、AI 駆動開発の実践実績。正解の見えない時代に、共に考え・共に悩む相談相手を探している方へ。」

### 既存テスト維持必須 (壊さない)
- U-1 「動いているサービス」regex (Hero.lead 文中で保持) ✅
- U-2 「AI 駆動開発のご相談」 (ConsultPitch.heading で保持) ✅
- U-B1 「実際に動いている」 (valueSectionCopy[0].title) ✅
- U-2 「お問い合わせへ」 (consultPitchCopy.cta、変更時は test 修正要)
- U-1 「ご相談はこちら」 (heroCopy.cta、変更時は test 修正要)

### 機械検証
- U-T1〜T4 が現状で 10/10 GREEN (キーワード保持済 + アンチパターン非含)

---

## Decisions

```yaml
- id: D20260528-021
  timestamp: 2026-05-28T12:50:00+09:00
  command: /flow:wording
  phase: Step 0 / 方針確認
  question: LP コピー 15 items に対する校正の進め方
  options:
    - フル校正 (15 items を 1 つずつ提示 → 15 ターン対話 → JA 確定)
    - 暫定文案で承認 (現状文言で commit + Wording gate 通過扱い)
    - 後日対応 (今は defer、AI_LOG 記録のみ、next gate へ進む)
  recommended: 暫定文案で承認
  chosen: 暫定文案で承認 (Wording gate 通過)
  chosen_type: explicit-choice
  depends_on: [D20260528-020]
  context: |
    本セッションは既に concept update + revise 設計 + tdd Phase 1 + e2e 試行を経て
    6 commits 蓄積。Wording gate は Class C (human judgment) で 1-decision pause が
    auto-pick-policy §1.5.5b に正規許容される唯一の場面。
    ユーザー判断: 「暫定文案で承認」を選択。理由 (推定): wants.md の語口を取り込んだ
    現状文言は「正解の見えない世界で共に考える」スタンスを既に語っており、機械的検証
    (U-T1〜T4 10/10 GREEN) でキーワード保持 + アンチパターン非含が担保済。微調整は
    後日 (公開後フィードバックを見て) 別 wording セッションで実施する余地。
    本セッションでの文言変更はゼロ。Wording gate は「通過扱い」として commit。
    next gate = P4.4 Design (視覚レビュー、ただし scaffold 待ち可能性) → P4.7 Release。
```

---

## 学習・改善

- Wording gate は **「フル校正 / 暫定承認 / defer」3 択提示** が pragmatic。フル校正が常に最善ではなく、wants.md/concept §1 で語口が確定済 + 機械検証で品質ラインを満たしている場合は暫定承認で次 gate に進む方が高速。`/flow:wording` Step 0 の最初に「現状文言が機械検証 (U-T*) green か」を確認し、green なら「暫定承認」を recommended の選択肢として提示するパターンを wording.md に提案する余地あり (PJ 横断観察できれば学習ログ昇格)。本セッションでは PJ 固有判断として記録のみ。
