import { describe, expect, it } from "vitest";
import {
  STYLE_PRESETS,
  SITE_STYLES,
  contrastIssues,
  contrastRatio,
  designTokensSchema,
  labelColor,
  onColor,
  tokensToCssVars,
} from "@/lib/tokens";

describe("Kontrast", () => {
  it("kennt die Eckwerte", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
  });
  it("wählt auf hellem Grund dunkle und auf dunklem Grund helle Schrift", () => {
    expect(onColor("#FFFFFF")).toBe("#111111");
    expect(onColor("#E0A83C")).toBe("#111111");
    expect(onColor("#111315")).toBe("#ffffff");
    expect(onColor("#2B5C99")).toBe("#ffffff");
  });
});

describe("Stil-Voreinstellungen", () => {
  it.each(SITE_STYLES)("%s besteht die Token-Validierung und die WCAG-AA-Kontrastprüfung", (style) => {
    expect(designTokensSchema.safeParse(STYLE_PRESETS[style]).success).toBe(true);
    expect(contrastIssues(STYLE_PRESETS[style])).toEqual([]);
  });

  it.each(SITE_STYLES)("%s hat lesbare Button-Schrift", (style) => {
    const vars = tokensToCssVars(STYLE_PRESETS[style], style);
    const bg = vars["--t-btn-bg"] === "transparent" ? STYLE_PRESETS[style].background_color : vars["--t-btn-bg"];
    expect(contrastRatio(vars["--t-btn-fg"], bg)).toBeGreaterThanOrEqual(4.5);
  });

  it("unterscheiden sich spürbar", () => {
    const heads = SITE_STYLES.map((s) => STYLE_PRESETS[s].font_headline);
    expect(new Set(heads).size).toBe(3);
    expect(STYLE_PRESETS.premium.button_style).toBe("outline-square");
  });
});

describe("designTokensSchema (Schutz vor CSS-Einschleusung)", () => {
  const base = STYLE_PRESETS.modern;
  it.each([
    ["Farbe mit CSS", { primary_color: "red; background:url(https://böse.example/x)" }],
    ["Farbname statt Hex", { accent_color: "red" }],
    ["Kurzform", { text_color: "#fff" }],
    ["unbekannte Schrift", { font_headline: "comic-sans" }],
    ["freier Radius", { radius: "999px; position:fixed" }],
    ["unbekannter Schatten", { shadow_style: "0 0 99px red" }],
  ])("lehnt %s ab", (_name, patch) => {
    expect(designTokensSchema.safeParse({ ...base, ...patch }).success).toBe(false);
  });
});

describe("tokensToCssVars", () => {
  it("erzeugt nur Werte aus validierten Tokens und festen Tabellen", () => {
    const vars = tokensToCssVars(STYLE_PRESETS.modern, "modern");
    expect(vars["--t-primary"]).toBe("#2B5C99");
    expect(vars["--t-section-y"]).toBe("5rem");
    expect(vars["--t-btn-radius"]).toBe("9999px");
    for (const value of Object.values(vars)) expect(value).not.toMatch(/[;{}]/);
  });
  it("übersetzt den Outline-Button des Premium-Stils", () => {
    const vars = tokensToCssVars(STYLE_PRESETS.premium, "premium");
    expect(vars["--t-btn-bg"]).toBe("transparent");
    expect(vars["--t-btn-border"]).toBe("#D9BF86");
  });
});

describe("labelColor", () => {
  it("nimmt den Akzent nur, wenn er auf Hintergrund und Fläche lesbar ist", () => {
    for (const style of SITE_STYLES) {
      const t = STYLE_PRESETS[style];
      const c = labelColor(t);
      expect(contrastRatio(c, t.background_color)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(c, t.surface_color)).toBeGreaterThanOrEqual(4.5);
    }
  });
  it("fällt auf die Primärfarbe zurück, wenn der Akzent zu hell ist", () => {
    expect(labelColor({ ...STYLE_PRESETS.modern, accent_color: "#F5E6A8" })).toBe(STYLE_PRESETS.modern.primary_color);
  });
});
