import { revalidateTag } from "next/cache";
import { z } from "zod";
import { secretsMatch } from "@/lib/preview-access";
import { getRevalidateSecret } from "@/lib/preview-env";
import { siteTag } from "@/lib/site-bundle";

// Vom Dashboard aufgerufen, wenn sich eine Website ändert (neue Demo, Passwort, Laufzeit, Sperre). Das Geheimnis darf
// ausschließlich diese Aktualisierung auslösen, sonst nichts.
const bodySchema = z.object({
  keys: z.array(z.string().regex(/^[a-z0-9]([a-z0-9.-]{0,251}[a-z0-9])?$/)).min(1).max(20),
});

export async function POST(request: Request) {
  const expected = getRevalidateSecret();
  if (!expected) return Response.json({ error: "nicht eingerichtet" }, { status: 503 });
  if (!secretsMatch(request.headers.get("x-revalidate-secret") ?? "", expected)) {
    return Response.json({ error: "nicht erlaubt" }, { status: 403 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "ungültige Anfrage" }, { status: 400 });

  // expire: 0 = sofort ungültig, kein "veraltet, aber noch ausgeliefert": eine Sperre muss beim nächsten Aufruf wirken.
  for (const key of parsed.data.keys) revalidateTag(siteTag(key), { expire: 0 });
  return Response.json({ revalidated: parsed.data.keys.length });
}
