import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteFrame } from "@/components/SiteFrame";
import { SitePage } from "@/components/SitePage";
import { seoSchema } from "@/lib/content/schemas";
import { parseSiteKey } from "@/lib/routing";
import { findPage, slugFromPath } from "@/lib/site-bundle";
import { loadSiteBundle } from "@/lib/site-data";
import type { SiteContext } from "@/lib/site-context";

type Props = PageProps<"/s/[key]/[[...path]]">;

async function resolve(props: Props) {
  const { key, path } = await props.params;
  const lookup = parseSiteKey(key);
  const pageSlug = slugFromPath(path);
  if (!lookup || !pageSlug) return null;
  const bundle = await loadSiteBundle(decodeURIComponent(key));
  if (!bundle) return null;
  // Vorschau-Passwort-Schutz kommt mit Milestone 5. Bis dahin wird eine geschützte Site nicht ausgeliefert (fail-closed).
  if (bundle.site.preview_protected) return null;
  const page = findPage(bundle, pageSlug);
  if (!page) return null;
  const isPreview = bundle.site.status === "PREVIEW";
  const ctx: SiteContext = { basePath: lookup.basePath, isPreview, companyName: bundle.site.company_name };
  return { bundle, page, ctx, viaSlug: lookup.kind === "slug" };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const found = await resolve(props);
  if (!found) return { title: "Seite nicht gefunden", robots: { index: false, follow: false } };
  const seo = seoSchema.safeParse(found.page.seo);
  const title = (seo.success && seo.data.title) || found.bundle.site.company_name;
  const description = (seo.success && seo.data.meta_description) || undefined;
  // Vorschauen und Zugriffe über den Vorschau-Slug werden nie indexiert; nur LIVE auf der Kundendomain.
  const indexable = found.bundle.site.status === "LIVE" && !found.viaSlug;
  return {
    title,
    description,
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  };
}

async function TenantPage(props: Props) {
  const found = await resolve(props);
  if (!found) notFound();
  return (
    <SiteFrame bundle={found.bundle} ctx={found.ctx}>
      <SitePage page={found.page} ctx={found.ctx} />
    </SiteFrame>
  );
}

export default function Page(props: Props) {
  return (
    <Suspense fallback={null}>
      <TenantPage {...props} />
    </Suspense>
  );
}
