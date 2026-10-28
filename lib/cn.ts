/** Klassen zusammenführen; leere Werte werden ignoriert. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}
