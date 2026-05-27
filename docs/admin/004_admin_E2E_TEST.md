# admin E2E テスト計画

> **入力**: `./001_admin_SPEC.md`, `../concept.md` §1.1
> **最終更新**: 2026-05-27

---

## 1. ユーザージャーニー
| シナリオ ID | 前提 | 操作 | 期待結果 |
|---|---|---|---|
| A1-S1 (happy) | 運用者ログイン済（allowlist） | `/admin` を開く | スレッド一覧（last_activity 降順） |
| A2-S1 | スレッド選択 | 詳細 → 返信入力 → 送信 | 会話に operator メッセージ追加、訪問者にメール通知（mock） |
| A3-S1 | open スレッド | クローズ | status=closed、訪問者追記不可（inquiry 側で検証） |
| A1-S2 (未認証) | 未ログイン | `/admin` | Clerk サインインへリダイレクト |
| A1-S3 (allowlist 外) | allowlist 外ユーザー | `/admin` | 403 |

## 2. 環境要件
| 項目 | 要件 |
|---|---|
| ブラウザ | Chromium |
| 認証 | Clerk テストユーザー（allowlist 内/外を切替） |
| Resend | mock |
| DB | テスト DB（thread/message seed） |

## 3. データセットアップ
- Seed: thread 数件（open/closed）+ messages、Clerk テストユーザー（allowlist 内/外）
- Cleanup: DB リセット、セッションクリア

## 4. タグ別追加シナリオ
- auth-required: A1-S2/S3（未認証・allowlist 外）必須
- stateful: A3-S1（close → 訪問者追記不可）

## 5. レイアウト・ビジュアル検証（O34）
### 5.1 Level 1
| シナリオ | スクショ | mask |
|---|---|---|
| A1-S1 | `admin-list.png` | 時刻 |
### 5.2 Level 2
| # | 要件 | アサーション |
|---|---|---|
| L2-1 | 返信ボタンが入力下 | submit.y > textarea.y |
| L2-2 | 状態表示（open/closed）が識別可 | ラベル + 色 |
### 5.3 採用 Level
- Level 1 ✅ / Level 2 ✅ / Level 3 ❌（内部運用画面、design --review-only で十分）

## 6. 期待 KPI
| 指標 | 目標 |
|---|---|
| 成功率 | 100% |
| 認可シナリオ（未認証/allowlist 外） | 100% block |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
