<!-- auto-generated-start -->
# 設計レビューレポート — shipyard 全 12 ターゲット（プロダクト全体・実装前）

**レビュー日**: 2026-05-27
**レビュー実施者**: Claude (Opus 4.7)
**対象**: 横断 7（db/ui/seo/email/auth/hub-client/spam）+ 機能 5（landing/service-status/inquiry/admin/legal）
**入力**: 各 001-004 + concept.md（§1.3/§3.7/§5）
**観点ソース**: 組み込みチェックリスト + ~/.claude/review-perspectives.md（存在時）
**モード**: auto-pick
**severity-threshold**: low
**注**: 現状グリーンフィールド（実装コードゼロ）のため、Step 1 の「既存コード調査」は対象なし。本レビューは **12 設計間の整合性**（依存契約 / SEC スレッディング / 責務境界 / 実装シーケンス）に焦点。

## 1. レビューサマリー
| 観点 | 評価 | 備考 |
|---|---|---|
| 仕様の明確性 | OK | 各 SPEC に UC/IF・入出力・データ・エラー・NFR が揃う |
| 依存契約の整合 | 要確認 | R1（token 生成責務の重複） |
| SEC スレッディング | OK | SEC-001/002/003 が inquiry/admin/db/spam/email に一貫反映 |
| 実装シーケンス | 要確認 | R2（project scaffold がどの target にも未帰属） |
| データ移行・cleanup | 要確認 | R3（rate_limits 古い窓の cleanup 未定） |
| 責務境界 | OK | visitor=token / admin=id 経由が db/inquiry/admin で一貫 |
| 外部契約 | OK（保留） | HUB contract は [論点-001] で mock 進行（既記載） |
| テストカバレッジ | OK | 各 003/004 が正常/異常/境界 + SEC（IDOR/XSS/PII/認可）を網羅 |

## 2. 指摘事項（severity 降順）

### [R1] thread token 生成の責務重複 (severity=High)
- **対象**: `_shared/db/001 §5.2`（threadRepo.create→{token}）/ `_shared/spam/001 §1`（generateThreadToken）
- **問題**: token 生成を db と spam の両方が主張。生成箇所が二重定義だと衝突リトライ・128-bit 保証の所在が曖昧。
- **推奨**: **token 生成ロジックは `_shared/spam.generateThreadToken`（crypto）に一本化**し、`threadRepo.create` がそれを内部で呼ぶ（衝突時は repo がリトライしつつ再生成を spam に依頼）。SEC-002 の 128-bit 保証は spam が担保、UNIQUE 制約は db が担保（二重防御）。
- **種別**: 指摘事項（自動反映）
- **chosen**: 推奨どおり。spam=生成、db=UNIQUE 制約 + リトライ呼び出し。
- **反映先**: db SPEC §5.2 / spam SPEC §1 に spec-review コメント付与。

### [R2] project scaffold / bootstrap の責務未帰属 (severity=High)
- **対象**: 全 PLAN の Phase 3.5（app/api bootstrap）/ SCENARIO Phase 3
- **問題**: Next.js/Drizzle/Clerk 初期化・`package.json`・`tsconfig`・`tailwind.config`・`middleware.ts` 配置・`scripts/dev.sh`/`stop.sh`（O36）・CI yaml（O37）・`.env.example` は、特定 feature/横断に属さない横断的初期化。現状どの target の PLAN にも「最初に scaffold」が明示されていない。
- **推奨**: **tdd 連続実装の最初に「Phase 0: project scaffold」を置く**（_shared/db 着手前）。内容 = Next.js(App Router)+TS+Tailwind 初期化 / Drizzle 設定 / shadcn 初期化 / `.env.example`（PREREQUISITES のキー） / `scripts/dev.sh`+`stop.sh`（O36）/ `.github/workflows/ci.yml`+`dependabot.yml`（O37）/ `middleware.ts` 雛形。これは Class A（git tracked）。
- **種別**: 指摘事項（自動反映）
- **chosen**: 推奨どおり。SCENARIO Phase 3 に「Phase 0 scaffold を先頭」を明記。
- **反映先**: SCENARIO §3 Phase 3 + 本レポート §5。

### [R3] rate_limits 古い窓の cleanup 方針未定 (severity=Medium)
- **対象**: `_shared/db/001 §2.4` rate_limits / `_shared/spam/001 §2`
- **問題**: 固定窓カウンタの古い行が無限蓄積しうる。
- **推奨**: **窓計算で古い窓は無視（読み取り時に window_start で判定）+ 定期 cleanup を service-status の cron に相乗り**（or 別 cron）で N 日より古い行を削除。Neon 無料枠のストレージ保護。
- **種別**: 指摘事項（自動反映）
- **chosen**: 推奨どおり。spam SPEC §2 に cleanup 方針コメント。
- **反映先**: spam SPEC §2。

### [R4] HUB contract 未確定 (severity=Info)
- **対象**: hub-client / service-status / concept §8 [論点-001]
- **問題**: HUB 側 API 未実装。
- **推奨**: 既記載どおり mock contract で進行、HUB 確定後に契約整合を再確認。新規対応不要（[論点-001] で追跡済）。
- **chosen**: 現状維持（mock 進行）。

## 3. コードベース調査結果
### 3.1 既存パターン
グリーンフィールド（実装コードゼロ）。既存パターン調査は N/A。設計間の規約整合のみ確認。
### 3.2 影響範囲分析
実装未着手のため既存呼び出し元なし。R1/R2 は将来の実装シーケンスに影響。
### 3.3 責務境界の評価
visitor=token / admin=id（認証済）の分離が db/inquiry/admin で一貫（SEC-002 OK）。token 生成責務のみ R1 で一本化。

## 4. 設計判断ログ
| # | 判断項目 | 結論 | chosen_type | 反映先 |
|---|---|---|---|---|
| D1 (R1) | token 生成責務 | spam 生成 + db UNIQUE/リトライ | auto-recommended | db/spam SPEC |
| D2 (R2) | scaffold 帰属 | tdd Phase 0 scaffold | auto-recommended | SCENARIO §3 |
| D3 (R3) | rate_limit cleanup | 窓計算無視 + cron cleanup | auto-recommended | spam SPEC §2 |
| D4 (R4) | HUB contract | mock 進行（[論点-001]） | auto-recommended | — |

## 5. 次のステップ
- 反映済み設計を確認
- **tdd は Phase 0 project scaffold から着手**（R2）→ concept §1.3.4 優先度順（_shared/db → ui → seo → email → auth → hub-client → spam → landing → service-status → inquiry → legal → admin）
- 画面実装後に `/flow:design --review-only`（視覚レビュー）/ `/flow:wording`（文言）/ `/flow:e2e`（E2E）/ `/flow:release`（実キー + デプロイ、Class B）
<!-- auto-generated-end -->
