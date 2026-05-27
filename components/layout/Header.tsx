import { cn } from "@/lib/utils";

// Header — design SoT §5/§7（ワードマーク + 「これは何？」+ お問い合わせ、ミニマル）。

export function Header({ className }: { className?: string }) {
  return (
    <header className={cn("border-b border-border bg-surface", className)}>
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
        <a href="/" className="text-lg font-semibold text-ink">
          shipyard
        </a>
        <a href="/about" className="text-sm text-ink-muted hover:text-ink">
          これは何？
        </a>
        <a
          href="/contact"
          className="ml-auto text-sm text-primary hover:text-primary-hover"
        >
          お問い合わせ
        </a>
      </div>
    </header>
  );
}
