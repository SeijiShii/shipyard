import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildMetadata } from "./metadata";
import { websiteJsonLd, personJsonLd, breadcrumbJsonLd } from "./jsonld";
import { ogTitle, OG_SIZE } from "./og";
import { siteUrl, PUBLIC_PATHS } from "./config";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

// docs/_shared/seo/003_seo_UNIT_TEST.md — buildMetadata / JSON-LD / sitemap / robots / OG ロジック

const origSiteUrl = process.env.SITE_URL;
beforeEach(() => {
  process.env.SITE_URL = "https://shipyard.test";
});
afterEach(() => {
  process.env.SITE_URL = origSiteUrl;
});

describe("config.siteUrl (U-B2)", () => {
  it("末尾スラッシュを正規化", () => {
    process.env.SITE_URL = "https://shipyard.test/";
    expect(siteUrl()).toBe("https://shipyard.test");
    process.env.SITE_URL = "https://shipyard.test///";
    expect(siteUrl()).toBe("https://shipyard.test");
  });
});

describe("buildMetadata (U-1, U-E1, U-E2)", () => {
  it("U-1: title/description/canonical/og/twitter", () => {
    const m = buildMetadata({
      title: "稼働状況",
      description: "今の様子",
      path: "/status",
    });
    expect(m.title).toBe("稼働状況 — givers.work");
    expect(m.description).toBe("今の様子");
    expect(m.alternates?.canonical).toBe("https://shipyard.test/status");
    expect((m.openGraph as { url?: string })?.url).toBe(
      "https://shipyard.test/status",
    );
    expect((m.twitter as { card?: string })?.card).toBe("summary_large_image");
  });

  it("U-E1: description 未指定でデフォルトにフォールバック", () => {
    const m = buildMetadata({ title: "x", path: "/" });
    expect(typeof m.description).toBe("string");
    expect((m.description as string).length).toBeGreaterThan(10);
  });

  it("U-E2: noindex で index:false, follow:false", () => {
    const m = buildMetadata({
      title: "スレッド",
      path: "/t/abc",
      noindex: true,
    });
    expect(m.robots).toEqual({ index: false, follow: false });
  });

  it("noindex でない場合 robots は付与されない", () => {
    const m = buildMetadata({ path: "/" });
    expect(m.robots).toBeUndefined();
  });

  it("title なしは SITE_NAME のみ", () => {
    const m = buildMetadata({ path: "/" });
    expect(m.title).toBe("givers.work");
  });
});

describe("jsonld (U-2)", () => {
  it("WebSite/Person は妥当な @context/@type", () => {
    const w = websiteJsonLd();
    expect(w["@context"]).toBe("https://schema.org");
    expect(w["@type"]).toBe("WebSite");
    expect(w.url).toBe("https://shipyard.test");
    const p = personJsonLd("作者名");
    expect(p["@type"]).toBe("Person");
    expect(p.name).toBe("作者名");
  });

  it("BreadcrumbList は position と item URL を組む", () => {
    const b = breadcrumbJsonLd([
      { name: "ホーム", path: "/" },
      { name: "利用規約", path: "/terms" },
    ]);
    expect(b["@type"]).toBe("BreadcrumbList");
    expect(b.itemListElement).toHaveLength(2);
    expect(b.itemListElement[1]).toMatchObject({
      position: 2,
      name: "利用規約",
      item: "https://shipyard.test/terms",
    });
  });
});

describe("sitemap (U-3)", () => {
  it("公開ページを列挙し、admin/api/t を含まない", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://shipyard.test/");
    expect(urls.length).toBe(PUBLIC_PATHS.length);
    expect(urls.some((u) => /\/admin|\/api|\/t\//.test(u))).toBe(false);
  });
});

describe("robots (U-4)", () => {
  it("admin/api/t を disallow + sitemap を指す", () => {
    const r = robots();
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rule?.disallow).toEqual(
      expect.arrayContaining(["/admin", "/api", "/t/"]),
    );
    expect(r.sitemap).toBe("https://shipyard.test/sitemap.xml");
  });
});

describe("og.ogTitle (U-B1)", () => {
  it("長文は切り詰め、Unicode で崩れない", () => {
    expect(OG_SIZE).toEqual({ width: 1200, height: 630 });
    expect(ogTitle("短い")).toBe("短い");
    expect(ogTitle(null)).toBe("givers.work");
    expect(ogTitle("   ")).toBe("givers.work");
    const long = "あ".repeat(200);
    const out = ogTitle(long, 80);
    expect(out.length).toBe(80);
    expect(out.endsWith("…")).toBe(true);
  });
});
