# 依存ライブラリ脆弱性スキャン結果 — release-pre 再実行

**スキャン日**: 2026-05-29 09:15 (+09:00)
**対象**: package-lock.json (Node.js)
**スキャナ**: npm audit
**起動経緯**: /flow:auto §3.0c release-pre 必須監査 audit→secure pair (CF-20260528-009)。前回 SECURITY_DEPS_20260527 以降の delta 確認。

## 1. サマリ
- 総検出: 11 件
- **Critical: 0 件**
- **High: 0 件**
- Medium (moderate): 11 件
- Low: 0 件
- 対応必須 (Critical/High): **0 件** → release-pre gate 基準 PASS
- §8 登録: 0 件 (Critical/High なし)

## 2. Critical / High 詳細
なし。前回 (2026-05-27) の High 1 は既に修正済 (SECURITY_DEPS_20260527.md §2)。本回 High/Critical の新規発生なし。

## 3. Medium 以下 (記載のみ)
- moderate 11 件 = 前回と同一の推移的 (transitive) 依存由来。直接依存への影響なし、修正バージョン未提供 or dev 系。release を gate しない (perspectives O28: Medium 以下は記載のみ、次回通常スキャンで再評価)。

## 4. L1 設計レビュー delta 確認 (前回 secure 以降の変更点)

前回 SECURITY_REVIEW_20260527 以降のコード変更を delta レビュー:

| 変更 | SEC 観点 | 判定 |
|---|---|---|
| inquiry mail revise ([論点-006]): replyNotification に運用者返信本文を含める | SEC-003 (XSS) | ✅ 防御済: `lib/email/templates/replyNotification.ts` で `escapeHtml(body)` 適用 (defense-in-depth、本文は運用者 authored)。`lib/email/util.ts` escapeHtml 実装あり |
| 同上 | SEC-001 (PII) | ✅ 非該当: mail 送信先は thread 当事者の訪問者本人、本文は運用者返信 = 第三者への PII 漏洩なし。訪問者自身の問い合わせ本文を新たに外部へ出さない |
| O48 service-info producer 追加→全 revert (D025) | 新 endpoint / 外部入力 | ✅ 非該当: 現 HEAD に endpoint 不在 (revert clean)。consumer (HUB_STATUS_URL pull, auth-free public API) のみ |

§8 既存 SEC findings ([論点-002] SEC-001 / [論点-003] SEC-002 / [論点-004] SEC-003) は全て `accepted-as-requirement` (§3.7 NFR 要件化済)。新規 Critical/High なし。

## 5. release-pre gate 判定
**audit→secure pair PASS** (audit AUDIT_20260529_0900 Critical/High 0 + 本 deps/L1 delta Critical/High 0)。P4.7 Release gate (Phase 3 デプロイ) へ合流可。
