# D20260618_006_secure_release-pre — /flow:secure --phase=design (release-pre 2段目)

**状態**: 完了
**phase**: design (L1)
**開始**: 2026-06-18
**dispatch元**: /flow:auto (D20260618_003, §3.0c release-pre 必須監査 2段目)

## サマリ

shipyard redeploy 前の release-pre 設計レベル SEC。[論点-010] summary 表示 + [論点-009] rebrand +
legal tokushoho 差分。新規 Critical/High/Medium SEC = 0。Info 1 (JsonLd pre-existing、summary 非流入)。
release-pre 必須監査 2段クリア。

## Decisions

- id: D20260618-006-01
  command: /flow:secure
  phase: design / L1 shipyard redeploy 前差分
  question: summary 表示 + rebrand + legal の設計レベル SEC リスク
  chosen: 新規 SEC 0 (React 自動エスケープ / read-only consumer / 静的テキスト)、Info 1
  chosen_type: auto-recommended
  context: |
    O24/XSS: StatusCard が {summary} JSX テキストで描画 → React 自動エスケープ安全 (dangerouslySetInnerHTML 不使用)。
    O23: api/services は service-hub 公開 API の read-only 消費・cache、新認可境界なし。
    O25: summary は上流で安全投影済の public showcase 文。O28: lockfile 変更なし=新依存なし。
    [論点-009]/legal: 静的テキスト変更のみ。
    Info: JsonLd.tsx の dangerouslySetInnerHTML は pre-existing で summary 非流入 (将来含めるなら JSON.stringify 維持)。

## 生成・更新ファイル
- docs/SECURITY_REVIEW_20260618.md / 本 AI_LOG
