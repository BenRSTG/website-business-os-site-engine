export interface SiteContext {
  /** "" auf eigener Domain/Subdomain, "/preview/<slug>" beim Pfad-Fallback, "/dev/<stil>" in der Entwickler-Vorschau */
  basePath: string;
  isPreview: boolean;
  companyName: string;
  /** Einblend-Animationen (nur Premium) */
  motion: boolean;
}

/** Interne Pfade bekommen den Basis-Pfad vorangestellt, alles andere (Anker, https, tel:, mailto:) bleibt unverändert. */
export function resolveHref(href: string, basePath: string): string {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return href === "/" ? basePath || "/" : `${basePath}${href}`;
  }
  return href;
}

export function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}
