// 動的 OG 画像の純粋ロジック — docs/_shared/seo/001_seo_SPEC.md §2
// レンダリング（next/og ImageResponse）は app/og/route.tsx 側。本ファイルは
// タイトル整形（U-B1）+ サイズ定数を提供し、unit でテストする（pixel 検証は Phase 3 視覚）。

export const OG_SIZE = { width: 1200, height: 630 } as const;

export function ogTitle(raw: string | null | undefined, max = 80): string {
  const t = (raw ?? "").trim() || "shipyard";
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}
