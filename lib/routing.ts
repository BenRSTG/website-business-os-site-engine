// Reine Entscheidungslogik des Proxys: Host/Pfad → welche Website. Bewusst ohne Datenbank (docs/02 §4),
// damit der Proxy schnell bleibt; die Auflösung "Schlüssel → Site" passiert danach in der gecachten Route.

export type RouteDecision =
  | { kind: "pass" }
  | { kind: "blocked" }
  | { kind: "rewrite"; pathname: string };

const SLUG = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
const HOST = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export interface RoutingConfig {
  /** z. B. "preview.beispiel.app" (Produktion) oder "preview.lvh.me" (lokal) */
  previewBaseDomain?: string | null;
  /** weitere Hosts, die das site-engine selbst bedienen (kein Kundenhost), kommagetrennt aus der Umgebung */
  engineHosts?: string[];
}

export function normalizeHost(rawHost: string | null | undefined): string {
  return (rawHost ?? "").trim().toLowerCase().replace(/:\d+$/, "").replace(/\.$/, "");
}

export function isEngineHost(host: string, config: RoutingConfig): boolean {
  return (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "127.0.0.1" ||
    host.endsWith(".vercel.app") ||
    (config.engineHosts ?? []).includes(host)
  );
}

/** "path" = Vorschau über den Pfad-Fallback /preview/<slug>: gleiche Site wie "slug", aber Links brauchen das Präfix. */
export function siteKey(kind: "slug" | "path" | "host", value: string): string {
  return `${kind}:${value}`;
}

export function rewriteTo(key: string, pathname: string): string {
  const rest = pathname === "/" ? "" : pathname.replace(/\/+$/, "");
  return `/s/${encodeURIComponent(key)}${rest}`;
}

const PASS_THROUGH = [/^\/api\//, /^\/dev(\/|$)/, /^\/_next\//, /^\/onboarding\//, /^\/(favicon\.ico|robots\.txt|sitemap\.xml)$/];

export function resolveRoute(host: string, pathname: string, config: RoutingConfig): RouteDecision {
  // Die interne Zielroute ist nicht von außen erreichbar: nur der Proxy darf dorthin umschreiben.
  if (pathname === "/s" || pathname.startsWith("/s/")) return { kind: "blocked" };
  if (PASS_THROUGH.some((p) => p.test(pathname))) return { kind: "pass" };

  const base = config.previewBaseDomain ? normalizeHost(config.previewBaseDomain) : null;
  if (base && host.endsWith(`.${base}`)) {
    const slug = host.slice(0, -(base.length + 1));
    return SLUG.test(slug) ? { kind: "rewrite", pathname: rewriteTo(siteKey("slug", slug), pathname) } : { kind: "blocked" };
  }

  if (isEngineHost(host, config)) {
    // Fallback ohne Wildcard-Domain: /preview/<slug>/…
    const match = /^\/preview\/([^/]+)(\/.*)?$/.exec(pathname);
    if (match) {
      return SLUG.test(match[1])
        ? {
            kind: "rewrite",
            pathname: rewriteTo(siteKey("path", match[1]), match[2] ?? "/"),
          }
        : { kind: "blocked" };
    }
    return { kind: "pass" };
  }

  return HOST.test(host)
    ? { kind: "rewrite", pathname: rewriteTo(siteKey("host", host), pathname) }
    : { kind: "blocked" };
}

export type SiteLookup = { kind: "slug" | "host"; value: string; basePath: string };

/** Zerlegt den Schlüssel aus der internen Route wieder; null bei allem, was kein gültiger Schlüssel ist. */
export function parseSiteKey(raw: string): SiteLookup | null {
  let key: string;
  try {
    key = decodeURIComponent(raw);
  } catch {
    return null;
  }
  const [kind, ...rest] = key.split(":");
  const value = rest.join(":");
  if (kind === "slug" && SLUG.test(value)) return { kind, value, basePath: "" };
  if (kind === "path" && SLUG.test(value)) return { kind: "slug", value, basePath: `/preview/${value}` };
  if (kind === "host" && HOST.test(value)) return { kind, value, basePath: "" };
  return null;
}
