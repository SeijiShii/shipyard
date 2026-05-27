import { siteUrl, SITE_NAME, MAKER_NAME } from "./config";

// 構造化データ(JSON-LD) — docs/_shared/seo/001_seo_SPEC.md §1/§2
// schema.org の plain object を返す（<script type="application/ld+json"> に埋め込む）。

const CONTEXT = "https://schema.org";

export function websiteJsonLd() {
  return { "@context": CONTEXT, "@type": "WebSite", name: SITE_NAME, url: siteUrl() };
}

export function personJsonLd(name: string = MAKER_NAME) {
  return { "@context": CONTEXT, "@type": "Person", name, url: siteUrl() };
}

export function organizationJsonLd() {
  return { "@context": CONTEXT, "@type": "Organization", name: SITE_NAME, url: siteUrl() };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const base = siteUrl();
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${base}${it.path}`,
    })),
  };
}
