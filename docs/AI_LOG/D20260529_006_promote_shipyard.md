# AI_LOG セッション D20260529_006 — /flow:promote (shipyard 告知文生成)

**実行日時**: 2026-05-29 09:30 (+09:00)
**コマンド**: /flow:promote
**実行者**: Claude (Opus 4.8) + seiji
**状態**: 完了
**含まれる decision**: D20260529-005 (1 件)

---

## 主要決定サマリ

| ID | テーマ | 採用 | type |
|---|---|---|---|
| D20260529-005 | shipyard 告知文生成 (生成=Class A、投稿=user 手動) | note 長文 + X 2案 + FB を docs/marketing/D20260529_shipyard_posts.md に生成。URL=https://shipyard.givers.work (サブドメイン確定済 = ハード前提クリア)、サイトの声 (copy.ts) 準拠、煽りなし | auto-recommended (生成パート Class A) |

## 起動経緯

- seiji [flow]「メディア向け内容は生成したか / release時にHOOKするはず」(CF-20260529-002)。shipyard 本番稼働済だが docs/marketing/ 不在 = 告知文未生成。
- CF-20260529-002 修正方針 (生成=Class A auto-execute / 投稿=Class C handoff) に沿って生成パートを実行。

## URL 解決

- 告知 URL = `https://shipyard.givers.work` (確定済: サブドメイン設定済 + DNS CNAME → 911a1cfe76d287d2.vercel-dns-017.com + HTTPS 200)。ハード前提 (CF-008) クリア。

## 生成内容 (channel / angle)

- channel: note (長文) + X (2 案: 制作記型 / 紹介型) + FB (中程度)。angle: launch。
- トーン基準: features/landing/copy.ts (確定済み UI 文言)。キーワード「共に考え・共に悩む」「正解の見えない時代」保持。anti-pattern (「成功させましょう」「必ず」「今すぐ」等) 排除。
- メイカーフッター: 最小ライン「※ AI 駆動開発で、週1ペースの新サービス公開を続けています。」(note/FB)。
- 煽りセルフチェック: 数字煽り/競争/限定/誇大 なし = PASS。

## 投稿

- **未投稿** (本コマンドは SNS へ投稿しない)。投稿は user が内容確認のうえ手動。

## 生成・更新ファイル

- docs/marketing/D20260529_shipyard_posts.md (新規)
- docs/AI_LOG/D20260529_006_promote_shipyard.md (本ファイル)
- docs/AI_LOG/INDEX.md (再生成)

## 依存関係

- 親 chain: D001 resume → D002 audit → D003 scenario → D004 secure → D005 release (本番稼働確認) → 本 promote
