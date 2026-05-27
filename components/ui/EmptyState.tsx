import { DockIllustration } from "@/components/illustrations/Dock";

// EmptyState — design SoT §5/§8（自作 line-art + 一言）。
// データ 0 / 取得失敗時。技術詳細は出さない（SEC-001、UI-E2）。

export function EmptyState({
  message,
  children,
}: {
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <DockIllustration className="h-24 w-24 text-accent" aria-label="" />
      <p className="text-ink-muted">{message}</p>
      {children}
    </div>
  );
}
