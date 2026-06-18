"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  STATUS_LABEL,
  STATUS_DOT_CLASS,
  normalizeStatus,
  daysSince,
} from "@/lib/ui/status";

// StatusCard — design SoT §5（[icon] [状態ドット] サービス名 … 稼働N日 →、行全体がリンク）。
// service-icons revise: 左端に 32×32 icon (iconUrl あり=画像 / 不在/失敗=イニシャルフォールバック)
// (spec-review D20260528-039: R2 表示集約は StatusCard / R4 alt="" 装飾画像 / D1 単一色 var(--primary-subtle))

export interface StatusCardService {
  slug: string;
  name: string;
  url?: string | null;
  status: string;
  since?: string | null;
  iconUrl?: string | null; // service-icons revise
  summary?: string | null; // summary-projection [論点-010] (HUB 由来の短文紹介、有れば名前下に表示)
}

function ServiceIcon({
  name,
  iconUrl,
}: {
  name: string;
  iconUrl?: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = !!iconUrl && !failed;

  if (showImage) {
    // R4: 装飾画像 alt="" (隣接 text の name が a11y name を担保、WCAG 1.1.1)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={iconUrl as string}
        alt=""
        role="presentation"
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-8 w-8 shrink-0 rounded-lg object-cover"
      />
    );
  }

  // フォールバック: イニシャル 1 文字 (UTF-8 grapheme = Array.from で絵文字対応) + brand teal 薄背景
  // D1 [論点-007] accepted: 単一色 var(--primary-subtle)、design SoT §6 ミニマル路線
  const initial = Array.from(name)[0] ?? "?";
  return (
    <div
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-medium text-primary"
      style={{ backgroundColor: "var(--primary-subtle)" }}
    >
      {initial}
    </div>
  );
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

  // summary-projection [論点-010]: HUB から短文紹介が来ていれば名前の下に表示 (showcase 一覧で「何のサービスか」)。
  const summary = service.summary?.trim() || null;
  const content = (
    <>
      <ServiceIcon name={service.name} iconUrl={service.iconUrl} />
      <span
        className={cn("h-2.5 w-2.5 shrink-0 rounded-full", STATUS_DOT_CLASS[s])}
        aria-hidden="true"
      />
      <span className="flex min-w-0 flex-col">
        <span className="font-medium text-ink">{service.name}</span>
        {summary && (
          <span className="line-clamp-2 text-sm text-ink-muted">{summary}</span>
        )}
      </span>
      <span className="ml-auto flex shrink-0 items-center gap-3 text-sm text-ink-muted">
        <span aria-hidden="true">{STATUS_LABEL[s]}</span>
        {days !== null && <span>稼働{days}日</span>}
      </span>
    </>
  );

  const base =
    "flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3";

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
