import type { SectionOf, SectionType } from "@/lib/content/schemas";
import type { SiteContext } from "@/lib/site-context";

export interface SectionProps<T extends SectionType> {
  section: SectionOf<T>;
  ctx: SiteContext;
}
