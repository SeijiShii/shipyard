# _shared/ui 単体テスト計画

> **入力**: `./001_ui_SPEC.md`, `./002_ui_PLAN.md`, `../../design/design-system.md`
> **最終更新**: 2026-05-27

---

## 1. テストケース一覧

### 1.1 正常系（role/text ベース、class 名に過度依存しない）
| ID | 対象 | 検証 |
|---|---|---|
| U-1 | Button | variant ごとに role=button、children 表示、onClick 発火 |
| U-2 | StatusCard | name/稼働日数 表示、クリックで url リンク（href 正しい） |
| U-3 | StatusBadge | status='up'→「動いています」+ 緑ドット、'down'→「止まっているかも」+ 琥珀、'unknown'→「確認中」+ グレー |
| U-4 | Input/Textarea | 入力反映、focus でリング（aria/class） |
| U-5 | Header | ワードマーク + 「お問い合わせ」リンク + 「これは何?」導線 |
| U-6 | ProgressFeedback | stages/current に応じた段階文言表示（嘘進捗でない＝current 連動） |
| U-7 | EmptyState | line-art（svg role=img/aria-label）+ 文言 |

### 1.2 異常系
| ID | 対象 | 条件 | 期待 |
|---|---|---|---|
| U-E1 | StatusBadge | 未知 status | 'unknown' フォールバック（グレー+確認中） |
| U-E2 | StatusCard | url 欠落 | リンク無効化 or 非クリック |

### 1.3 境界値 / a11y
| ID | 対象 | 検証 |
|---|---|---|
| U-B1 | 全コンポーネント | キーボードフォーカス可、focus-visible リング |
| U-B2 | StatusBadge | 色覚配慮（色+形+ラベルの三重、ラベル単独で識別可） |
| U-B3 | Button | disabled 時 aria-disabled + クリック無効 |

## 2. Mock 方針
| 対象 | 方針 |
|---|---|
| lucide アイコン | 実物（軽量） |
| ルーター/リンク | テストダブル（href 検証のみ） |
| 時刻（稼働日数計算） | 固定値注入 |

## 3. カバレッジ目標
| 種別 | 目標 |
|---|---|
| 行 | 80% |
| 分岐 | 70%（status マップ分岐は 100%） |

## 4. テスト実行環境
- フレームワーク: Vitest + Testing Library（role/text 起点）
- 視覚回帰（Level 1 snapshot）は Phase 3 で画面実装後に E2E 側で取得（本横断単体ではコンポーネント render のみ）

## 5. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
