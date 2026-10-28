import { describe, expect, it } from "vitest";
import { isSafeHref, telHref } from "@/lib/content/links";

describe("isSafeHref", () => {
  it.each([
    "#kontakt",
    "#",
    "/leistungen",
    "/",
    "https://www.example.com/seite?x=1",
    "mailto:info@example.com",
    "tel:+497821555010",
    "tel:07821555010",
  ])("erlaubt %s", (href) => expect(isSafeHref(href)).toBe(true));

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:x",
    "//böse.example/x",
    "http://unsicher.example",
    "ftp://example.com",
    "/pfad mit leerzeichen",
    "/pfad\\rückwärts",
    "#a b",
    "mailto:keine-adresse",
    "tel:abc",
    "tel:+49 782 1; DROP",
    "",
    "https://",
    "https://example.com/\u0000",
  ])("lehnt %j ab", (href) => expect(isSafeHref(href)).toBe(false));

  it("lehnt überlange Adressen ab", () => {
    expect(isSafeHref(`https://example.com/${"a".repeat(600)}`)).toBe(false);
  });
});

describe("telHref", () => {
  it("entfernt alles außer Ziffern und führendem Plus", () => {
    expect(telHref("07821 555 0101")).toBe("tel:078215550101");
    expect(telHref("+49 (0) 7821 / 5550101")).toBe("tel:+4907821 5550101".replace(" ", ""));
  });
});
