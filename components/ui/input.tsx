import * as React from "react";
import { cn } from "@/lib/utils";

// Input — design SoT §5（1px border、focus で focus-ring）。

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
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
Input.displayName = "Input";
