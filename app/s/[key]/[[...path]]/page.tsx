import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PreviewGate } from "@/components/PreviewGate";
import { SiteFrame } from "@/components/SiteFrame";
import { SitePage } from "@/components/SitePage";
import { seoSchema } from "@/lib/content/schemas";
import { cookieName, isExpired, verifySession } from "@/lib/preview-access";
import { getCookieSecret } from "@/lib/preview-env";
import { parseSiteKey } from "@/lib/routing";
import { findPage, slugFromPath, type SiteBundle } from "@/lib/site-bundle";
import { loadSiteBundle } from "@/lib/site-data";
import type { SiteContext } from "@/lib/site-context";

type Props = PageProps<"/s/[key]/[[...path]]">;

type Resolved =
  | { kind: "notfound" }
  | { kind: "gate"; key: string; returnTo: string }
  | { kind: "page"; bundle: SiteBundle; page: NonNullable<ReturnType<typeof findPage>>; ctx: SiteContext; viaSlug: boolean };

async function resolve(props: Props): Promise<Resolved> {
  const { key: rawKey, path } = await props.params;
  const lookup = parseSiteKey(rawKey);
  const pageSlug = slugFromPath(path);
  if (!lookup || !pageSlug) return { kind: "notfound" };
  const key = decodeURIComponent(rawKey);
  const bundle = await loadSiteBundle(key);
  if (!bundle) return { kind: "notfound" };

  const { site } = bundle;
  const isPreview = site.status === "PREVIEW";
  // Abgelaufen sieht aus wie nicht vorhanden. Die Datenbank blendet solche Vorschauen ohnehin aus; die Prüfung hier
  // verhindert, dass ein Cache-Eintrag über das Ablaufdatum hinaus ausliefert.
  if (isPreview && isExpired(site.preview_expires_at, Date.now())) return { kind: "notfound" };

  const page = findPage(bundle, pageSlug);
  const returnTo = `${lookup.basePath}${pageSlug === "/" ? "" : pageSlug}` || "/";

  if (isPreview && site.preview_protected) {
    const secret = getCookieSecret();
    if (!secret) return { kind: "notfound" }; // ohne Cookie-Geheimnis kann niemand freigeschaltet werden: geschlossen bleiben
    const token = (await cookies()).get(cookieName(site.id))?.value;
    if (!verifySession(secret, site.id, site.preview_password_set_at, token, Date.now())) {
      return { kind: "gate", key, returnTo };
    }
  }
  if (!page) return { kind: "notfound" };

  const ctx: SiteContext = { basePath: lookup.basePath, isPreview, companyName: site.company_name, motion: site.package === "BUSINESS_PLUS" };
  return { kind: "page", bundle, page, ctx, viaSlug: lookup.kind === "slug" };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const found = await resolve(props);
  const hidden: Metadata = { robots: { index: false, follow: false } };
  if (found.kind === "gate") return { ...hidden, title: "Geschützte Vorschau" };
  if (found.kind === "notfound") return { ...hidden, title: "Seite nicht gefunden" };

  const seo = seoSchema.safeParse(found.page.seo);
  const title = (seo.success && seo.data.title) || found.bundle.site.company_name;
  const description = (seo.success && seo.data.meta_description) || undefined;
  // Vorschauen und Zugriffe über den Vorschau-Slug werden nie indexiert; nur LIVE auf der Kundendomain.
  const indexable = found.bundle.site.status === "LIVE" && !found.viaSlug;
  return { title, description, robots: indexable ? { index: true, follow: true } : hidden.robots };
}

async function TenantPage(props: Props) {
  const found = await resolve(props);
  if (found.kind === "notfound") notFound();
  if (found.kind === "gate") return <PreviewGate siteKey={found.key} returnTo={found.returnTo} />;
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
