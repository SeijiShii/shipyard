import { cn } from "@/lib/utils";
import { STATUS_LABEL, STATUS_DOT_CLASS, normalizeStatus, daysSince } from "@/lib/ui/status";

// StatusCard — design SoT §5（[状態ドット] サービス名 … 稼働N日 →、行全体がリンク）。

export interface StatusCardService {
  slug: string;
  name: string;
  url?: string | null;
  status: string;
  since?: string | null;
}

export function StatusCard({
  service,
  now,
  className,
}: {
  service: StatusCardService;
  now?: Date;
  className?: string;
}) {
  const s = normalizeStatus(service.status);
  const days = daysSince(service.since, now);
  const accessibleName = `${service.name} ${STATUS_LABEL[s]}`;

  const content = (
    <>
      <span
        className={cn("h-2.5 w-2.5 shrink-0 rounded-full", STATUS_DOT_CLASS[s])}
        aria-hidden="true"
      />
      <span className="font-medium text-ink">{service.name}</span>
      <span className="ml-auto flex items-center gap-3 text-sm text-ink-muted">
        <span aria-hidden="true">{STATUS_LABEL[s]}</span>
        {days !== null && <span>稼働{days}日</span>}
      </span>
    </>
  );

  const base = "flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3";

  // url 欠落時はリンク化しない（U-E2: 非クリック）。
  if (!service.url) {
    return (
      <div className={cn(base, className)} aria-label={accessibleName}>
        {content}
      </div>
    );
  }

  return (
    <a
      href={service.url}
      aria-label={accessibleName}
      className={cn(
        base,
        "transition-colors hover:bg-surface-subtle",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        className,
      )}
    >
      {content}
    </a>
  );
}
