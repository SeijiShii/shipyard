# AI_LOG セッション D20260528_014 — favicon setup (O56 retrofit、AUDIT-perspective-001 Medium reconcile)

**実行日時**: 2026-05-28 17:40 (+09:00)
**コマンド**: (手動 favicon 配線、design SoT §8 船渠 line-art 派生)
**実行者**: Claude (Opus 4.7) + seiji
**状態**: 完了
**含まれる decision**: D20260528-040 (1 件)

---

## 主要決定サマリ

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260528-040 | O56 favicon 配線 (AUDIT-perspective-001 Medium reconcile) | Next.js App Router 慣習 `app/icon.svg` 単一ファイル、Dock.tsx の line-art を 32×32 viewBox に圧縮 (水面 + ドック支柱 + 船体台形)、stroke=#0E7C72 (design SoT §3 `--primary` brand teal)、design SoT §8 船渠/ドック モチーフ整合 | auto-recommended |

## 依存関係

- 親 dispatch: D20260528_010 (flow:auto loop) → D20260528_011 (audit standard、O56 favicon Medium 検出) → D20260528_012 (scenario --update) → D20260528_013 (spec-review) → 本 (§3.0c シューティング #2、O56 reconcile)
- 親 audit finding: AUDIT-perspective-001 (Medium、O56 favicon 未配線)

## 生成・更新したアーティファクト

- 新規: `app/icon.svg` (Next.js App Router 慣習、自動 <link rel="icon"> 配信)
- 新規: 本ファイル
- 更新: `docs/AI_LOG/INDEX.md` (本セッション追加)

## 設計判断

| # | 判断 | chosen | 理由 |
|---|---|---|---|
| 1 | favicon 形式 | `app/icon.svg` (Next.js App Router 慣習) | App Router が自動検出 + <link rel="icon" type="image/svg+xml"> 配信、metadata 手動設定不要、scalable で多解像度対応 |
| 2 | モチーフ | Dock.tsx (96×96 viewBox) を 32×32 に圧縮 | design SoT §8 船渠/ドック モチーフ整合、shipyard ブランド identity 統一 |
| 3 | 簡略化方針 | 水面 (2 本) + ドック支柱 (L 字) + 船体 (台形 + 上部建造) の 6 path | favicon サイズ (16-32px) で識別可能な最小要素、stroke-width=2 (96px Dock の 1.5 から scale up) |
| 4 | 色 | `#0E7C72` 静的 hex (design SoT §3 `--primary` brand teal) | SVG ファイル自体は CSS 変数を解決できないため hex 埋め込み、color-scheme 非対応で OK (favicon は theme 追従不要) |
| 5 | apple-icon.png | skip | MVP 段階、PNG 生成は外部ツール (ImageMagick 等) が要る、`icon.svg` で iOS Safari 16+ も対応 (Touch icon は scope 外) |

## 学習・改善

- **`/flow:design --favicon-setup` 専用 sub-mode の有用性**: 本回は手動配線したが、observance 追加 (O56 等) で既存 PJ への retrofit が頻発する場合、`/flow:design` に `--favicon-setup` mode を新設すると benefit。本 PJ では 1 回作業なので不要、SoT 化候補として記録。
- **observance 追加時の retrofit プロトコル**: O56 favicon は CF-20260528-016 (perspectives.md への観点追加) 直後に既存 PJ で発覚した typical case。perspectives.md への新観点追加時は「既存 active PJ への遡及検査」を運用パターン化推奨 (CF として SoT 化)。

---

## Decisions

```yaml
- id: D20260528-040
  timestamp: 2026-05-28T17:40:00+09:00
  command: (手動 favicon 配線)
  phase: §3.0c シューティング #2 (AUDIT-perspective-001 Medium reconcile)
  question: O56 favicon 未配線 (AUDIT_20260528_1640 Medium) の解消方針
  options:
    - "(a) /flow:design --favicon-setup 専用 sub-mode 新設 + 実行"
    - "(b) 手動 SVG 生成 + app/icon.svg 配置 (Next.js App Router 慣習)"
    - "(c) 別 session で /flow:design 全面 review (favicon を含めて design SoT update)"
  recommended: (b) 手動 SVG (Class A、即時、design SoT §8 既存 Dock.tsx 派生で品質確保)
  chosen: (b) — app/icon.svg 単一ファイル
  chosen_type: auto-recommended
  depends_on: [D20260528-037, D20260528-039]
  context: |
    AUDIT-perspective-001 (Medium、AUDIT_20260528_1640.md): O56 favicon 観点が
    perspectives.md に追加 (CF-20260528-016 関連) されたが、shipyard PJ には favicon
    未配線。observance 追加時の既存 PJ retrofit ケース。

    実装内容:
    - app/icon.svg 新規生成 (Next.js App Router 慣習、自動 <link rel="icon"> 配信)
    - viewBox 32×32、Dock.tsx (96×96) を 6 path に圧縮:
      - 水面: M3 23 H29 (主線) + M6 27 H26 opacity=0.5 (副線)
      - ドック支柱: M7 23 V10 H15 (L 字)
      - クレーン腕: M15 10 L22 8 (斜線)
      - 船体: M10 20 H24 L21 23 H13 Z (台形)
      - 船上部: M17 20 V15 H22 (建造物)
    - stroke=#0E7C72 (design SoT §3 `--primary` brand teal、静的 hex 埋め込み)
    - stroke-width=2、stroke-linecap=round、stroke-linejoin=round (Dock.tsx 整合)
    - 351 bytes (小さい)

    Next.js metadata 設定変更不要 (App Router 自動検出)。
    apple-icon.png は MVP scope 外 (iOS Safari 16+ は icon.svg 対応)。

    AUDIT-perspective-001 Medium reconcile 完了。Phase 2 動作確認 Step 6 として
    ブラウザタブで favicon 表示確認推奨 (ユーザー手動)。
```
