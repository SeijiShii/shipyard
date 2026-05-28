# 改修: メッセージング転換 (lead-gen 主軸 → 「共に考える相談相手」スタンス)

- **issue / slug**: `messaging-shift` / `tone-shift-together-thinking`
- **実施日**: 2026-05-28
- **対象機能**: [../README.md](../README.md)
- **基準 SPEC**: [../001_landing_SPEC.md](../001_landing_SPEC.md)
- **改修要望** (出典: `docs/wants.md` 2026-05-28 追記、`docs/concept.md` D20260528-001 で中央書類反映済):
  1. UC-L1「トップで何のサイトか理解する」: メイカー (seiji) のスタンス —「週1ペースで AI 駆動開発を回しているが、それが絶対の正解とは思わない。AI 活用の正解の見えない世界で『共に考え・共に悩む』相談相手として手伝いたい」— を入口で読み取れる構成にする (O41)。
  2. UC-L2「コンサルに興味を持ち問い合わせへ進む」: CTA の文脈を「コンサル契約獲得」型から「これからを共に考えたい相談者との出会い」型に転換。煽らない控えめトーン維持 (charter §2.2 / O31 / design SoT §6)。
  3. §5 機能固有 NFR の「トーン」項目に「共に考える / 共に悩むスタンスを偽らない (『絶対の正解』を売らない、AI 駆動を成功テンプレートとして押し付けない)」を明示。
  4. §1 詳細 UC の出力欄: UC-L1 出力に「メイカーのスタンス (共に考える) が伝わる」を追加、UC-L2 出力の「煽らない控えめ CTA」維持。
- **状態**: 設計完了 → 実装待ち (`/flow:tdd` で 101/102 生成、文言詳細は `/flow:wording` で仕上げ)

## このフォルダに置くドキュメント

- `001_REVISE_SPEC.md` — 変更仕様書 (UC-L1/L2 before/after + §5 NFR トーン追記)
- `002_REVISE_PLAN.md` — 変更計画書 (Hero/ConsultPitch/metadata の文字列定数差し替え)
- `003_REVISE_UNIT_TEST.md` — 単体テスト計画 (既存全維持 + U-T1 トーンキーワード新設)
- `004_REVISE_E2E_TEST.md` — E2E テスト計画 (L1-S2 入口理解再撮 + リグレッション)
- (Phase 5 MIGRATION: 不要 — 文言ベース、DB/Storage/Config 変更なし)
- `101_REVISE_IMPL_REPORT.md` — 実装レポート (`/flow:tdd` で生成、未生成)
- `102_REVISE_UNIT_TEST_REPORT.md` — 単体テストレポート (同上)
- `103_REVISE_E2E_REPORT.md` — E2E 実行レポート (`/flow:e2e` で生成、未生成)

## 関連

- 過去の改修: なし (本改修が初回)
- 中央書類: [../../concept.md](../../concept.md) §冒頭表 / §1 / §1.1 UC#3 (D20260528-001 で更新済)
- AI_LOG: [../../AI_LOG/D20260528_002_revise_landing_messaging-shift.md](../../AI_LOG/D20260528_002_revise_landing_messaging-shift.md)
- 高度モデルレビュー: `/dev-review` 推奨 (改修は特に推奨度高い)
- 文言詳細仕上げ: `/flow:wording` (O42、JA トーン校正 + EN 整合) を実装後に推奨
