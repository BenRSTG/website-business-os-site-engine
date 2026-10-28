// Erzeugt ../dashboard/supabase/seed-demo-sites.sql aus den Beispieldaten im Code (lib/fixtures/demo-site.ts).
// Aufruf: npm run seed:demo
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildDemoBundle } from "../lib/fixtures/demo-site";
import { SITE_STYLES } from "../lib/tokens";

const json = (value: unknown) => {
  const text = JSON.stringify(value);
  if (text.includes("$j$")) throw new Error("Unzulässige Zeichenfolge in den Beispieldaten");
  return `$j$${text}$j$::jsonb`;
};
const lit = (value: string | null) => (value === null ? "null" : `'${value.replace(/'/g, "''")}'`);

const slugs = SITE_STYLES.map((s) => buildDemoBundle(s).site.preview_slug as string);
const blocks = SITE_STYLES.map((style) => {
  const b = buildDemoBundle(style);
  const t = b.tokens;
  const pages = b.pages
    .map(
      (p) =>
        `    insert into site_pages (site_id, slug, page_type, sections, seo)\n    values (v_site, ${lit(p.slug)}, ${lit(p.page_type)}::page_type, ${json(p.sections)}, ${json(p.seo)});`,
    )
    .join("\n");
  return `  -- Stil: ${style}
  insert into sites (organization_id, lead_id, company_name, style, status, preview_slug, primary_phone, primary_cta_label)
  values (v_org, v_lead, ${lit(b.site.company_name)}, '${style}', 'PREVIEW', ${lit(b.site.preview_slug)}, ${lit(b.site.primary_phone)}, ${lit(b.site.primary_cta_label)})
  returning id into v_site;

  insert into design_tokens (site_id, palette_id, primary_color, accent_color, background_color, surface_color, text_color,
                             muted_color, border_color, font_headline, font_body, radius, shadow_style, button_style, spacing_scale)
  values (v_site, ${lit(t.palette_id)}, ${lit(t.primary_color)}, ${lit(t.accent_color)}, ${lit(t.background_color)}, ${lit(t.surface_color)},
          ${lit(t.text_color)}, ${lit(t.muted_color)}, ${lit(t.border_color)}, ${lit(t.font_headline)}, ${lit(t.font_body)},
          ${lit(t.radius)}, ${lit(t.shadow_style)}, ${lit(t.button_style)}, ${lit(t.spacing_scale)});

${pages}
`;
});

const sql = `-- Demo-Websites (rein fiktiv). GENERIERT aus site-engine/lib/fixtures/demo-site.ts — nicht von Hand ändern,
-- stattdessen im site-engine "npm run seed:demo" ausführen.
--
-- Einmalig im Supabase SQL Editor ausführen, NACHDEM Migration 0007 und seed.sql eingespielt sind (der Lead
-- "Elektro Weber" muss existieren). Ersetzt vorhandene Demo-Websites mit denselben Vorschau-Adressen.
-- Danach erreichbar unter /preview/${slugs.join(", /preview/")} auf dem site-engine.

do $$
declare
  v_org uuid;
  v_lead uuid;
  v_site uuid;
begin
  select id into v_org from organizations order by created_at limit 1;
  if v_org is null then
    raise exception 'Keine Organisation gefunden. Zuerst bootstrap-owner.sql ausführen.';
  end if;
  select id into v_lead from leads where organization_id = v_org and company_name = 'Elektro Weber' order by created_at limit 1;
  if v_lead is null then
    raise exception 'Lead "Elektro Weber" nicht gefunden. Zuerst seed.sql ausführen.';
  end if;

  delete from sites where organization_id = v_org and preview_slug in (${slugs.map((s) => lit(s)).join(", ")});

${blocks.join("\n")}
end $$;
`;

const target = resolve(__dirname, "../../dashboard/supabase/seed-demo-sites.sql");
writeFileSync(target, sql);
console.log(`Geschrieben: ${target} (${sql.length} Zeichen)`);

// Gleiche Beispieldaten als JSON für das Dashboard: dessen Test prüft sie gegen die kopierten Abschnitts-Schemas,
// damit die Kopie nicht unbemerkt vom site-engine abweicht (dashboard/tests/website/schema-drift.test.ts).
const fixture = SITE_STYLES.flatMap((style) =>
  buildDemoBundle(style).pages.map((p) => ({ style, slug: p.slug, sections: p.sections })),
);
const fixtureTarget = resolve(__dirname, "../../dashboard/tests/fixtures/site-engine-demo-sections.json");
writeFileSync(fixtureTarget, JSON.stringify(fixture, null, 2) + "\n");
console.log(`Geschrieben: ${fixtureTarget}`);
