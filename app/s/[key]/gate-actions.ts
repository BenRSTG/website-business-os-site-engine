"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cookieName, cookiePath, getSessionMaxAge, isExpired, safeReturnPath, signSession } from "@/lib/preview-access";
import { getCookieSecret } from "@/lib/preview-env";
import { parseSiteKey } from "@/lib/routing";
import { loadSiteBundle } from "@/lib/site-data";
import { createAnonClient } from "@/lib/supabase";

export interface GateState {
  error: string | null;
}

const GENERIC_ERROR = "Das Passwort stimmt nicht oder es gab zu viele Versuche. Bitte später erneut versuchen.";

// Die Prüfung selbst passiert in der Datenbank (preview_password_ok): der öffentliche Schlüssel darf den Hash nicht lesen,
// und dort werden Fehlversuche gezählt und gedrosselt.
export async function unlockPreview(_previous: GateState, formData: FormData): Promise<GateState> {
  const key = String(formData.get("key") ?? "");
  const password = String(formData.get("password") ?? "");
  const lookup = parseSiteKey(encodeURIComponent(key));
  const secret = getCookieSecret();
  if (!lookup || lookup.kind !== "slug" || !secret || password.length === 0 || password.length > 200) {
    return { error: GENERIC_ERROR };
  }

  const bundle = await loadSiteBundle(key);
  if (!bundle || bundle.site.status !== "PREVIEW" || !bundle.site.preview_protected) return { error: GENERIC_ERROR };
  if (isExpired(bundle.site.preview_expires_at, Date.now())) return { error: GENERIC_ERROR };

  const { data, error } = await createAnonClient().rpc("preview_password_ok", {
    p_slug: lookup.value,
    p_password: password,
  });
  if (error || data !== true) return { error: GENERIC_ERROR };

  const jar = await cookies();
  jar.set(cookieName(bundle.site.id), signSession(secret, bundle.site.id, bundle.site.preview_password_set_at, Date.now()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: cookiePath(lookup.basePath),
    maxAge: getSessionMaxAge(),
  });
  redirect(safeReturnPath(formData.get("returnTo"), lookup.basePath));
}
