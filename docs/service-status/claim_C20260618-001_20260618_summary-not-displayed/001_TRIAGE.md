# クレーム判定レポート

**claim id**: C20260618-001
**判定日**: 2026-06-18
**判定者**: Claude (Opus 4.8 1M) + seiji
**対象**: service-status
**判定**: **バグ (fix)**
<!-- ticket-status: routed-to-fix_C20260618-001 | updated: 20260618 -->

## 0. クレーム原文
「givers.work (shipyard) のサービス一覧に各サービスの summary 短文紹介が表示されない。サービス (producer) 側が未実装だからか?」

## 1. 三項照合

### 1.1 期待 (Expected)
givers.work サービス一覧に各サービスの summary 短文紹介が表示される。

### 1.2 既存仕様 (Spec)
- concept §8 [論点-010] (★★★必須): 稼働サービス一覧に summary 短文紹介を表示。
- audit-hittable signal: `lib/hub/contract.ts` に summary + `StatusCard.tsx` が描画 → **この signal は満たされていた** (cbb8bb4)。

### 1.3 現実 (Actual)
- service-hub `/api/public/status`: summary を配信 (**live count=1**、上流 OK)。
- shipyard `/api/services`: summary を**返さない** (**live count=0**)。
- ドロップ箇所: `lib/service-status/api.ts` の `toPublicStatus` + `PublicServiceStatus` 型。`slug/name/url/status/iconUrl` のみ列挙し **summary を含めない**。
- 一方 `statusCache.ts` (DB insert/upsert/select) + `cache.ts` (contract→cache map) + `StatusCard.tsx` (描画) は summary 対応済。
- = summary は DB まで届くが **API シリアライズ (`toPublicStatus`) で落ちる** → client (StatusCard) に届かない → 非表示。

### 1.4 照合結果
期待 = SPEC [論点-010] 記載 ≠ 現実 (toPublicStatus の脱落)。**コード defect = バグ**。cbb8bb4 revise が contract/cache/DB/StatusCard を配線したが **API serialization 層 (`toPublicStatus`) を漏らした**不完全実装。

## 2. 判定根拠
1. 上流 service-hub は summary を配信済 (live 実測 count=1) → producer/上流の問題ではない。
2. shipyard の DB/cache 層は summary 対応済 (insert/select 確認) → 永続化の問題でもない。
3. 唯一 `toPublicStatus` (公開サブセット mapper) が summary を列挙せず脱落 → ここが単一原因。
4. ユーザー仮説「producer 未実装」は副次要因 (bousai/prayer-list/gohoubi は未デプロイ) だが、**emitting + collected な producer の summary すら表示されない**主因はこの shipyard bug。

## 3. 推奨分岐先
- コマンド: `/flow:fix service-status C20260618-001 --severity=medium`
- 修正内容: `PublicServiceStatus` 型に `summary?: string | null` 追加 + `toPublicStatus` mapper に `summary: r.summary ?? null` 追加 + リグレッションテスト (toPublicStatus が summary を通すこと)。

## 4. flow-suite フィードバック (PJ セッションにつき inbox 捕捉のみ)
[論点-010] の audit-hittable signal が「contract.ts summary + StatusCard 描画」止まりで、**`/api/services` の公開サブセット mapper (`toPublicStatus`) を signal に含めなかった**ため audit が PASS したまま summary 脱落を見逃した。consumer-display 観点 (O63/O48 consumer) の required_signals に「公開 API serialization 層も summary を通すこと」を含めるべき。→ command-feedback-inbox に捕捉。
