import type { ReactNode } from "react";
import type { Section } from "@/lib/content/schemas";
import type { SiteContext } from "@/lib/site-context";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Faq } from "./sections/Faq";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Legal } from "./sections/Legal";
import { Location } from "./sections/Location";
import { Navbar } from "./sections/Navbar";
import { Services } from "./sections/Services";
import { Testimonials } from "./sections/Testimonials";

// Component-Registry: "{component_type}.{variant}" → Komponente. Eine neue Variante ist ein Eintrag hier plus die
// Komponente selbst — Pipeline und Seiten-Renderer bleiben unangetastet (docs/05-komponentenarchitektur.md §3.2).
type Renderer = (props: { section: never; ctx: SiteContext }) => ReactNode;
const entry = <T extends Section>(component: (props: { section: T; ctx: SiteContext }) => ReactNode) =>
  component as unknown as Renderer;

export const registry: Record<string, Renderer> = {
  "navbar.standard": entry(Navbar),
  "navbar.centered": entry(Navbar),
  "hero.split": entry(Hero),
  "hero.centered": entry(Hero),
  "hero.image-full": entry(Hero),
  "services.grid-cards": entry(Services),
  "services.list-alternating": entry(Services),
  "about.text-image": entry(About),
  "about.stats-highlight": entry(About),
  "testimonials.cards-grid": entry(Testimonials),
  "testimonials.slider": entry(Testimonials),
  "faq.accordion": entry(Faq),
  "contact.form-info-side": entry(Contact),
  "contact.form-centered": entry(Contact),
  "location.map-text": entry(Location),
  "footer.standard": entry(Footer),
  "legal.standard": entry(Legal),
};

export function renderSection(section: Section, ctx: SiteContext, key: string): ReactNode {
  const Component = registry[`${section.component_type}.${section.variant}`] as unknown as
    | ((props: { section: Section; ctx: SiteContext }) => ReactNode)
    | undefined;
  return Component ? <Component key={key} section={section} ctx={ctx} /> : null;
}
