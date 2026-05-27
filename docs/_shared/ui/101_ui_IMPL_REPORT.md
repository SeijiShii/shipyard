# 実装レポート: _shared/ui

## 実装日時
2026-05-27 15:30 (JST)

## モード
feature（横断基盤・UI）

## 関連ドキュメント
- [001_ui_SPEC.md](./001_ui_SPEC.md) - コンポーネント inventory
- [002_ui_PLAN.md](./002_ui_PLAN.md) - 実装計画（3 Phase）
- [003_ui_UNIT_TEST.md](./003_ui_UNIT_TEST.md) - 単体テスト項目
- [design-system.md](../../design/design-system.md) - スタイル SoT（Ink & Teal）
- [AI_LOG セッション](../../AI_LOG/D20260527_019_tdd_continuous.md)

## 注意事項
本レポートのファイルパスと行番号は実装日時時点のものです。

## 変更一覧

### Phase 1: トークン + 最小コンポーネント
- トークンは Phase 0 scaffold で適用済み（`tailwind.config.ts` theme + `app/globals.css` :root CSS 変数、design SoT §2-§4）
- `lib/utils.ts` — `cn()`（clsx + tailwind-merge）
- `components/ui/button.tsx` — `Button`（variant primary/secondary/ghost、size、disabled で aria-disabled、focus ring）
- `components/ui/input.tsx` / `textarea.tsx` — フォーム入力（border + focus ring）

### Phase 2: 状態表示 + レイアウト
- `lib/ui/status.ts` — `STATUS_LABEL`（動いています/止まっているかも/確認中、O38）/ `STATUS_DOT_CLASS` / `normalizeStatus`（未知→unknown フォールバック）/ `daysSince`（now 注入可）
- `components/status/StatusBadge.tsx` — plain ラベル + 状態色ドット（色+形+ラベルの三重、色覚配慮）
- `components/status/StatusCard.tsx` — `[ドット] 名前 … 状態 稼働N日`、url ありで行リンク（aria-label）、url 欠落で非リンク（UI-E2）
- `components/layout/Header.tsx` — ワードマーク + 「これは何？」+ お問い合わせ（design SoT §7）
- `components/layout/Footer.tsx` — 法務リンク + 控えめメイカー文脈、year 注入可

### Phase 3: 補助コンポーネント + イラスト
- `components/illustrations/Dock.tsx` — 自作 SVG line-art（ドック、stroke=currentColor でテーマ追従、role=img、絵文字不使用）
- `components/ui/InfoButton.tsx` — O41「これは何？」導線（lucide HelpCircle + 軽量モーダル、role=dialog/aria-modal、client）
- `components/ui/EmptyState.tsx` — line-art + 一言（技術詳細を出さない、SEC-001）
- `components/ui/ProgressFeedback.tsx` — 段階文言 + 軽い動き（O45、current 連動 = 嘘進捗禁止、role=status aria-live）

## 実装計画からの差分

| 項目 | 内容 |
|------|------|
| 計画にない追加変更 | `status` マップを `lib/ui/status.ts` に集約（StatusBadge/StatusCard が共有、分岐 100% テスト）。`daysSince`/`Footer.year`/`StatusCard.now` を注入可能にしテスト再現性確保 |
| 計画から省略した変更 | 独立した `Icon`（lucide ラッパ）コンポーネントは作らず lucide を直接 import（個別 import で tree-shake、SPEC inventory の Icon は方針として満たす）。`app/layout.tsx` への Header/Footer 配置は各画面/landing 機能の責務として繰延（本横断は純粋な提供層） |
| 想定外の問題 | なし。視覚レビュー（design SoT §9）は Phase 3 で `/flow:design --review-only`（画面実装後）。ESLint 設定が scaffold 未初期化（`next lint` が対話プロンプト）= Phase 0 scaffold 側の follow-up（本 target の GREEN ゲートは typecheck + unit） |

## PR Description

### タイトル
_shared/ui: design SoT（Ink & Teal）コンポーネント基盤

### 概要
design-system.md のトークンに沿った共通 UI コンポーネント群を実装。状態表示（一般向けラベル + 色覚配慮）、レイアウト、フォーム、O41/O45 導線を提供し、各機能が import する基盤とする。

### 変更内容
- Button/Input/Textarea、StatusCard/StatusBadge（status マップ集約）、Header/Footer
- InfoButton（O41 モーダル）/ EmptyState / ProgressFeedback（O45）/ 自作 SVG line-art
- 絵文字不使用・状態は色+形+ラベル三重・focus ring（a11y）

### テスト
- 単体: 20 件（components + status マップ）、全 GREEN
- 全体スイート: 49/49（100%）、typecheck クリーン
- role/text 起点（class 過度依存を回避）、status 分岐 100%
