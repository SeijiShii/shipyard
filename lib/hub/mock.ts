import type { PublicStatusResponse } from "./contract";

// モック contract — [論点-001] HUB 未実装の間の dev 用（HUB-E4）。
// 実 HUB 確定後は env URL 切替のみで本物に差し替わる。
export const MOCK_HUB_STATUS: PublicStatusResponse = {
  generated_at: "2026-05-27T00:00:00Z",
  services: [
    {
      slug: "example-a",
      name: "Example Service A",
      url: "https://a.example.com",
      status: "up",
      since: "2026-01-15",
    },
    {
      slug: "example-b",
      name: "Example Service B",
      url: "https://b.example.com",
      status: "unknown",
    },
  ],
};
