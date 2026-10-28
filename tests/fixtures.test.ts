import { describe, expect, it } from "vitest";
import { registry } from "@/components/registry";
import { parseSections, sectionSchema, seoSchema } from "@/lib/content/schemas";
import { buildDemoBundle } from "@/lib/fixtures/demo-site";
import { designTokensSchema, SITE_STYLES, contrastIssues } from "@/lib/tokens";

const bundles = SITE_STYLES.map((s) => buildDemoBundle(s));

describe("Demo-Fixtures", () => {
  it.each(bundles.map((b) => [b.site.style, b] as const))("%s: alle Abschnitte sind gültig", (_style, bundle) => {
    for (const page of bundle.pages) {
      const results = parseSections(page.sections);
      expect(results.length).toBeGreaterThan(0);
      for (const r of results) expect(r.ok, r.ok ? "" : r.error).toBe(true);
      expect(seoSchema.safeParse(page.seo).success).toBe(true);
    }
  });

  it.each(bundles.map((b) => [b.site.style, b] as const))("%s: Tokens gültig und lesbar", (_style, bundle) => {
    expect(designTokensSchema.safeParse(bundle.tokens).success).toBe(true);
    expect(contrastIssues(bundle.tokens)).toEqual([]);
  });

  it("jede Seite hat eine Navigation und einen Footer, Impressum/Datenschutz sind vorhanden", () => {
    for (const bundle of bundles) {
      const slugs = bundle.pages.map((p) => p.slug);
      expect(slugs).toEqual(expect.arrayContaining(["/", "/leistungen", "/kontakt", "/impressum", "/datenschutz"]));
      for (const page of bundle.pages) {
        const types = parseSections(page.sections).flatMap((r) => (r.ok ? [r.section.component_type] : []));
        expect(types[0]).toBe("navbar");
        expect(types.at(-1)).toBe("footer");
      }
    }
  });
});

describe("Registry-Vollständigkeit", () => {
  const variantsInSchema = sectionSchema.options.flatMap((option) => {
    const type = option.shape.component_type.value;
    return option.shape.variant.options.map((variant: string) => `${type}.${variant}`);
  });

  it("jede im Schema erlaubte Variante hat eine Komponente", () => {
    for (const key of variantsInSchema) expect(registry[key], key).toBeDefined();
  });

  it("die Registry kennt keine Variante, die das Schema nicht zulässt", () => {
    for (const key of Object.keys(registry)) expect(variantsInSchema, key).toContain(key);
  });

  it("die Demo-Websites decken zusammen jede Variante ab", () => {
    const used = new Set<string>();
    for (const bundle of bundles)
      for (const page of bundle.pages)
        for (const r of parseSections(page.sections)) if (r.ok) used.add(`${r.section.component_type}.${r.section.variant}`);
    expect([...variantsInSchema].filter((k) => !used.has(k))).toEqual([]);
  });
});
