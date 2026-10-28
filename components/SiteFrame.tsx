import type { CSSProperties } from "react";
import { CookieBanner } from "@/components/layout/consent";
import { DraftBanner } from "@/components/layout/DraftBanner";
import { StickyCallCta } from "@/components/layout/StickyCallCta";
import { fontClassNames } from "@/lib/fonts";
import type { SiteBundle } from "@/lib/site-bundle";
import type { SiteContext } from "@/lib/site-context";
import { tokensToCssVars } from "@/lib/tokens";

/** Rahmen einer Website: setzt die Design-Tokens als CSS-Variablen und trägt die Pflicht-Elemente des Layouts. */
export function SiteFrame({
  bundle,
  ctx,
  children,
}: {
  bundle: SiteBundle;
  ctx: SiteContext;
  children: React.ReactNode;
}) {
  const { site, tokens } = bundle;
  const vars = { ...tokensToCssVars(tokens, site.style), "--draft-h": ctx.isPreview ? "2.25rem" : "0px" };

  return (
    <div
      data-motion={ctx.motion ? "reveal" : undefined}
      style={vars as CSSProperties}
      className={`${fontClassNames(tokens.font_headline, tokens.font_body)} min-h-dvh bg-bg font-body text-ink antialiased`}
    >
      {ctx.isPreview ? <DraftBanner /> : null}
      {children}
      <StickyCallCta phone={site.primary_phone} label={site.primary_cta_label} />
      <CookieBanner basePath={ctx.basePath} hasStickyCta={Boolean(site.primary_phone)} />
    </div>
  );
}
