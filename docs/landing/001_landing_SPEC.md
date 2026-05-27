# landing 機能仕様書

> **役割**: LP（提供価値 / メイカー紹介 / AI コンサル打ち出し / 入口の「これは何？」理解）。トップページ。
> **タグ**: feature
> **最終更新**: 2026-05-27
> **入力**: `../concept.md` §1.1 UC1/3/6 / §4.8 / §4.2, `../design/design-system.md`, `./README.md`

---

## 1. 詳細 UC（画面別フロー）

### UC-L1: トップで「何のサイトか」を理解する（concept §1.1 #1/#6、O41）
- **トリガー**: 検索/SNS/直リンクで `/` に到達
- **前提**: 認証なし
- **処理**: ヒーロー（リード文）→ 稼働一覧（service-status 埋め込み）→ 提供価値 → コンサル打ち出し → フッタ
- **出力**: 初見でも「動いているサービスの一覧 + AI 駆動開発のメイカー + 相談できる」が伝わる（O41）
- **例外**: 稼働一覧取得不可 → service-status 側 graceful（EmptyState）

### UC-L2: コンサルに興味を持ち問い合わせへ進む（concept §1.1 #3→#4）
- **処理**: 「ご相談はこちら」CTA → `/contact`（inquiry）へ遷移
- **出力**: inquiry フォームへ。CTA は煽らない控えめトーン（charter §2.2 / O31）

## 2. 入出力

### 2.1 ページ
| パス | 種別 | 内容 |
|---|---|---|
| `/` | SSG/ISR | ヒーロー + 稼働一覧（service-status component）+ 価値 + コンサル + フッタ |

### 2.2 副作用
なし（表示のみ）。稼働一覧データは service-status（getCachedStatus）から。

## 3. データモデル
新規なし。service_status_cache を service-status 経由で読むのみ。

## 4. バリデーション + エラーケース
| ID | 条件 | 振る舞い |
|---|---|---|
| L-E1 | 稼働一覧 0 件/取得不可 | EmptyState（「準備中」、技術詳細を出さない） |

## 5. 機能固有 NFR + 連携
| 項目 | 目標 | 根拠 |
|---|---|---|
| LCP | < 2.5s（SSG/ISR、画像最適化） | concept §3 SEO/性能 |
| OGP | buildMetadata + 動的 OG（_shared/seo） | §4.8.5 |
| トーン | 誠実・控えめ、一般向け（技術用語なし） | design SoT §6, O38 |
- 連携: _shared/ui（Header/Footer/Button/StatusCard）/ _shared/seo（metadata/JSON-LD/OG）/ service-status（稼働一覧 component）/ inquiry（CTA 遷移先）

## 6. タグ別追加
feature（UI）。視覚レビュー（O34）+ 入口理解（O41）+ コピー（O38/O42）は §E2E §5 + Phase 3 design --review-only。

## 7. スコープ外
- ブログ記事一覧（note 外部、§4.8）
- 多言語

## 8. 未決事項
現時点で論点なし (2026-05-27)。
> リード文の具体文言は `/flow:wording`（O42）で仕上げ。design SoT §7 のリード文案を起点。

## 9. 更新履歴
| 日付 | 変更概要 | 実行者 |
|---|---|---|
| 2026-05-27 | 初版作成 | /flow:feature |
