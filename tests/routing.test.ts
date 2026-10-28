import { describe, expect, it } from "vitest";
import { normalizeHost, parseSiteKey, resolveRoute, rewriteTo, siteKey } from "@/lib/routing";

const config = { previewBaseDomain: "preview.beispiel.app", engineHosts: ["engine.beispiel.app"] };

describe("normalizeHost", () => {
  it("entfernt Port, Großschreibung und Punkt am Ende", () => {
    expect(normalizeHost("Kunde.DE:443")).toBe("kunde.de");
    expect(normalizeHost("kunde.de.")).toBe("kunde.de");
    expect(normalizeHost(null)).toBe("");
  });
});

describe("resolveRoute", () => {
  it("leitet Vorschau-Subdomains auf die interne Route", () => {
    expect(resolveRoute("weber-modern.preview.beispiel.app", "/leistungen", config)).toEqual({
      kind: "rewrite",
      pathname: "/s/slug%3Aweber-modern/leistungen",
    });
    expect(resolveRoute("weber-modern.preview.beispiel.app", "/", config)).toEqual({
      kind: "rewrite",
      pathname: "/s/slug%3Aweber-modern",
    });
  });

  it("weist ungültige Vorschau-Slugs ab", () => {
    expect(resolveRoute("a.b.preview.beispiel.app", "/", config).kind).toBe("blocked");
    expect(resolveRoute("-schlecht.preview.beispiel.app", "/", config).kind).toBe("blocked");
  });

  it("leitet Kundendomains um", () => {
    expect(resolveRoute("www.elektro-weber.de", "/kontakt", config)).toEqual({
      kind: "rewrite",
      pathname: "/s/host%3Awww.elektro-weber.de/kontakt",
    });
  });

  it("bedient den Pfad-Fallback /preview/<slug> auf Engine-Hosts", () => {
    for (const host of ["localhost", "projekt.vercel.app", "engine.beispiel.app", "127.0.0.1"]) {
      expect(resolveRoute(host, "/preview/weber-modern/kontakt", config)).toEqual({
        kind: "rewrite",
        pathname: "/s/path%3Aweber-modern/kontakt",
      });
    }
    expect(resolveRoute("localhost", "/preview/weber-modern", config)).toEqual({
      kind: "rewrite",
      pathname: "/s/path%3Aweber-modern",
    });
  });

  it("lässt die Startseite der Engine neutral", () => {
    expect(resolveRoute("projekt.vercel.app", "/", config)).toEqual({ kind: "pass" });
  });

  it("sperrt die interne Route für direkte Aufrufe — auch auf Kundendomains", () => {
    expect(resolveRoute("projekt.vercel.app", "/s/slug%3Aweber-modern", config).kind).toBe("blocked");
    expect(resolveRoute("www.elektro-weber.de", "/s/host%3Afremd.de/", config).kind).toBe("blocked");
    expect(resolveRoute("weber.preview.beispiel.app", "/s", config).kind).toBe("blocked");
  });

  it("lässt API, Entwickler-Vorschau und Systemdateien durch", () => {
    for (const path of ["/api/contact", "/dev/modern", "/favicon.ico", "/robots.txt"]) {
      expect(resolveRoute("www.elektro-weber.de", path, config)).toEqual({ kind: "pass" });
    }
  });

  it("weist Hosts ab, die keine gültigen Domainnamen sind", () => {
    expect(resolveRoute("", "/", config).kind).toBe("blocked");
    expect(resolveRoute("kein host", "/", config).kind).toBe("blocked");
    expect(resolveRoute("8.8.8.8", "/", config).kind).toBe("blocked");
  });

  it("nutzt ohne konfigurierte Vorschau-Domain nur den Pfad-Fallback", () => {
    expect(resolveRoute("a.preview.beispiel.app", "/", {}).kind).toBe("rewrite"); // dann wie Kundendomain
    expect(resolveRoute("localhost", "/preview/x/", {})).toEqual({ kind: "rewrite", pathname: "/s/path%3Ax" });
  });

  it("verträgt Schrägstriche am Ende", () => {
    expect(rewriteTo("slug:a", "/leistungen/")).toBe("/s/slug%3Aa/leistungen");
  });
});

describe("parseSiteKey", () => {
  it("liest gültige Schlüssel", () => {
    expect(parseSiteKey(encodeURIComponent(siteKey("slug", "weber-modern")))).toEqual({ kind: "slug", value: "weber-modern", basePath: "" });
    expect(parseSiteKey("path%3Aweber-modern")).toEqual({ kind: "slug", value: "weber-modern", basePath: "/preview/weber-modern" });
    expect(parseSiteKey("host%3Awww.kunde.de")).toEqual({ kind: "host", value: "www.kunde.de", basePath: "" });
  });
  it.each(["", "slug:", "slug:Groß", "slug:a b", "host:kein-punkt", "x:y", "slug:%E0%A4%A", "%", "slug:a;b", "host:../etc"])(
    "weist %j ab",
    (raw) => expect(parseSiteKey(raw)).toBeNull(),
  );
});
