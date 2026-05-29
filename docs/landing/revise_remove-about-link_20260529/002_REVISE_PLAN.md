# landing 変更計画書（Header の壊れた「これは何？」(/about) リンク削除）

> **入力**: `./001_REVISE_SPEC.md`, 既存実装 (Header.tsx / seo/config.ts / 関連テスト)
> **最終更新**: 2026-05-29

---

## 1. 既存ファイル変更一覧

| ファイル | 変更内容（概要） | リスク | 関連 SPEC § |
|---|---|---|---|
| `components/layout/Header.tsx` | `<a href="/about">これは何？</a>`（line 12-14）を削除。コメント (line 3) の「これは何？」言及も整合更新 | 低（独立した 1 リンク削除） | §2.1 / §7.1 |
| `lib/seo/config.ts` | `PUBLIC_PATHS` から `"/about"`（line 16）を削除 | 低（`app/sitemap.ts` が自動反映） | §2.2 |
| `components/components.test.tsx` | U-5 テスト（line 157-170）から「これは何？」リンク assertion を削除。テスト名も更新 | 低 | §3 |
| `lib/auth/auth.test.ts` | line 76 の public path 配列から `"/about"` を削除（任意・整合） | 低 | §3 |

## 2. 新規ファイル一覧
なし。

## 3. 削除ファイル一覧
なし（about ページは元々未実装。InfoButton は §9 [論点-001] により残置）。

## 4. マイグレーション要否
- DB スキーマ変更: ❌ / 既存データ変換: ❌ / 設定ファイル変更: ❌ / ストレージパス変更: ❌
- → MIGRATION (Phase 5) 不要。

## 5. 実装 Phase 分割（/flow:tdd 連携）

### Phase 1 (RED→GREEN→IMPROVE)
- 対象: Header.tsx + seo/config.ts + components.test.tsx (U-5) + auth.test.ts
- ゴール:
  1. (RED) U-5 テストを「Header に shipyard + お問い合わせの 2 リンクのみ、`/about` リンクは存在しない」へ修正 → 現実装で失敗
  2. (GREEN) Header.tsx から `/about` リンク削除、seo/config.ts から `/about` 削除
  3. sitemap テスト（seo.test.ts に PUBLIC_PATHS/sitemap 検証があれば）+ auth path テストを整合
  4. 全テスト GREEN（170 → 同数 or U-5 の assertion 数変動のみ）

## 6. 依存関係順序
```
テスト修正 (RED) → Header.tsx + seo/config.ts 削除 (GREEN) → 全テスト GREEN
```

## 7. ロールアウト計画
| ステップ | 内容 | 検証方法 |
|---|---|---|
| 1 | 実装 + 全テスト GREEN | `npm test` |
| 2 | 本番デプロイ | デプロイ後 `https://shipyard.givers.work` の Header に「これは何？」が無い + `/sitemap.xml` に `/about` が無いことを確認 |

## 8. リスク・注意点
- Header は全ページ共通。削除後もレイアウト（`gap-4` / `ml-auto`）が崩れないか視覚確認（「お問い合わせ」が右寄せ維持されるか）。
- `app/sitemap.ts` は `PUBLIC_PATHS` を map するだけなので config 変更で自動反映（追加修正不要）。

## 9. 完了の定義 (DoD)
- [ ] U-5 テスト修正（`/about` リンク非存在を検証）
- [ ] Header.tsx から `/about` リンク削除
- [ ] seo/config.ts PUBLIC_PATHS から `/about` 削除
- [ ] auth.test.ts public path 整合（任意）
- [ ] 全単体テスト GREEN
- [ ] 本番デプロイ後、Header に about 導線が無い + sitemap に `/about` が無い

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-29 | 初版作成 | /flow:revise |
