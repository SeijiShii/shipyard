"use client";
import * as React from "react";
import { HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

// InfoButton（O41「これは何？」導線）— design SoT §5/§7。
// サブページ単体流入時の保険。丸付き「?」+ 軽量モーダル。lucide アイコン（絵文字不使用）。

export function InfoButton({
  label = "これは何？",
  title = "このサイトについて",
  children,
  className,
}: {
  label?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-ink-muted",
          "hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          className,
        )}
      >
        <HelpCircle className="h-4 w-4" aria-hidden="true" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-surface p-6 shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-semibold text-ink">{title}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="閉じる"
                className="text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-3 text-ink-muted">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}
