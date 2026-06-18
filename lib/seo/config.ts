// SEO 基盤の設定 — docs/_shared/seo/001_seo_SPEC.md
// 秘密ではない公開設定。SITE_URL は env から（未設定時は安全なデフォルト）。

// 公開ブランド名 = givers.work（[論点-009] リブランド、2026-06-10）。
// 「shipyard」は内部コードネーム。ユーザー向け表示・SEO title・OGP は givers.work に統一する。
export const SITE_NAME = "givers.work";

// メッセージング転換 (revise_messaging-shift_20260528、AI_LOG D20260528-001/004) — スタンスキーワード保持。
export const DEFAULT_DESCRIPTION =
  "動いているサービス群と、AI 駆動開発の実践実績。正解の見えない時代に、共に考え・共に悩む相談相手を探している方へ。";

// メイカー名義（JSON-LD Person）。最終的な表記は /flow:wording で調整。
export const MAKER_NAME = "shipyard";

// 公開ページ（sitemap 対象）。/admin /api /t/[token] は含めない（SEC-002 / プライバシー）。
export const PUBLIC_PATHS = [
  "/",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/legal/commerce",
] as const;

// 末尾スラッシュを正規化した SITE_URL（U-B2）。env を呼び出し時に読む（テストで注入可）。
export function siteUrl(): string {
  const raw = process.env.SITE_URL ?? "https://shipyard.example.com";
  return raw.replace(/\/+$/, "");
}
