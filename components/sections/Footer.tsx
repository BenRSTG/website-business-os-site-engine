import { ConsentReopenButton } from "@/components/layout/consent";
import { telHref } from "@/lib/content/links";
import { resolveHref } from "@/lib/site-context";
import type { SectionProps } from "./types";

export function Footer({ section, ctx }: SectionProps<"footer">) {
  const { content } = section;
  const link = "text-ink/80 no-underline hover:text-ink hover:underline underline-offset-4";

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="heading text-2xl">{content.company_name}</p>
          {content.tagline ? <p className="mt-2 max-w-xs text-muted">{content.tagline}</p> : null}
          {content.address ? <p className="mt-4 whitespace-pre-line text-sm">{content.address}</p> : null}
          <p className="mt-2 text-sm">
            {content.phone ? (
              <a href={telHref(content.phone)} className={link}>
                {content.phone}
              </a>
            ) : null}
            {content.phone && content.email ? " · " : null}
            {content.email ? (
              <a href={`mailto:${content.email}`} className={link}>
                {content.email}
              </a>
            ) : null}
          </p>
        </div>

        <nav aria-label="Seiten">
          <p className="eyebrow">Seiten</p>
          <ul className="mt-4 space-y-2 text-sm">
            {content.links.map((l) => (
              <li key={l.href + l.label}>
                <a href={resolveHref(l.href, ctx.basePath)} className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {content.social?.length ? (
          <nav aria-label="Soziale Netzwerke">
            <p className="eyebrow">Folgen</p>
            <ul className="mt-4 space-y-2 text-sm">
              {content.social.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : (
          <div />
        )}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-5 text-sm text-muted sm:px-8">
          <p>© {content.company_name}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {content.legal_links.map((l) => (
              <li key={l.href}>
                <a href={resolveHref(l.href, ctx.basePath)} className="text-muted no-underline hover:text-ink hover:underline underline-offset-4">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <ConsentReopenButton className="text-muted hover:text-ink" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
