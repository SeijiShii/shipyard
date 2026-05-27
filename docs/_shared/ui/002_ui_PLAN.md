# _shared/ui 実装計画書

> **入力**: `./001_ui_SPEC.md`, `../../design/design-system.md`, `../../concept.md` §1.4 / §4.3
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | LOC 見積 |
|---|---|---|
| `tailwind.config.ts` / `app/globals.css` | design SoT トークンを Tailwind theme + CSS 変数に反映 | 80 |
| `components/ui/button.tsx` | shadcn/ui Button（variant teal/outline/ghost） | 40 |
| `components/ui/input.tsx` / `textarea.tsx` | フォーム入力 | 40 |
| `components/status/StatusCard.tsx` | 稼働サービスカード | 50 |
| `components/status/StatusBadge.tsx` | 状態ラベル + ドット + 状態色マップ | 40 |
| `components/layout/Header.tsx` / `Footer.tsx` | ナビ + フッタ | 70 |
| `components/ui/InfoButton.tsx` | 「?」+ 軽量モーダル（O41） | 50 |
| `components/ui/EmptyState.tsx` | line-art + 一言 | 30 |
| `components/ui/ProgressFeedback.tsx` | 段階文言 + 軽い動き（O45） | 40 |
| `components/illustrations/Dock.tsx` 他 | 自作 SVG line-art（teal-tint） | 60 |
| `lib/ui/status.ts` | status→色/ラベル マップ定数 | 20 |

## 2. 実装 Phase 分割
- **Phase 1**: トークン適用（Tailwind/CSS 変数）+ Button/Input/Textarea（最小コンポーネント）
- **Phase 2**: StatusCard/StatusBadge + status マップ + Header/Footer
- **Phase 3**: InfoButton/EmptyState/ProgressFeedback + 自作 SVG line-art + lucide 導入

## 3. 依存関係順序
```
tokens(globals/tailwind) → ui/* → status/* + layout/* → illustrations
```

## 4. 既存ファイルへの影響
なし（greenfield、最初の UI 層）。ただし `app/layout.tsx` に ThemeProvider/globals 適用。

## 5. 横断/連携
- design-system.md がスタイル SoT。lucide-react 導入（個別 import で tree-shake）。

## 6. リスク・注意点
- 絵文字を使わない（design SoT §8）。状態は色+形+ラベルの三重（色覚配慮）。
- class 名を assert するテストはトークン変更に追従更新（design 原則 7）。

## 7. 完了の定義
- [ ] トークンが Tailwind/CSS に反映、画面はトークン参照
- [ ] 全コンポーネント実装 + render テスト green（role/text）
- [ ] lucide 導入 + 自作 SVG line-art 生成
- [ ] 視覚レビュー（Phase 3 `/flow:design --review-only`）で design SoT §9 基準を満たす

## 8. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
