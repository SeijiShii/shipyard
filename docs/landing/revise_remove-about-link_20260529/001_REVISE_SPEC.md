# landing 変更仕様書（Header の壊れた「これは何？」(/about) リンク削除）

> **改修種別**: 機能変更（不要ナビ要素の削除 + 壊れ参照の解消）
> **issue / slug**: remove-about-link
> **基準 SPEC**: `../001_landing_SPEC.md`
> **最終更新**: 2026-05-29
> **タグ**: public-facing / SEO-relevant

---

## 1. 変更概要

Header の「これは何？」リンクが存在しない `/about` を指し **404** になっている。`/about` ページは未実装で、サイトの説明は **LP 本体（Hero + 価値セクション + コンサルピッチ）自体が担っている**ため、別 about ページは冗長。よって **Header の `/about` リンクと sitemap の `/about` エントリを削除**する（about ページは作らない）。

## 2. 変更前 vs 変更後

### 2.1 UC 変更
| UC ID | 変更前 | 変更後 | 理由 |
|---|---|---|---|
| UC-6 (検索/SNS 流入) | Header に「これは何？」→ `/about` (404) | Header は「shipyard」+「お問い合わせ」のみ。「これは何？」理解は LP Hero が担う | /about 未実装で 404、LP 自体が説明 (O41 充足) |

### 2.2 入出力変更
| 対象 | 変更前 | 変更後 | 互換性 |
|---|---|---|---|
| `GET /about` | リンク存在だが 404 (ページ無) | リンク削除 (404 導線を解消) | 改善 (壊れ導線の除去) |
| `GET /sitemap.xml` | `/about` を含む (404 ページを sitemap に掲載 = SEO 不適切) | `/about` を除外 | 改善 |
| Header コンポーネント | `shipyard` / `これは何？`(→/about) / `お問い合わせ` | `shipyard` / `お問い合わせ` | UI 変更 (ナビ 1 項目削減) |

### 2.3 データモデル変更
なし（DB 非関与、マイグレーション不要）。

### 2.4 バリデーション・エラー変更
なし。

## 3. 影響範囲

| 対象 | 影響度 | 説明 |
|---|---|---|
| `components/layout/Header.tsx` | 高 | `/about` リンク行を削除（全ページ共通 Header） |
| `lib/seo/config.ts` (PUBLIC_PATHS) | 中 | `/about` を sitemap 対象から除去 → `app/sitemap.ts` が自動反映 |
| `components/components.test.tsx` (U-5) | 中 | Header の「これは何？」リンク assertion を削除 |
| `lib/auth/auth.test.ts` | 低 | public path リストの `/about` を除去（任意・整合） |
| O41「これは何？」理解 | — | **LP Hero 内容で充足**（"個人開発のマイクロサービスを公開しています…"）。`InfoButton` は別途存在するが現状未配置 (§9 注記) |

## 4. 後方互換性

- **互換維持**: ✅（削除対象は壊れていた導線。既存の正常動線に影響なし）
- 非互換変更なし。`/about` をブックマーク/外部リンクしているユーザーは存在しない（元々 404 のため）。

## 5. ロールバック方針

- **コード revert で戻せる**: ✅（Header.tsx + seo/config.ts + テストの revert のみ、DB 非関与）
- DB マイグレーションのロールバック: 無（DB 変更なし）

## 6. リリース戦略

- **方式**: 一括（軽微な UI/SEO 修正、フィーチャーフラグ不要）
- 本番反映: 次回 Vercel デプロイ（main push → 自動デプロイ or `vercel deploy --prod`）。本番 `https://shipyard.givers.work` の 404 導線が解消される。

## 7. 詳細仕様（新仕様）

### 7.1 詳細 UC（新仕様）
- **Header**: ワードマーク `shipyard`（→ `/`）+ `お問い合わせ`（→ `/contact`）の 2 リンクのみ。「これは何？」ナビは削除。
- **「これは何？」理解 (O41)**: LP トップ（`app/page.tsx` の Hero）が冷たい流入者に対し即座にサイトの正体を説明（変更なし、既存で充足）。

### 7.2〜7.4
変更なし（入出力/データモデル/バリデーションは Header リンク削除と sitemap 除外のみ）。

### 7.5 機能固有 NFR + 連携（新仕様）
- SEO: sitemap から 404 ページ (`/about`) を除外 = クロール健全性向上。concept §3 と矛盾なし。

## 8. タグ別追加項目
- **public-facing**: 本番稼働中サイトの修正のため、デプロイで即反映。
- **SEO-relevant**: sitemap.xml の正確性向上（存在ページのみ列挙、SEC-002 の admin/api/t 除外方針は維持）。

## 9. 未決事項

### [論点-001] orphaned な InfoButton (O41 コンポーネント) の扱い
- **影響範囲**: `components/ui/InfoButton.tsx`（O41「これは何？」モーダル、ビルド済だがどこにも未配置）
- **詰めるべき問い**: 未配置の InfoButton を (a) 残置（将来配置の余地）/ (b) dead code として別途削除 / (c) Header に配置して明示的 O41 アフォーダンスにする、のいずれにするか
- **候補案**: 本改修ではユーザー方針（「LP 自体が説明 = about 不要」）に沿い **(a) 残置**（O41 は LP Hero で充足済、InfoButton 削除/配置は別タスク）。
- **推奨**: (a) 残置（本改修スコープ外、非ブロッキング）。dead code 整理が必要なら別 revise/refactor で。
- **判断期限**: 任意（本改修の完了をブロックしない）
- **担当**: seiji

## 10. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-29 | 初版作成（about リンク 404 解消 = リンク + sitemap エントリ削除） | /flow:revise |
