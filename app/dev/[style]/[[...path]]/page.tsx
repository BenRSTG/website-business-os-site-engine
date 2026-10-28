import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteFrame } from "@/components/SiteFrame";
import { SitePage } from "@/components/SitePage";
import { buildDemoBundle } from "@/lib/fixtures/demo-site";
import { findPage, slugFromPath } from "@/lib/site-bundle";
import type { SiteContext } from "@/lib/site-context";
import { SITE_STYLES, type SiteStyle } from "@/lib/tokens";

// Entwickler-Vorschau mit Beispieldaten aus dem Code, ganz ohne Datenbank. In der Produktion gibt es sie nicht.
export const metadata: Metadata = { title: "Entwickler-Vorschau", robots: { index: false, follow: false } };

async function DevPage(props: PageProps<"/dev/[style]/[[...path]]">) {
  if (process.env.NODE_ENV === "production") notFound();
  const { style, path } = await props.params;
  const slug = slugFromPath(path);
  if (!slug || !(SITE_STYLES as readonly string[]).includes(style)) notFound();

  const bundle = buildDemoBundle(style as SiteStyle);
  const page = findPage(bundle, slug);
  if (!page) notFound();

  const ctx: SiteContext = { basePath: `/dev/${style}`, isPreview: true, companyName: bundle.site.company_name };
  return (
    <SiteFrame bundle={bundle} ctx={ctx}>
      <SitePage page={page} ctx={ctx} />
    </SiteFrame>
  );
}

export default function Page(props: PageProps<"/dev/[style]/[[...path]]">) {
  return (
    <Suspense fallback={null}>
      <DevPage {...props} />
    </Suspense>
  );
}
