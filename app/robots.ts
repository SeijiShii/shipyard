import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/config";

// robots.txt — 公開ページは index 許可、運用者/API/スレッド token は除外（SEC-002）。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/t/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
