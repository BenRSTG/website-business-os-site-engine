import { createHmac, timingSafeEqual } from "node:crypto";

// Freischaltung einer passwortgeschützten Vorschau: ein signiertes Cookie, kein eigenes Login-System.
// Der Token bindet die Website, die letzte Passwortänderung und das Ablaufdatum — ein neues Passwort macht ältere Cookies ungültig.
export const SESSION_SECONDS = 24 * 60 * 60;

export const getSessionMaxAge = () => SESSION_SECONDS;

export function cookieName(siteId: string): string {
  return `pv_${siteId.replace(/-/g, "").slice(0, 12)}`;
}

function signature(secret: string, siteId: string, passwordSetAt: string | null, exp: number): string {
  return createHmac("sha256", secret).update(`${siteId}|${passwordSetAt ?? ""}|${exp}`).digest("base64url");
}

export function signSession(secret: string, siteId: string, passwordSetAt: string | null, nowMs: number): string {
  const exp = Math.floor(nowMs / 1000) + SESSION_SECONDS;
  return `${exp}.${signature(secret, siteId, passwordSetAt, exp)}`;
}

export function verifySession(
  secret: string,
  siteId: string,
  passwordSetAt: string | null,
  token: string | undefined,
  nowMs: number,
): boolean {
  if (!token) return false;
  const [expRaw, sig, ...rest] = token.split(".");
  if (rest.length > 0 || !expRaw || !sig || !/^\d{1,12}$/.test(expRaw)) return false;
  const exp = Number(expRaw);
  if (exp * 1000 <= nowMs) return false;
  const expected = Buffer.from(signature(secret, siteId, passwordSetAt, exp));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function isExpired(expiresAt: string | null, nowMs: number): boolean {
  if (!expiresAt) return false;
  const time = Date.parse(expiresAt);
  return Number.isNaN(time) ? true : time <= nowMs;
}

/** Cookie nur für den Pfad der Vorschau (Pfad-Fallback), sonst für die ganze Adresse. */
export function cookiePath(basePath: string): string {
  return basePath || "/";
}

/** Rücksprungziel nach dem Entsperren: nur interne Pfade, nie eine fremde Adresse. */
export function safeReturnPath(value: unknown, basePath: string): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\s]/.test(value)) {
    return basePath || "/";
  }
  if (basePath && value !== basePath && !value.startsWith(`${basePath}/`)) return basePath;
  return value;
}

/** Zeitkonstanter Vergleich zweier Geheimnisse beliebiger Länge. */
export function secretsMatch(given: string, expected: string): boolean {
  const a = createHmac("sha256", "vergleich").update(given).digest();
  const b = createHmac("sha256", "vergleich").update(expected).digest();
  return timingSafeEqual(a, b);
}
