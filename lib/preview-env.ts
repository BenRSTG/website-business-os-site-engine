import "server-only";

// Geheimnisse für Passwort-Cookies und Aktualisierung. Bewusst lazy und mit Mindestlänge: fehlt etwas, schlägt der Zugang
// geschützter Vorschauen zu (fail-closed), die restliche Website läuft weiter.
const MIN_LENGTH = 32;

function secret(name: string): string | null {
  const value = process.env[name];
  return value && value.length >= MIN_LENGTH ? value : null;
}

export const getCookieSecret = () => secret("PREVIEW_COOKIE_SECRET");
export const getRevalidateSecret = () => secret("REVALIDATE_SECRET");
