import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "shipyard",
  description:
    "週1ペースで作っている、動いているサービスたち。個人開発のマイクロサービスの今をまとめた場所です。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
