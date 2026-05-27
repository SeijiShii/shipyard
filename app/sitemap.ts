import type { MetadataRoute } from "next";
import { siteUrl, PUBLIC_PATHS } from "@/lib/seo/config";

// sitemap.xml — 公開ページのみ列挙。admin/api/t は含めない（SEC-002）。
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return PUBLIC_PATHS.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
