import { ImageResponse } from "next/og";
import { ogTitle, OG_SIZE } from "@/lib/seo/og";

// 動的 OG 画像 — docs/_shared/seo/001_seo_SPEC.md §2（Ink & Teal、1200×630）。
// pixel 検証は Phase 3 視覚レビュー（純粋ロジックは lib/seo/og.ts で unit）。
export const runtime = "edge";

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = ogTitle(searchParams.get("title"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#FAF9F6",
          color: "#1E2722",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 600, lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 28, color: "#0E7C72", marginTop: 24 }}>shipyard</div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
