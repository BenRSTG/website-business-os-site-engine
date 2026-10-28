import { MapEmbed } from "@/components/layout/consent";
import { SectionContainer } from "@/components/primitives/SectionContainer";
import type { SectionProps } from "./types";

export function Location({ section, ctx }: SectionProps<"location">) {
  const { content } = section;
  const external = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.map_query)}`;

  return (
    <SectionContainer id={section.id ?? "anfahrt"} innerClassName="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div>
        <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
        <p className="mt-5 whitespace-pre-line text-lg font-semibold">{content.address}</p>
        {content.area_text ? <p className="mt-4 text-lg leading-relaxed text-muted">{content.area_text}</p> : null}
        <a href={external} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-semibold underline underline-offset-4">
          In Google Maps öffnen
        </a>
      </div>
      <MapEmbed query={content.map_query} title={`Karte: ${content.address}`} basePath={ctx.basePath} />
    </SectionContainer>
  );
}
