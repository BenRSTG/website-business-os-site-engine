import "server-only";
import { createClient } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";
import { env } from "./env";
import { parseSiteKey } from "./routing";
import type { PageRow, SiteBundle, SiteRow } from "./site-bundle";
import { STYLE_PRESETS, designTokensSchema, type DesignTokens } from "./tokens";

// Ausdrücklich nur die Spalten, die der anon key lesen darf — `select *` wäre durch die Spaltenrechte verboten
// (Passwort-Hash, Organisation, Lead-Bezug und KI-Kosten sind für anon gesperrt, siehe Migration 0007).
const SITE_COLUMNS =
  "id, company_name, style, status, preview_slug, preview_protected, preview_expires_at, custom_domain, primary_phone, primary_cta_label";

/**
 * Lädt Website, Design-Tokens und Seiten für einen Schlüssel ("slug:<x>" oder "host:<domain>").
 * Gecacht und per Tag "site:<key>" invalidierbar (Revalidierung durch das Dashboard folgt mit Milestone 5).
 */
export async function loadSiteBundle(key: string): Promise<SiteBundle | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`site:${key}`);

  const lookup = parseSiteKey(key);
  if (!lookup) return null;

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Row-Level-Security entscheidet, was sichtbar ist (LIVE oder nicht abgelaufene PREVIEW). Kundendomains zeigen
  // zusätzlich nur LIVE-Sites.
  let query = supabase.from("sites").select(SITE_COLUMNS);
  query =
    lookup.kind === "slug"
      ? query.eq("preview_slug", lookup.value)
      : query.eq("custom_domain", lookup.value).eq("status", "LIVE");
  const { data: site, error: siteError } = await query.maybeSingle();
  if (siteError) throw new Error(`Website konnte nicht geladen werden: ${siteError.message}`);
  if (!site) return null;

  const [pages, tokenRow] = await Promise.all([
    supabase.from("site_pages").select("slug, page_type, sections, seo").eq("site_id", site.id),
    supabase.from("design_tokens").select("*").eq("site_id", site.id).maybeSingle(),
  ]);
  if (pages.error) throw new Error(`Seiten konnten nicht geladen werden: ${pages.error.message}`);
  if (tokenRow.error) throw new Error(`Design konnte nicht geladen werden: ${tokenRow.error.message}`);

  const row = site as unknown as SiteRow;
  const parsed = designTokensSchema.safeParse(tokenRow.data);
  let tokens: DesignTokens;
  if (parsed.success) {
    tokens = parsed.data;
  } else {
    // Ungültige oder fehlende Tokens dürfen die Website nicht lahmlegen: es greift die Voreinstellung des Stils.
    console.error(`Ungültige Design-Tokens für Site ${row.id}:`, parsed.error.issues[0]?.message);
    tokens = STYLE_PRESETS[row.style];
  }

  return { site: row, tokens, pages: (pages.data ?? []) as PageRow[] };
}
