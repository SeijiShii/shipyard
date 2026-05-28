# AI_LOG セッション D20260528_025 — /flow:release Phase 1 中の [論点-008] 確定 + O48 retrofit 全 revert

**実行日時**: 2026-05-28 21:00 〜 21:10 (+09:00)
**コマンド**: /flow:release Phase 1 中の inline fix (audit→revise→tdd 誤判定からの revert)
**実行者**: Claude (Opus 4.7) + seiji
**状態**: 完了
**含まれる decision**: D20260528-053 (1 件、[論点-008] resolve + 全 revert + concept/PREREQUISITES/code/env/docs 整合)

---

## 主要決定サマリ

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260528-053 | shipyard 自身を service-hub registry に登録するか + O48 retrofit revert | 登録しない (pull 対象外、O48 skip_if 該当)、全 revert (コード + env + docs)、170/170 GREEN、設計文書 4 は learning 履歴として残置 | explicit-choice (Class C 1問1答 = ユーザー認識確認) |

## 依存関係

- 親 chain: D20260528_020 (audit 誤検出 High 1) → D20260528_021 (revise 設計) → D20260528_022 (tdd 実装 174→176 GREEN) → D20260528_023 (audit 誤解消 High 0) → D20260528_024 (scenario update) → D20260528_007 release Phase 1 中の `HUB_SHARED_SECRET=` line 35 確認 → **ユーザー認識「shipyard は ServiceHUB の pull 対象ではない」→ revert**
- 直接依存: D20260528-049 (revise 設計、誤判定起点) / D20260528-050 (tdd 完遂、誤実装)

## 削除したアーティファクト (Class A、git tracked 可逆)

### 実装コード (3 ファイル + 空ディレクトリ)
- `lib/hub/service-info.ts` (ServiceInfo interface + serviceInfoPayload + isAuthorizedHub)
- `lib/hub/service-info.test.ts` (6 tests: v2 schemaVersion / version optional / iconUrl set/unset / isAuthorizedHub 一致/不一致)
- `app/api/hub/service-info/route.ts` (GET handler)
- `app/api/hub/service-info/` ディレクトリ (空になったため rmdir)

### env テンプレ (3 ファイル、`HUB_SERVICE_INFO_SECRET=` 行削除)
- `.env.example`
- `.env.development.example`
- `.env.production.example`

### docs 整合 (2 ファイル、row 削除)
- `docs/concept.md` §6 line 438 service-info row 削除
- `docs/PREREQUISITES.md` §1 HUB_SERVICE_INFO_SECRET row 削除

### docs 注記追加 (整合性)
- `docs/concept.md` §1.2 「含まないもの」に `/api/hub/service-info` 明示除外 + [論点-008] 参照 追加
- `docs/concept.md` §8 [論点-008] 新規追加 (resolved、誤検出から revert までの全 status 履歴 + learning + 関連リンク網羅)
- `docs/_shared/hub-client/revise_service-info-v2-contract_20260528/README.md` 状態 「revert」 + 不変履歴説明
- `docs/_shared/hub-client/revise_service-info-v2-contract_20260528/INDEX.md` 同上
- `docs/_shared/hub-client/INDEX.md` サブフォルダ表 「revert」 + 経緯
- `docs/INDEX.md` hub-client 行 「revise#1 revert [論点-008]」

### 残置 (不変履歴、learning 用)
- `docs/_shared/hub-client/revise_service-info-v2-contract_20260528/` 全 6 ファイル (001-004 設計文書 + 101/102 reports + README/INDEX) 維持
- AI_LOG D20260528_020/021/022/023 維持 (audit→revise→tdd→audit の誤検出 → retrofit → 誤解消の完全な思考トレース)
- AUDIT_20260528_2000 (誤検出) + AUDIT_20260528_2030 (誤解消) 維持

### ユーザー手動 (agent permission denied、`.env*.local` への直接編集制限)
- `.env.production.local` line 35 `HUB_SHARED_SECRET=` 行を削除 (新名 `HUB_SERVICE_INFO_SECRET=` 行も追加していれば削除)
- `.env.development.local` の `HUB_SHARED_SECRET=` 行を削除 (旧 dev value、未使用化)

## テスト結果

- 削除前: 176/176 GREEN
- 削除後: **170/170 GREEN** (-6 = service-info test 6 件削除分のみ、他全機能影響なし)
- 影響: 0 (service-info は consumer code から呼ばれず孤立してた、削除しても他 code path に影響なし)

## learning (flow-suite 補強 candidate CF-20260528-022)

### 根本原因
perspectives.md O48 の判定で `require: [マイクロサービス連発]` だけを拾い `skip_if: [単一サービス完結, service-hub 管理対象外, 内部運用対象外]` の評価を省略した = audit.md #4 require 観点判定で skip_if 未参照。

### 直接的損失
- audit (D020/D023) + revise (D021) + tdd (D022) + scenario (D024) = 4 セッション + 9 commits の overkill
- ただし learning value は大 = `required_signals` AND マッチが機能する事例 + skip_if 評価忘れの事例 (両方が次回以降の改善材料)

### 補強案 CF-20260528-022 (flow-suite ~/git/claude-flow-suite/commands/audit.md 候補)
- audit.md #4 観点反映で `require` + `skip_if` を**両方**参照することを明示 (現状は require のみ拾う実装パターンが残る)
- `skip_if` のキーワード (例: `service-hub 管理対象外`, `単一サービス完結`) を **concept のどこから判定するか SoT を明示**化 (本 PJ では §1.2「含まないもの」)
- PJ 性質判定の根拠 (concept のどの記述から require / skip_if を導出したか) を AUDIT レポートに必ず記録 (現状は require マッチのみ記録)
- ユーザーが期待する SoT 順序: ① concept §1.2 含まないもの → ② concept §1 主要 UC + 役割 → ③ §6 外部連携 + 方向性 (consumer vs producer)

### 本セッションの learning 残置形態
- concept §8 [論点-008] に「status 履歴」として誤検出 → retrofit → 誤解消 → revert の完全な timeline を残す (次回類似ケースで参照可)
- revise 設計 4 文書 + 101/102 reports は削除せず「retrofit の例 + revert の例」として保存
- ~/.claude/flow-data/command-feedback-inbox.md に CF-20260528-022 として追記候補 (本セッションでは追記せず flow-suite 反映は別セッション)

## release Phase 1 への影響

- HUB_SERVICE_INFO_SECRET は不要になった → release Phase 1 で 1 var 減 (13 → 12)
- 残作業: var #14 CRON_SECRET (Vercel Cron Bearer、`openssl rand -hex 32` で生成) → var #15 SENTRY_DSN (optional) → Phase 1 完了
- Phase 2 動作確認 + Phase 3 デプロイへ

---

## Decisions

```yaml
- id: D20260528-053
  timestamp: 2026-05-28T21:10:00+09:00
  command: /flow:release (Phase 1 inline fix)
  phase: [論点-008] 確定 + O48 retrofit 全 revert
  question: shipyard 自身を service-hub registry に登録するか (= O48 適用判定)
  options:
    - "(a) 登録しない (pull 対象外、O48 skip_if 該当) — Recommended"
    - "(b) 登録する (HUB showcase に shipyard も 1 サービスとして表示)"
  recommended: (a) — ユーザー認識「shipyard は ServiceHUB の pull 対象ではない」+ concept §1.1 + §6 が「shipyard = consumer (status 表示装置)」を示し、O48 skip_if: service-hub 管理対象外 に該当
  chosen: (a) 登録しない + O48 retrofit 全 revert
  chosen_type: explicit-choice
  depends_on: [D20260528-050, D20260528-049, D20260528-048]
  context: |
    release Phase 1 中、ユーザーが `.env.production.local` line 35 の `HUB_SHARED_SECRET=`
    に気付き「shipyard は ServiceHUB の pull 対象ではない」と認識を表明。

    過去 audit (D020/D023) は perspectives.md O48 の `require: マイクロサービス連発` だけ
    で判定し `skip_if: service-hub 管理対象外` を見落とした誤検出 → revise (D021) + tdd
    (D022) で retrofit 実装 = overkill。

    revert 範囲:
    - コード: lib/hub/service-info.ts + test + /api/hub/service-info/route.ts + dir 削除
    - env: 3 .env*.example から HUB_SERVICE_INFO_SECRET 行削除
    - docs: concept §6 service-info row 削除 + §1.2 含まないもの に明示除外追加 + §8 [論点-008]
      新規 + PREREQUISITES §1 row 削除 + revise/INDEX に revert 注記
    - 不変履歴: revise 設計文書 4 + 101/102 reports + AI_LOG D020/021/022/023 + AUDIT 2000/2030 残置

    170/170 GREEN (-6 = service-info test 6 件削除のみ、他影響ゼロ)。

    flow-suite 補強 candidate CF-20260528-022: audit.md #4 で `require` だけでなく
    `skip_if` も必ず参照 + PJ 性質判定根拠を AUDIT に記録 + skip_if キーワードの
    判定 SoT を明示化。

    release Phase 1 残: var #14 CRON_SECRET → var #15 SENTRY_DSN → Phase 2 動作確認
    → Phase 3 デプロイ。
```
