# landing 実装計画書

> **入力**: `./001_landing_SPEC.md`, `../design/design-system.md`, `../concept.md` §1.4
> **最終更新**: 2026-05-27

---

## 1. 実装対象ファイル一覧
| ファイル | 責務 | 依存 | LOC |
|---|---|---|---|
| `app/(public)/page.tsx` | トップ（SSG/ISR、各セクション組立 + metadata） | ui, seo, service-status | 90 |
| `features/landing/Hero.tsx` | ヒーロー（リード文 + CTA、O41） | ui | 50 |
| `features/landing/ValueSection.tsx` | 提供価値セクション | ui | 40 |
| `features/landing/ConsultPitch.tsx` | コンサル打ち出し + CTA→/contact | ui | 40 |

## 2. 実装 Phase 分割
- **Phase 1**: page 骨格 + Hero（リード文 = design SoT §7、generateMetadata = seo）
- **Phase 2**: ValueSection + ConsultPitch + 稼働一覧埋め込み（service-status component）
- **Phase 3.5**: app/api bootstrap は service-status/inquiry 側で（landing は表示のみ）

## 3. 依存関係順序
```
ui/seo/service-status(component) → Hero/Value/ConsultPitch → page.tsx
```

## 4. 既存ファイルへの影響
- `app/layout.tsx`（ThemeProvider/globals）は ui 側。landing は page 追加。

## 5. リスク・注意点
- 稼働一覧の取得失敗時も LP 全体は表示（graceful、service-status 側）。
- CTA は煽らない（charter §2.2）。リード文確定は `/flow:wording`。

## 6. 完了の定義
- [ ] `/` が SSG/ISR で表示、LCP<2.5s
- [ ] OGP/JSON-LD（seo）配線
- [ ] CTA→/contact 遷移
- [ ] 視覚レビュー（Phase 3 design --review-only）+ O41 入口理解 OK

## 7. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
