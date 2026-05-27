import { cn } from "@/lib/utils";
import { STATUS_LABEL, STATUS_DOT_CLASS, normalizeStatus } from "@/lib/ui/status";

// StatusBadge — design SoT §5/§6（plain ラベル + 状態色ドット）。
// 色 + 形（ドット）+ ラベルの三重で識別（色覚配慮、U-B2）。

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const s = normalizeStatus(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm bg-primary-subtle px-2 py-0.5 text-sm text-ink",
        className,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", STATUS_DOT_CLASS[s])} aria-hidden="true" />
      {STATUS_LABEL[s]}
    </span>
  );
}
