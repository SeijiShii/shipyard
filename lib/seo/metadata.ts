import type { Metadata } from "next";
import { siteUrl, SITE_NAME, DEFAULT_DESCRIPTION } from "./config";

// buildMetadata — docs/_shared/seo/001_seo_SPEC.md §2
// title/description/canonical/OGP/Twitter Card を構築。noindex でクローラ除外（/t/[token] 等）。

export interface BuildMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function buildMetadata(input: BuildMetadataInput = {}): Metadata {
  const { title, description, path = "/", ogImage, noindex } = input;
  const base = siteUrl();
  const url = `${base}${path}`;
  const desc = description ?? DEFAULT_DESCRIPTION; // SEO-E1 フォールバック
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const og =
    ogImage ?? `${base}/og?title=${encodeURIComponent(title ?? SITE_NAME)}`;

  return {
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [og],
    },
    // SEC-002: token ページ等は検索/SNS に拾わせない（U-E2）。
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
