# inquiry 単体テスト計画 (mail-include-reply)

> **入力**: [`./001_REVISE_SPEC.md`](./001_REVISE_SPEC.md), [`./002_REVISE_PLAN.md`](./002_REVISE_PLAN.md), 既存 `lib/email/email.test.ts` + `features/admin/admin.test.tsx`
> **最終更新**: 2026-05-28

---

## 1. 追加テストケース

### 1.1 正常系

| ID | 対象 | 入力 | 期待出力 |
|---|---|---|---|
| **U-IR1** | `replyNotificationEmail({ url, body })` (template) | `url="https://shipyard.example.com/t/abc123"`, `body="ありがとうございます。お問い合わせの件、対応可能です。来週ミーティングいかがでしょうか。"` | `html` に body 各文字が含まれる (escape 後) + `text` に body plain 含む + subject = "返信が届きました" + optional link 含む + 「このメールへの返信は受け付けていません。続きはサイトの返信フォームから」案内含む |
| **U-IR3** | `sendReplyNotification(deps, { to, token, body })` (send) | mock mailer + 上記 url/token/body | mailer.send が `{ from, to, subject, html, text }` で呼ばれる + html/text に body 含む |
| **U-IR4** | `adminReply(threadId, body, deps)` (service) で body が notifyReply に伝搬 | mock `notifyReply` + admin user の reply body | `notifyReply` が `(inquirer.email, thread.token, body)` で呼ばれる |

### 1.2 異常系

| ID | 対象 | 失敗条件 | 期待振る舞い |
|---|---|---|---|
| **U-IR2** | `replyNotificationEmail({ url, body })` SEC-003 XSS 防御 | `body="<script>alert(1)</script>"` | html ブランチで `&lt;script&gt;alert(1)&lt;/script&gt;` のように escape されている (literal script tag は含まれない) |
| U-IR5 | sendReplyNotification mailer 失敗 (既存 retry 1 回) | mailer.send が 2 回連続例外 | `{ ok: false, error: masked }` 返却、adminReply は引き続き ok (best-effort) — **既存 U-3 と同等、新規検証不要、回帰維持** |

### 1.3 境界値

| ID | 対象 | 境界 | 期待振る舞い |
|---|---|---|---|
| **U-IR6** | `replyNotificationEmail` body 改行 | body に `\n` を含む (例: "ありがとうございます\n来週いかがでしょうか") | html では `<pre style="white-space:pre-wrap">` 等で改行が保持される、text では plain `\n` そのまま |
| (任意) U-IR7 | body 空文字 | body=`""` | html/text に空段落 (or 案内のみ)、エラーなし送信成功 — 上流 adminReplySchema が空 reject するため到達しないが defensive |

## 2. 修正テストケース

| ID | 対象 | 修正前 | 修正後 | 理由 |
|---|---|---|---|---|
| **U-2** (`replyNotificationEmail`) | リンクのみ生成検証 (`expect(html).toContain('返信を読む')` + `expect(html).not.toContain(body content)`) | リンクのみ + 短い lead | **body 引数追加、html/text に body 含むことを検証**。「本文を含まない」assertion を反対方向に修正 | [論点-006] 案 (c)、SEC-001 配慮を訪問者本人宛 mail から緩和 |
| **U-P1** (`sendReplyNotification` 本文プレビューを含まない) | `expect(mailer.send.mock.calls[0][0].html).not.toContain(message body)` で SEC-001 防御 | (なし、削除候補) | **削除** — 本 revise で「本文を含む」方針に転換、test 趣旨と矛盾 (concept §3.7 SEC-001 「訪問者本人宛 reply mail は対象外」追記後、本 test は obsolete) | 既存 SEC-001 防御 test の方針転換 |
| **既存 admin.test.tsx adminReply test** | `notifyReply` 呼び出し 2 引数 (email, token) | `notifyReply` 呼び出し 3 引数 (email, token, body) | シグネチャ拡張に合わせて assertion 更新 | Phase 2 配線 |

## 3. 削除テストケース

| ID | 対象 | 削除理由 |
|---|---|---|
| **U-P1** (上記) | SEC-001 防御方針が「訪問者本人宛 mail は対象外」に転換 = 本 test の前提 (本文を含まない) が消滅 | [論点-006] reconcile |

## 4. リグレッション強化

- **既存テスト維持**: email 関連既存 17+ 件 (sendThreadLink / newInquiry / retry / from / maskEmail 等) + admin 関連既存 10 件全て pass 維持。
- **追加チェック**:
  - U-IR2 で body XSS 防御を恒久ガード (defense-in-depth、admin = trusted user でも escape 適用を test で機械担保)
  - U-IR4 で notifyReply propagation を機械担保 (Phase 2 配線漏れリスク回避、明示列挙パターン同様)
  - U-IR6 で改行保持を担保 (運用者返信は複数段落の文章になることが多い)

## 5. Mock 方針差分

| 対象 | 前回 | 今回 | 理由 |
|---|---|---|---|
| `replyNotificationEmail` (template) | URL のみの mock 入力 | URL + body 両方の mock 入力 (正常 1 / XSS body 1 / 改行 body 1) | 3 ケースで body 取り扱いを担保 |
| `notifyReply` (admin.test.tsx) | 2 引数 mock | 3 引数 mock + 呼び出し引数 assertion 強化 | シグネチャ拡張に合わせる |

## 6. カバレッジ目標

| 種別 | 目標 | 根拠 |
|---|---|---|
| 行 | 80% | 既存継承 |
| 分岐 | 70% | 既存継承 |
| **replyNotificationEmail body 分岐** | 100% | 純データ + escape 適用 + 改行保持 = 機械的に網羅可能 |

## 7. 更新履歴

| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-28 | 初版作成 — U-IR1〜U-IR6 + 既存 U-2/U-P1 更新/削除 + admin.test.tsx 拡張 | /flow:revise |
