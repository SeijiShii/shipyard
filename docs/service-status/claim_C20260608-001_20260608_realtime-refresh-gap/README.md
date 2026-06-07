# クレーム判定: HUB 3 サービス登録なのに shipyard は 2 件しか表示しない

- **claim id**: C20260608-001
- **実施日**: 2026-06-08
- **対象**: ../README.md （service-status）
- **基準 SPEC**: ../001_service-status_SPEC.md（UC-S5 / §62）
- **クレーム内容**: Service hub には 3 つのサービスが登録されているが、Shipyard には 2 つしか表示されていない（naze-bako 欠落）
- **状態**: 判定完了 → 分岐実行（revise）
- **判定結果**: 仕様検討漏れ (revise) — Vercel Hobby の日次 cron 制約下でリアルタイム鮮度を担保する更新戦略が未設計
- **分岐先**: ../revise_C20260608-001_20260608_realtime-refresh-gap/

## このフォルダに置くドキュメント
- `000_CLAIM_REPORT.md` — クレーム整理（期待 / 現実 / 文脈 / 影響）
- `001_TRIAGE.md` — 判定レポート（三項照合 + 判定根拠 + 分岐先）

## 関連
- 過去類似 claim: なし（本 PJ 初）
- 分岐先: ../revise_C20260608-001_20260608_realtime-refresh-gap/
