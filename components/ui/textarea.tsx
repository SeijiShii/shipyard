import * as React from "react";
import { cn } from "@/lib/utils";

// Textarea — design SoT §5（問い合わせフォーム本文用）。

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-sm border border-border bg-surface px-3 py-2 text-ink",
      "placeholder:text-ink-muted",
      "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
