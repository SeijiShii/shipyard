import * as React from "react";

// 自作 SVG line-art（design SoT §8）。モチーフ = 船渠/ドック（shipyard）。
// stroke=currentColor でテーマ色追従（teal-tint は text-accent 等で付与）。絵文字は使わない。

export function DockIllustration({
  "aria-label": ariaLabel = "ドックのイラスト",
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      role="img"
      aria-label={ariaLabel}
      {...props}
    >
      {/* 水面 */}
      <path d="M6 70 H90" strokeLinecap="round" />
      <path d="M12 78 H84" strokeLinecap="round" opacity="0.5" />
      {/* ドック / クレーン */}
      <path d="M20 70 V32 H42" strokeLinejoin="round" />
      <path d="M42 32 L62 26" strokeLinecap="round" />
      <path d="M42 32 V44" />
      {/* 船体 */}
      <path d="M30 62 H74 L68 70 H36 Z" strokeLinejoin="round" />
      <path d="M52 62 V50 H66 L62 62" strokeLinejoin="round" />
    </svg>
  );
}
