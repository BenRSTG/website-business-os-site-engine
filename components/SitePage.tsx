import { renderSection } from "@/components/registry";
import { jsonLdString, parseSections, seoSchema } from "@/lib/content/schemas";
import type { PageRow } from "@/lib/site-bundle";
import type { SiteContext } from "@/lib/site-context";

/**
 * Rendert die Abschnitte einer Seite. Jeder Abschnitt wird einzeln validiert: ein kaputter Abschnitt fehlt, die Seite
 * bleibt. In der Vorschau erscheint dafür ein sichtbarer Hinweis, live wird er nur im Server-Log vermerkt.
 */
export function SitePage({ page, ctx }: { page: PageRow; ctx: SiteContext }) {
  const parsed = parseSections(page.sections);
  const seo = seoSchema.safeParse(page.seo);
  const jsonLd = seo.success && seo.data.schema ? jsonLdString(seo.data.schema) : null;

  return (
    <>
      <main id="inhalt">
        {parsed.map((result, index) => {
          if (result.ok) return renderSection(result.section, ctx, `${page.slug}-${index}`);
          console.error(`Ungültiger Abschnitt auf ${page.slug} (Position ${index + 1}): ${result.error}`);
          return ctx.isPreview ? (
            <div key={`${page.slug}-${index}`} role="alert" className="mx-auto my-6 max-w-3xl rounded-box border-2 border-dashed border-red-600 bg-red-50 px-5 py-4 text-sm text-red-900">
              Abschnitt {index + 1} ist ungültig und wird nicht angezeigt: {result.error}
            </div>
          ) : null;
        })}
      </main>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
    </>
  );
}
