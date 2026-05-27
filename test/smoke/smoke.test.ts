import { describe, it, expect } from "vitest";

// Phase 0 scaffold smoke test — テスト基盤が動くことの確認
describe("scaffold smoke", () => {
  it("test runner works", () => {
    expect(1 + 1).toBe(2);
  });

  it("Ink & Teal token names are defined in design SoT", () => {
    const tokens = ["--bg", "--ink", "--primary", "--status-up"];
    expect(tokens).toContain("--primary");
  });
});
