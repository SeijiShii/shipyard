# _shared/ui 仕様書（横断基盤・UI）

> **役割**: design-system.md（Ink & Teal）のトークン適用 + 共通 UI コンポーネントの提供
> **タグ**: cross-cutting
> **最終更新**: 2026-05-27
> **入力**: `../../concept.md` §4.2, `../../design/design-system.md`（SoT）, `./README.md`

---

## 1. 提供インターフェース（コンポーネント inventory）

design-system.md §5 のコンポーネントをトークン経由で実装し、各機能へ提供する。

| コンポーネント | 用途 | 利用機能 | design SoT 参照 |
|---|---|---|---|
| `ThemeProvider` / tokens | カラー/タイポ/余白/角丸/影トークンを CSS 変数 + Tailwind theme に反映 | 全 | §2-§4 |
| `Button` | primary(teal) / secondary(outline) / ghost | 全 | §5 |
| `StatusCard` | 稼働サービス 1 件（状態ドット + 名前 + 稼働日数 + →） | service-status | §5 |
| `StatusBadge` | 状態ラベル（plain 文言 + ドット） | service-status | §5, §6 |
| `Input` / `Textarea` | フォーム入力（focus ring） | inquiry, admin | §5 |
| `Header` | ミニマルナビ（ワードマーク + お問い合わせ + これは何?） | 全 | §5, §7 |
| `Footer` | 法務リンク + 控えめメイカー文脈 | 全 | §5 |
| `InfoButton` | 丸付き「?」+ 軽量モーダル（O41、サブページ流入の保険） | 全（任意） | §7 |
| `EmptyState` | 自作 SVG line-art + 一言 | admin, service-status | §5, §8 |
| `ProgressFeedback` | 非同期の段階文言 + 軽い動き（O45） | inquiry | §5 |
| `Icon`（lucide ラッパ） | OSS アイコン（**絵文字不使用**） | 全 | §8 |
| `DockIllustration` 等 | 自作 SVG line-art（teal-tint、テーマ追従） | landing, empty | §8 |

## 2. 入出力（コンポーネント props 概要）
- `Button`: `variant`('primary'|'secondary'|'ghost'), `size`, `disabled`, children
- `StatusCard`: `service: {slug,name,url,status,since}`, クリックで `url` へ
- `StatusBadge`: `status`('up'|'down'|'unknown')→ plain ラベル + 状態色ドット
- `ProgressFeedback`: `stages: string[]`, `current: number`（段階文言、嘘進捗禁止）
- 共通: トークン経由のスタイル（生値の色/余白を直書きしない）

## 3. データモデル
なし（表示層）。状態色マップ（up/down/unknown → トークン）を定数で持つ。

## 4. バリデーション + エラーケース
| ID | 条件 | 振る舞い |
|---|---|---|
| UI-E1 | StatusBadge に未知 status | `unknown`（グレー + 「確認中」）にフォールバック |
| UI-E2 | EmptyState（データ 0 / 取得失敗） | line-art + 一言（技術詳細を出さない、SEC-001） |

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| a11y | フォーカスリング可視、role/text が機能（色のみに依存しない） | design SoT §9 |
| コントラスト | WCAG AA | design SoT §2 |
| バンドル | アイコンは tree-shake（個別 import）、Web フォントはサブセット | 初回表示軽量 NFR |
- 連携: 全機能が本基盤を import。design-system.md がスタイル SoT。

## 6. タグ別追加
cross-cutting のため UC なし。視覚レビュー（O34 Level 3）は Phase 3 で `/flow:design --review-only`。

## 7. スコープ外
- ダークモード（MVP 外、design SoT §2）
- アニメーション凝った演出（ミニマル方針）

## 8. 未決事項
現時点で論点なし (2026-05-27)。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成（design SoT 由来のコンポーネント inventory） | /flow:feature |
