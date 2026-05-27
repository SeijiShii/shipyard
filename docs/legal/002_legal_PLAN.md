# legal 実装計画書

> **入力**: `./001_legal_SPEC.md`, `../_shared/{ui,seo}/*`, `../concept.md` §9
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `app/(public)/legal/privacy/page.tsx` | プライバシーポリシー（SSG + metadata） | ui, seo | 40 |
| `app/(public)/legal/terms/page.tsx` | 利用規約（SSG + metadata） | ui, seo | 40 |
| `content/legal/privacy.mdx` | プラポリ原稿（§9.3） | — | コンテンツ |
| `content/legal/terms.mdx` | 利用規約原稿 | — | コンテンツ |

## 2. 実装 Phase 分割
- **Phase 1**: 原稿（privacy/terms、§9.3 テンプレ + 取得項目=メール+本文）
- **Phase 2**: page（SSG + buildMetadata、Footer リンク配線は ui 側）

## 3. 依存関係順序
```
原稿(mdx) → page(ui/seo) → Footer リンク（ui で配線）
```

## 4. 既存ファイルへの影響
- Footer（_shared/ui）に /legal/privacy・/legal/terms リンク。

## 5. リスク・注意点
- 内容が §6（外部送信なし / cookieless）/ SEC-001 と矛盾しないこと。
- 公開前に取得項目（メール + 本文のみ）を最終確認。

## 6. 完了の定義
- [ ] /legal/privacy・/legal/terms が SSG 表示
- [ ] フッタ導線
- [ ] index 可（seo）、§9 整合
- [ ] 文面確認（公開前）

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
