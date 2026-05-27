# inquiry E2E テスト計画

> **入力**: `./001_inquiry_SPEC.md`, `../concept.md` §1.1
> **最終更新**: 2026-05-27

---

## 1. ユーザージャーニー
| シナリオ ID | 前提 | 操作 | 期待結果 |
|---|---|---|---|
| I1-S1 (happy) | Turnstile test=pass | /contact でメアド+本文 → 送信 | ProgressFeedback → スレッド表示（token URL）、localStorage に保存 |
| I1-S2 (honeypot) | bot 模擬（隠しフィールド埋め） | 送信 | 汎用エラー（理由非開示）、スレッド作成されない |
| I1-S3 (timing) | formRenderedAt 直近（<2s） | 即送信 | reject |
| I2-S1 | 既存スレッド token | `/t/{token}` を開く | 会話表示、追記できる |
| I2-S2 (IDOR) | 無効/他人の token 推測 | `/t/{invalid}` | 404（列挙耐性） |
| I2-S3 (XSS) | 本文に `<script>` | 送信 → 表示 | プレーンテキスト表示、スクリプト実行されない |
| I1-S4 (localStorage 復帰) | 送信後リロード | / or /contact 再訪 | localStorage からスレッドに戻れる |

## 2. 環境要件
| 項目 | 要件 |
|---|---|
| ブラウザ | Chromium + WebKit |
| 画面 | モバイル / デスクトップ |
| 認証 | 不要（token のみ） |
| Turnstile | test キー（always-pass / always-fail を切替） |
| Resend | mock（送信検証はせず、スレッド作成の best-effort を確認） |
| DB | テスト DB（thread/message/rate_limit） |

## 3. データセットアップ
- Seed: 既存スレッド 1 件（I2 用、token 既知）
- Cleanup: DB リセット、localStorage クリア

## 4. タグ別追加シナリオ
- stateful: closed スレッドへの追記不可（admin が close 後）
- auth-required（IDOR）: I2-S2（token 詐称 404）必須

## 5. レイアウト・ビジュアル検証（O34）
### 5.1 Level 1 (snapshot)
| シナリオ | スクショ | mask |
|---|---|---|
| I1-S1 | `contact-form.png` / `thread-view.png` | token / 時刻 |
### 5.2 Level 2 (意味的)
| # | 要件 | アサーション |
|---|---|---|
| L2-1 | 送信ボタンがフォーム下部 | submit.y > 最後の input.y |
| L2-2 | エラーは平易・赤系（design SoT 状態色） | error 要素 color |
| L2-3 | ProgressFeedback が段階表示（O45） | 段階文言が current に連動 |
### 5.3 採用 Level
- Level 1 ✅ / Level 2 ✅ / Level 3 ❌（design --review-only 代替）

## 6. 期待 KPI
| 指標 | 目標 |
|---|---|
| 成功率 | 100% |
| IDOR/XSS シナリオ | 100% block |
| Level 2 pass | 100% |

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
