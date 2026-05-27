import { ClerkProvider } from "@clerk/nextjs";

// admin 配下のみ Clerk を読み込む（訪問者ページは Clerk 非依存、公開分離 D004）。
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
