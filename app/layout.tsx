import type { Metadata } from "next";
import "./globals.css";
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo/config";

// description は lib/seo/config の DEFAULT_DESCRIPTION から (revise messaging-shift_20260528 反映、DRY)
// page.tsx の generateMetadata も同 SoT 経由のため、layout.tsx もここで合わせる
export const metadata: Metadata = {
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* suppressHydrationWarning: ブラウザ拡張 (ColorZilla の cz-shortcut-listen 等) が <body> に
          attribute を追加することによる false-positive hydration warning を抑制。アプリ自身の
          hydration mismatch は別途検出される (子要素には伝播しない最小限の適用)。 */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
