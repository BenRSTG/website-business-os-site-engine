import { describe, expect, it } from "vitest";
import { jsonLdString, parseSections, sectionSchema } from "@/lib/content/schemas";

const hero = {
  component_type: "hero",
  variant: "split",
  content: { headline: "Ihr Elektriker in Lahr", cta_label: "Jetzt anrufen", cta_href: "tel:+497821555010" },
};

describe("sectionSchema", () => {
  it("akzeptiert einen gültigen Abschnitt", () => {
    expect(sectionSchema.safeParse(hero).success).toBe(true);
  });

  it("lehnt unbekannte Komponenten und Varianten ab", () => {
    expect(sectionSchema.safeParse({ ...hero, component_type: "slider-3d" }).success).toBe(false);
    expect(sectionSchema.safeParse({ ...hero, variant: "parallax" }).success).toBe(false);
  });

  it("lehnt gefährliche Links ab", () => {
    const bad = { ...hero, content: { ...hero.content, cta_href: "javascript:alert(1)" } };
    expect(sectionSchema.safeParse(bad).success).toBe(false);
  });

  it("behandelt leere optionale Texte wie fehlende", () => {
    const ok = { ...hero, content: { ...hero.content, subheadline: "  ", secondary_label: "" } };
    expect(sectionSchema.safeParse(ok).success).toBe(true);
  });

  it("verlangt für Bilder die Herkunft: Platzhalter ohne, echte Bilder mit https-Adresse", () => {
    const image = (img: object) => ({ ...hero, content: { ...hero.content, image: img } });
    const base = { slot_id: "hero", alt: "Elektriker" };
    expect(sectionSchema.safeParse(image({ ...base, source: "placeholder", src: null })).success).toBe(true);
    expect(sectionSchema.safeParse(image({ ...base, source: "stock", src: "https://images.example.com/a.jpg", credit: "Foto: X" })).success).toBe(true);
    expect(sectionSchema.safeParse(image({ ...base, source: "stock", src: null })).success).toBe(false);
    expect(sectionSchema.safeParse(image({ ...base, source: "placeholder", src: "https://x.example/a.jpg" })).success).toBe(false);
    expect(sectionSchema.safeParse(image({ ...base, source: "customer", src: "http://unsicher.example/a.jpg" })).success).toBe(false);
    expect(sectionSchema.safeParse(image({ ...base, source: "customer", src: "javascript:alert(1)" })).success).toBe(false);
    expect(sectionSchema.safeParse(image({ ...base, source: "erfunden", src: null })).success).toBe(false);
  });

  it("begrenzt Listen", () => {
    const many = { component_type: "faq", variant: "accordion", content: { headline: "FAQ", items: Array.from({ length: 11 }, () => ({ question: "F?", answer: "A" })) } };
    expect(sectionSchema.safeParse(many).success).toBe(false);
    expect(sectionSchema.safeParse({ ...many, content: { ...many.content, items: [] } }).success).toBe(false);
  });

  it("prüft die E-Mail-Adresse im Kontakt", () => {
    const contact = (email: string) => ({ component_type: "contact", variant: "form-centered", content: { headline: "Kontakt", email } });
    expect(sectionSchema.safeParse(contact("info@example.com")).success).toBe(true);
    expect(sectionSchema.safeParse(contact("keine-mail")).success).toBe(false);
    expect(sectionSchema.safeParse(contact("")).success).toBe(true);
  });
});

describe("parseSections", () => {
  it("validiert jeden Abschnitt einzeln und meldet Fehler lesbar", () => {
    const result = parseSections([hero, { component_type: "hero", variant: "split", content: { headline: "" } }, "kaputt"]);
    expect(result.map((r) => r.ok)).toEqual([true, false, false]);
    const failed = result[1];
    expect(failed.ok === false && failed.error).toContain("content");
  });
  it("liefert bei Unsinn eine leere Liste", () => {
    expect(parseSections(null)).toEqual([]);
    expect(parseSections({})).toEqual([]);
  });
});

describe("jsonLdString", () => {
  it("entschärft ein schließendes Script-Tag", () => {
    const out = jsonLdString({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });
});
