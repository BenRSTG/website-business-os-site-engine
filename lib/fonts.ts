import localFont from "next/font/local";
import type { FontKey } from "./tokens";

// Selbst gehostet (docs/10-sicherheitskonzept.md §B4): keine Laufzeit-Anfrage an Google, die Dateien liegen im Repo.
// Lizenz: SIL Open Font License, Texte unter app/fonts/licenses/.
const archivo = localFont({
  src: [
    { path: "../app/fonts/archivo-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/archivo-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/archivo-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-archivo",
  display: "swap",
});

const plexSans = localFont({
  src: [
    { path: "../app/fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
});

const sourceSerif = localFont({
  src: [
    { path: "../app/fonts/source-serif-4-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/source-serif-4-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/source-serif-4-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-source-serif",
  display: "swap",
});

const fraunces = localFont({
  src: [
    { path: "../app/fonts/fraunces-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/fraunces-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/fraunces-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const VARIABLE_CLASS: Record<FontKey, string> = {
  archivo: archivo.variable,
  "plex-sans": plexSans.variable,
  "source-serif": sourceSerif.variable,
  fraunces: fraunces.variable,
};

/** CSS-Klassen der Schriften, die eine Website tatsächlich nutzt — nur diese werden vorgeladen. */
export function fontClassNames(headline: FontKey, body: FontKey): string {
  return [...new Set([VARIABLE_CLASS[headline], VARIABLE_CLASS[body]])].join(" ");
}
