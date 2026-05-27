import { cn } from "@/lib/utils";

// ProgressFeedback（O45）— design SoT §5。
// 非同期の段階文言 + 軽い動き。current に連動（嘘進捗・わざと遅延は禁止）。

export function ProgressFeedback({
  stages,
  current,
  className,
}: {
  stages: string[];
  current: number;
  className?: string;
}) {
  if (stages.length === 0) return null;
  const idx = Math.max(0, Math.min(current, stages.length - 1));
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-3 text-sm text-ink-muted", className)}
    >
      <span className="h-3 w-3 animate-pulse rounded-full bg-primary" aria-hidden="true" />
      <span>{stages[idx]}</span>
    </div>
  );
}
