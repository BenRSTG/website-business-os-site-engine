import { describe, expect, it } from "vitest";
import {
  SESSION_SECONDS,
  cookieName,
  cookiePath,
  isExpired,
  safeReturnPath,
  secretsMatch,
  signSession,
  verifySession,
} from "@/lib/preview-access";
import { siteTag } from "@/lib/site-bundle";

const SECRET = "a".repeat(40);
const OTHER = "b".repeat(40);
const SITE = "11111111-2222-4333-8444-555555555555";
const NOW = Date.parse("2026-10-28T12:00:00Z");

describe("Freischalt-Cookie", () => {
  const token = signSession(SECRET, SITE, "2026-10-28T10:00:00Z", NOW);

  it("ist 24 Stunden gültig", () => {
    expect(verifySession(SECRET, SITE, "2026-10-28T10:00:00Z", token, NOW)).toBe(true);
    expect(verifySession(SECRET, SITE, "2026-10-28T10:00:00Z", token, NOW + (SESSION_SECONDS - 1) * 1000)).toBe(true);
    expect(verifySession(SECRET, SITE, "2026-10-28T10:00:00Z", token, NOW + (SESSION_SECONDS + 1) * 1000)).toBe(false);
  });

  it("gilt nur für diese Website", () => {
    expect(verifySession(SECRET, "99999999-2222-4333-8444-555555555555", "2026-10-28T10:00:00Z", token, NOW)).toBe(false);
  });

  it("wird durch ein neues Passwort ungültig", () => {
    expect(verifySession(SECRET, SITE, "2026-10-28T11:00:00Z", token, NOW)).toBe(false);
    expect(verifySession(SECRET, SITE, null, token, NOW)).toBe(false);
  });

  it("lässt sich mit anderem Geheimnis nicht prüfen und nicht fälschen", () => {
    expect(verifySession(OTHER, SITE, "2026-10-28T10:00:00Z", token, NOW)).toBe(false);
    const [exp, sig] = token.split(".");
    const later = `${Number(exp) + 100000}.${sig}`;
    expect(verifySession(SECRET, SITE, "2026-10-28T10:00:00Z", later, NOW)).toBe(false);
    expect(verifySession(SECRET, SITE, "2026-10-28T10:00:00Z", `${exp}.${sig}x`, NOW)).toBe(false);
  });

  it.each([undefined, "", "abc", "123", "1.2.3", ".", "abc.def", "99999999999999.xyz"])("lehnt Unsinn ab: %s", (value) => {
    expect(verifySession(SECRET, SITE, null, value, NOW)).toBe(false);
  });

  it("Cookie-Name verrät keine volle Kennung und ist je Website verschieden", () => {
    expect(cookieName(SITE)).toBe("pv_111111112222");
    expect(cookieName("aaaaaaaa-2222-4333-8444-555555555555")).not.toBe(cookieName(SITE));
  });

  it("Cookie-Pfad: Pfad-Fallback begrenzt, sonst ganze Adresse", () => {
    expect(cookiePath("/preview/x")).toBe("/preview/x");
    expect(cookiePath("")).toBe("/");
  });
});

describe("Ablaufdatum", () => {
  it("ohne Datum nie abgelaufen, mit Datum ab dem Zeitpunkt", () => {
    expect(isExpired(null, NOW)).toBe(false);
    expect(isExpired("2026-10-28T12:00:01Z", NOW)).toBe(false);
    expect(isExpired("2026-10-28T12:00:00Z", NOW)).toBe(true);
    expect(isExpired("2020-01-01T00:00:00Z", NOW)).toBe(true);
  });

  it("ein unlesbares Datum gilt vorsichtshalber als abgelaufen", () => {
    expect(isExpired("morgen", NOW)).toBe(true);
  });
});

describe("Rücksprungziel nach dem Entsperren", () => {
  it("erlaubt nur interne Pfade innerhalb der Vorschau", () => {
    expect(safeReturnPath("/preview/x/leistungen", "/preview/x")).toBe("/preview/x/leistungen");
    expect(safeReturnPath("/preview/x", "/preview/x")).toBe("/preview/x");
    expect(safeReturnPath("/leistungen", "")).toBe("/leistungen");
  });

  it.each(["https://evil.example", "//evil.example", "javascript:alert(1)", "/\\evil", "/a b", 42, null, undefined])(
    "weist %s ab",
    (value) => {
      expect(safeReturnPath(value, "/preview/x")).toBe("/preview/x");
      expect(safeReturnPath(value, "")).toBe("/");
    },
  );

  it("bleibt im Pfad der eigenen Vorschau", () => {
    expect(safeReturnPath("/preview/anderer/seite", "/preview/x")).toBe("/preview/x");
    expect(safeReturnPath("/preview/xyz", "/preview/x")).toBe("/preview/x");
  });
});

describe("Geheimnis der Aktualisierung", () => {
  it("vergleicht unabhängig von der Länge", () => {
    expect(secretsMatch(SECRET, SECRET)).toBe(true);
    expect(secretsMatch(OTHER, SECRET)).toBe(false);
    expect(secretsMatch("", SECRET)).toBe(false);
    expect(secretsMatch(SECRET + "x", SECRET)).toBe(false);
  });
});

describe("Cache-Schlüssel", () => {
  it("hängt nur an Vorschau-Adresse oder Domain", () => {
    expect(siteTag("weber-modern")).toBe("site:weber-modern");
    expect(siteTag("www.kunde.de")).toBe("site:www.kunde.de");
  });
});
