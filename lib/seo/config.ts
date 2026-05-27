// SEO 基盤の設定 — docs/_shared/seo/001_seo_SPEC.md
// 秘密ではない公開設定。SITE_URL は env から（未設定時は安全なデフォルト）。

export const SITE_NAME = "shipyard";

export const DEFAULT_DESCRIPTION =
  "週1ペースで作っている、動いているサービスたち。個人開発のマイクロサービスの今をまとめた場所です。AI 駆動開発のご相談も承ります。";

// メイカー名義（JSON-LD Person）。最終的な表記は /flow:wording で調整。
export const MAKER_NAME = "shipyard";

// 公開ページ（sitemap 対象）。/admin /api /t/[token] は含めない（SEC-002 / プライバシー）。
export const PUBLIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
] as const;

// 末尾スラッシュを正規化した SITE_URL（U-B2）。env を呼び出し時に読む（テストで注入可）。
export function siteUrl(): string {
  const raw = process.env.SITE_URL ?? "https://shipyard.example.com";
  return raw.replace(/\/+$/, "");
}
