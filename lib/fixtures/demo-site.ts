import type { Section } from "@/lib/content/schemas";
import type { PageRow, SiteBundle } from "@/lib/site-bundle";
import { STYLE_PRESETS, type SiteStyle } from "@/lib/tokens";

// Fiktiver Betrieb für die Entwickler-Vorschau und das Demo-Seed. Alle Angaben sind erfunden (.example-Adressen).
const COMPANY = "Elektro Weber";
const PHONE = "07821 555 0101";
const EMAIL = "info@elektro-weber.example.com";
const ADDRESS = "Hauptstraße 12\n77933 Lahr";

interface Variants {
  navbar: "standard" | "centered";
  hero: "split" | "centered" | "image-full";
  services: "grid-cards" | "list-alternating";
  about: "text-image" | "stats-highlight";
  testimonials: "cards-grid" | "slider";
  contact: "form-info-side" | "form-centered";
}

// Die drei Stile nutzen verschiedene Varianten, damit zusammen jede Variante der Registry einmal vorkommt.
const VARIANTS: Record<SiteStyle, Variants> = {
  modern: { navbar: "standard", hero: "split", services: "grid-cards", about: "text-image", testimonials: "cards-grid", contact: "form-info-side" },
  traditional: { navbar: "centered", hero: "centered", services: "list-alternating", about: "stats-highlight", testimonials: "slider", contact: "form-centered" },
  premium: { navbar: "standard", hero: "image-full", services: "grid-cards", about: "stats-highlight", testimonials: "cards-grid", contact: "form-info-side" },
};

const NAV_LINKS = [
  { label: "Startseite", href: "/" },
  { label: "Leistungen", href: "/leistungen" },
  { label: "Kontakt", href: "/kontakt" },
];

function navbar(v: Variants): Section {
  return {
    component_type: "navbar",
    variant: v.navbar,
    content: { logo_text: COMPANY, links: NAV_LINKS, cta_label: "Jetzt anrufen", cta_href: `tel:${PHONE.replace(/\s/g, "")}` },
  };
}

const footer: Section = {
  component_type: "footer",
  variant: "standard",
  content: {
    company_name: COMPANY,
    tagline: "Elektrotechnik für Haus und Betrieb in Lahr und Umgebung.",
    address: ADDRESS,
    phone: PHONE,
    email: EMAIL,
    links: NAV_LINKS,
    legal_links: [
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
    ],
  },
};

const placeholder = (slot_id: string, alt: string) => ({ slot_id, alt, source: "placeholder" as const });

function home(v: Variants): Section[] {
  return [
    navbar(v),
    {
      component_type: "hero",
      variant: v.hero,
      content: {
        eyebrow: "Elektrofachbetrieb in Lahr",
        headline: "Strom, der einfach funktioniert",
        subheadline: "Installation, Reparatur und Notdienst für Privathaushalte und Betriebe — zuverlässig und zu fairen Preisen.",
        cta_label: "Jetzt anrufen",
        cta_href: `tel:${PHONE.replace(/\s/g, "")}`,
        secondary_label: "Unsere Leistungen",
        secondary_href: "/leistungen",
        image: placeholder("hero", "Elektriker bei der Arbeit am Sicherungskasten"),
        points: ["Festpreis nach Besichtigung", "Termin meist innerhalb einer Woche", "Meisterbetrieb"],
      },
    },
    {
      component_type: "services",
      variant: v.services,
      content: {
        headline: "Was wir für Sie tun",
        intro: "Von der Steckdose bis zur Photovoltaikanlage.",
        items: [
          { title: "Elektroinstallation", description: "Neubau, Umbau und Erweiterung — sauber geplant und nach aktuellen Vorschriften ausgeführt." },
          { title: "Reparatur und Störungsbehebung", description: "Wenn der Strom ausfällt oder eine Sicherung ständig fliegt, finden wir die Ursache." },
          { title: "Smart Home", description: "Licht, Heizung und Rollläden bequem steuern, auch nachträglich." },
          { title: "E-Check und Prüfungen", description: "Wiederkehrende Prüfung elektrischer Anlagen für Ihre Sicherheit und Versicherung." },
        ],
      },
    },
    {
      component_type: "about",
      variant: v.about,
      content: {
        headline: "Ein Betrieb, den Sie persönlich kennen",
        paragraphs: [
          "Elektro Weber ist ein kleiner Meisterbetrieb. Sie sprechen mit den Menschen, die am Ende auch bei Ihnen vor Ort arbeiten.",
          "Wir nehmen uns Zeit für eine ehrliche Beratung und sagen Ihnen vorab, was etwas kostet.",
        ],
        image: placeholder("about", "Das Team von Elektro Weber"),
        stats: [
          { value: "20+", label: "Jahre Erfahrung" },
          { value: "1.200+", label: "Aufträge" },
          { value: "24 h", label: "Notdienst" },
        ],
      },
    },
    {
      component_type: "testimonials",
      variant: v.testimonials,
      content: {
        headline: "Das sagen unsere Kunden",
        items: [
          { name: "Beispielkundin A.", quote: "Pünktlich, freundlich und sauber gearbeitet. Gern wieder.", rating: 5 },
          { name: "Beispielkunde B.", quote: "Der Fehler war nach einer Stunde gefunden. Faire Rechnung.", rating: 5 },
          { name: "Beispielkundin C.", quote: "Gute Beratung zum Smart Home, ohne etwas aufzuschwatzen.", rating: 4 },
        ],
      },
    },
    {
      component_type: "faq",
      variant: "accordion",
      content: {
        headline: "Häufige Fragen",
        items: [
          { question: "Wie schnell bekomme ich einen Termin?", answer: "In der Regel innerhalb einer Woche. Bei Störungen versuchen wir, am selben Tag zu helfen." },
          { question: "Was kostet ein Besuch?", answer: "Nach einer Besichtigung nennen wir einen Festpreis. Kleinere Reparaturen rechnen wir nach Aufwand ab." },
        ],
      },
    },
    footer,
  ];
}

function services(v: Variants): Section[] {
  return [
    navbar(v),
    {
      component_type: "services",
      variant: v.services,
      content: {
        headline: "Leistungen im Überblick",
        items: [
          { title: "Elektroinstallation", description: "Steckdosen, Beleuchtung, Verteilerschränke und Netzwerkdosen." },
          { title: "Photovoltaik und Speicher", description: "Anschluss und Inbetriebnahme Ihrer Anlage inklusive Zählerschrank." },
          { title: "Ladestation für Elektroautos", description: "Wallbox-Installation mit Beratung zur Förderung." },
          { title: "Notdienst", description: "Bei Stromausfall und Gefahr erreichen Sie uns rund um die Uhr." },
        ],
      },
    },
    {
      component_type: "faq",
      variant: "accordion",
      content: {
        headline: "Fragen zu unseren Leistungen",
        items: [{ question: "Arbeiten Sie auch für Gewerbekunden?", answer: "Ja, von der Arztpraxis bis zur kleinen Werkstatt." }],
      },
    },
    footer,
  ];
}

function contact(v: Variants): Section[] {
  return [
    navbar(v),
    {
      component_type: "contact",
      variant: v.contact,
      content: {
        headline: "So erreichen Sie uns",
        intro: "Rufen Sie einfach an oder schreiben Sie uns — wir melden uns zeitnah.",
        phone: PHONE,
        email: EMAIL,
        address: ADDRESS,
        opening_hours: [
          { days: "Montag bis Freitag", hours: "7:30 bis 17:00 Uhr" },
          { days: "Notdienst", hours: "rund um die Uhr" },
        ],
        form_note: "Die Daten aus dem Formular verwenden wir nur, um Ihre Anfrage zu beantworten.",
      },
    },
    {
      component_type: "location",
      variant: "map-text",
      content: {
        headline: "Hier finden Sie uns",
        address: "Hauptstraße 12, 77933 Lahr",
        area_text: "Wir sind in Lahr und im Umkreis von etwa 30 Kilometern für Sie unterwegs.",
        map_query: "Lahr/Schwarzwald",
      },
    },
    footer,
  ];
}

function legal(v: Variants, kind: "impressum" | "datenschutz"): Section[] {
  const notice = "Entwurf: Dieser Text ist eine Vorlage und muss vor der Veröffentlichung geprüft und bestätigt werden.";
  const body: Section =
    kind === "impressum"
      ? {
          component_type: "legal",
          variant: "standard",
          content: {
            kind,
            title: "Impressum",
            notice,
            fields: [
              { label: "Anbieter", value: COMPANY },
              { label: "Anschrift", value: ADDRESS },
              { label: "Telefon", value: PHONE },
              { label: "E-Mail", value: EMAIL },
              { label: "Umsatzsteuer-ID", value: null },
            ],
          },
        }
      : {
          component_type: "legal",
          variant: "standard",
          content: {
            kind,
            title: "Datenschutzerklärung",
            notice,
            fields: [
              { label: "Verantwortlicher", value: `${COMPANY}\n${ADDRESS}` },
              { label: "Kontakt", value: EMAIL },
            ],
            sections: [
              { heading: "Hosting", placeholder: "[Angaben zum Hosting-Anbieter ergänzen]" },
              { heading: "Kontaktaufnahme", placeholder: "[Angaben zur Verarbeitung von Anfragen ergänzen]" },
              { heading: "Ihre Rechte", placeholder: "[Standardtext zu Betroffenenrechten ergänzen]" },
            ],
          },
        };
  return [navbar(v), body, footer];
}

/** Vollständige Beispiel-Website (fünf Seiten) im gewünschten Stil. Wird für /dev und das Demo-Seed genutzt. */
export function buildDemoBundle(style: SiteStyle): SiteBundle {
  const v = VARIANTS[style];
  const page = (slug: string, page_type: string, sections: Section[], title: string, meta_description: string): PageRow => ({
    slug,
    page_type,
    sections,
    seo: { title, meta_description },
  });

  return {
    site: {
      id: `demo-${style}`,
      company_name: COMPANY,
      style,
      status: "PREVIEW",
      preview_slug: `weber-${style}`,
      preview_protected: false,
      preview_expires_at: null,
      custom_domain: null,
      primary_phone: PHONE,
      primary_cta_label: "Jetzt anrufen",
    },
    tokens: STYLE_PRESETS[style],
    pages: [
      page("/", "home", home(v), `${COMPANY} — Elektrofachbetrieb in Lahr`, "Installation, Reparatur und Notdienst für Haus und Betrieb in Lahr. Jetzt anrufen."),
      page("/leistungen", "leistungen", services(v), `Leistungen — ${COMPANY}`, "Elektroinstallation, Photovoltaik, Ladestationen und Notdienst in Lahr."),
      page("/kontakt", "kontakt", contact(v), `Kontakt — ${COMPANY}`, "Telefon, E-Mail und Anfahrt von Elektro Weber in Lahr."),
      page("/impressum", "impressum", legal(v, "impressum"), `Impressum — ${COMPANY}`, "Impressum von Elektro Weber."),
      page("/datenschutz", "datenschutz", legal(v, "datenschutz"), `Datenschutz — ${COMPANY}`, "Datenschutzerklärung von Elektro Weber."),
    ],
  };
}
