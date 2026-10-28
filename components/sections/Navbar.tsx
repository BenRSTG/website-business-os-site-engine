import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/cn";
import { resolveHref } from "@/lib/site-context";
import type { SectionProps } from "./types";

function MenuIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-6 fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Navbar({ section, ctx }: SectionProps<"navbar">) {
  const { content, variant } = section;
  const cta = content.cta_label && content.cta_href ? { label: content.cta_label, href: content.cta_href } : null;
  const linkClass = "text-[0.95rem] font-medium text-ink/85 no-underline hover:text-ink hover:underline underline-offset-4";

  const links = content.links.map((link) => (
    <a key={link.href + link.label} href={resolveHref(link.href, ctx.basePath)} className={linkClass}>
      {link.label}
    </a>
  ));

  const mobileMenu = (
    <details className="group relative md:hidden">
      <summary
        aria-label="Menü öffnen"
        className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-box border border-line [&::-webkit-details-marker]:hidden"
      >
        <MenuIcon />
      </summary>
      <div className="absolute right-0 z-40 mt-2 flex w-64 flex-col gap-1 rounded-box border border-line bg-bg p-3 shadow-[0_12px_40px_rgb(0_0_0/0.2)]">
        {content.links.map((link) => (
          <a
            key={link.href + link.label}
            href={resolveHref(link.href, ctx.basePath)}
            className="rounded-box px-3 py-3 text-base font-medium text-ink no-underline hover:bg-surface"
          >
            {link.label}
          </a>
        ))}
        {cta ? (
          <Button href={cta.href} base={ctx.basePath} className="mt-2">
            {cta.label}
          </Button>
        ) : null}
      </div>
    </details>
  );

  const logo = (
    <a href={resolveHref("/", ctx.basePath)} className="heading text-xl text-ink no-underline sm:text-2xl">
      {content.logo_text}
    </a>
  );

  return (
    <header className="sticky top-[var(--draft-h,0px)] z-30 border-b border-line bg-bg/92 backdrop-blur">
      {variant === "centered" ? (
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-center justify-between py-3 md:justify-center md:pb-1 md:pt-5">
            {logo}
            <div className="md:hidden">{mobileMenu}</div>
          </div>
          <nav aria-label="Hauptnavigation" className="hidden items-center justify-center gap-8 pb-4 pt-2 md:flex">
            {links}
            {cta ? (
              <Button href={cta.href} base={ctx.basePath} className="ml-2 !min-h-10 !px-5 !py-2 text-sm">
                {cta.label}
              </Button>
            ) : null}
          </nav>
        </div>
      ) : (
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          {logo}
          <nav aria-label="Hauptnavigation" className={cn("hidden items-center gap-8 md:flex")}>
            {links}
          </nav>
          <div className="flex items-center gap-3">
            {cta ? (
              <Button href={cta.href} base={ctx.basePath} className="hidden !min-h-10 !px-5 !py-2 text-sm md:inline-flex">
                {cta.label}
              </Button>
            ) : null}
            {mobileMenu}
          </div>
        </div>
      )}
    </header>
  );
}
