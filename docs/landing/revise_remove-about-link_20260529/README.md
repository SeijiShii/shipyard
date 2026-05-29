# 改修: Header の壊れた「これは何？」(/about) リンク削除

- **issue / slug**: remove-about-link
- **実施日**: 2026-05-29
- **対象機能**: ../README.md (landing)
- **基準 SPEC**: ../001_landing_SPEC.md
- **改修要望**: 「about リンクが 404 になる。LP そのものが説明なのだから about リンクは必要ないのではないか」(seiji、本番 https://shipyard.givers.work で発覚)
- **状態**: 設計中

## このフォルダに置くドキュメント

- `001_REVISE_SPEC.md` — 変更仕様（before/after、影響範囲、O41 充足根拠）
- `002_REVISE_PLAN.md` — 変更計画（Header.tsx + seo/config.ts + テスト 2 件）
- `003_REVISE_UNIT_TEST.md` — 単体テスト計画（U-5 修正 / sitemap / auth path）
- `004_REVISE_E2E_TEST.md` — E2E/リグレッション（Header ナビ + sitemap 404 解消）

## 関連
- O41 (入口の「これは何？」理解) = LP Hero 内容 + InfoButton コンポーネント (現状 orphaned)
- 過去改修: ../revise_messaging-shift_20260528_*/ (メッセージング転換)
