import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/seo/config";

// Footer — design SoT §5（法務リンク + 控えめなメイカー文脈）。
// コピーライト表記は公開ブランド名 SITE_NAME=givers.work（[論点-009] リブランド）。

export function Footer({
  className,
  year,
}: {
  className?: string;
  year?: number;
}) {
  const y = year ?? new Date().getFullYear();
  return (
    <footer className={cn("border-t border-border bg-surface", className)}>
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-ink-muted sm:flex-row sm:items-center">
        <nav className="flex flex-wrap gap-4">
          <a href="/legal/privacy" className="hover:text-ink">
            プライバシー
          </a>
          <a href="/legal/terms" className="hover:text-ink">
            利用規約
          </a>
          <a href="/legal/commerce" className="hover:text-ink">
            特定商取引法に基づく表記
          </a>
        </nav>
        <p className="sm:ml-auto">
          © {y} {SITE_NAME}
        </p>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 pb-6 text-xs text-ink-muted">
        <p>AI 駆動開発で週1ペースに作っています。</p>
        <p>powered by givers.work</p>
      </div>
    </footer>
  );
}
