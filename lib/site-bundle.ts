import type { DesignTokens, SiteStyle } from "./tokens";

export interface SiteRow {
  id: string;
  company_name: string;
  style: SiteStyle;
  status: "PREVIEW" | "LIVE";
  preview_slug: string | null;
  preview_protected: boolean;
  preview_expires_at: string | null;
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
