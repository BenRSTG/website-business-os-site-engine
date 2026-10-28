import { NextResponse, type NextRequest } from "next/server";
import { normalizeHost, resolveRoute } from "@/lib/routing";

// Host/Pfad → interne Route /s/<schlüssel>/…; keine Datenbank im Proxy (docs/02 §4). Die Auflösung passiert danach
// in der gecachten Route. Fremdes oder ungültiges steht als 404 da, nie als Fehlermeldung mit Details.
const routingConfig = {
  previewBaseDomain: process.env.PREVIEW_BASE_DOMAIN ?? null,
  engineHosts: (process.env.ENGINE_HOSTS ?? "")
    .split(",")
    .map((h) => normalizeHost(h))
    .filter(Boolean),
};

export function proxy(request: NextRequest) {
  const host = normalizeHost(request.headers.get("host"));
  const decision = resolveRoute(host, request.nextUrl.pathname, routingConfig);

  if (decision.kind === "pass") return NextResponse.next();
  if (decision.kind === "blocked") return new NextResponse("Nicht gefunden", { status: 404 });

  const url = request.nextUrl.clone();
  url.pathname = decision.pathname;
  return NextResponse.rewrite(url);
}

export const config = {
  // Statische Dateien (Bilder, Schriften, Next-Assets) laufen am Proxy vorbei.
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|woff2?|txt|xml)$).*)"],
};
