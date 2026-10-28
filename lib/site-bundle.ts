import type { DesignTokens, SiteStyle } from "./tokens";

export interface SiteRow {
  id: string;
  company_name: string;
  style: SiteStyle;
  /** Paket: Basis (STARTER), Profi (BUSINESS), Premium (BUSINESS_PLUS) — Premium schaltet Bewegung ein */
  package: "STARTER" | "BUSINESS" | "BUSINESS_PLUS";
  status: "PREVIEW" | "LIVE";
  preview_slug: string | null;
  preview_protected: boolean;
  preview_expires_at: string | null;
  preview_password_set_at: string | null;
  custom_domain: string | null;
  primary_phone: string | null;
  primary_cta_label: string;
}

export interface PageRow {
  slug: string;
  page_type: string;
  sections: unknown;
  seo: unknown;
}

export interface SiteBundle {
  site: SiteRow;
  tokens: DesignTokens;
  pages: PageRow[];
}

const SEGMENT = /^[a-z0-9-]+$/;

/** Pfad-Segmente der Route → Seiten-Slug ("/leistungen"); null, wenn ein Segment kein gültiger Slug-Teil ist. */
export function slugFromPath(segments: string[] | undefined): string | null {
  if (!segments || segments.length === 0) return "/";
  const clean = segments.map((s) => s.toLowerCase());
  return clean.every((s) => SEGMENT.test(s)) ? `/${clean.join("/")}` : null;
}

export function findPage(bundle: SiteBundle, slug: string): PageRow | undefined {
  return bundle.pages.find((p) => p.slug === slug);
}

/** Cache-Schlüssel einer Website: nur nach Vorschau-Adresse oder Domain, damit eine Aktualisierung alle Zugriffsarten leert. */
export function siteTag(value: string): string {
  return `site:${value}`;
}
