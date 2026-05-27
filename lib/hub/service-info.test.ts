import { describe, it, expect } from "vitest";
import { serviceInfoPayload, isAuthorizedHub } from "./service-info";

// O48: service-info の最小固定契約 + 共有シークレット認証

describe("serviceInfoPayload", () => {
  it("最小固定契約（schemaVersion/service/status/generatedAt）", () => {
    const now = new Date("2026-05-27T12:00:00Z");
    const p = serviceInfoPayload(now);
    expect(p).toEqual({
      schemaVersion: 1,
      service: "shipyard",
      status: "up",
      generatedAt: "2026-05-27T12:00:00.000Z",
    });
  });

  it("version は optional（指定時のみ含む）", () => {
    expect(serviceInfoPayload(new Date(), "0.1.0").version).toBe("0.1.0");
    expect(serviceInfoPayload(new Date())).not.toHaveProperty("version");
  });
});

describe("isAuthorizedHub", () => {
  it("正しい HUB_SHARED_SECRET → true", () => {
    expect(isAuthorizedHub("Bearer hub_secret", "hub_secret")).toBe(true);
  });
  it("不一致/欠落/secret 未設定 → false", () => {
    expect(isAuthorizedHub("Bearer wrong", "hub_secret")).toBe(false);
    expect(isAuthorizedHub(null, "hub_secret")).toBe(false);
    expect(isAuthorizedHub("Bearer x", undefined)).toBe(false);
  });
});
