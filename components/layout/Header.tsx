import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/seo/config";

// Header — design SoT §5/§7（ワードマーク + お問い合わせ、ミニマル）。
// 「これは何？」(/about) リンクは削除（LP 自体が説明 = O41 は LP Hero で充足、revise_remove-about-link_20260529）。
// ワードマークは公開ブランド名 SITE_NAME=givers.work（[論点-009] リブランド）。

export function Header({ className }: { className?: string }) {
  return (
    <header className={cn("border-b border-border bg-surface", className)}>
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
        <a href="/" className="text-lg font-semibold text-ink">
          {SITE_NAME}
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
