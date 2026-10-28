import { SectionContainer } from "@/components/primitives/SectionContainer";
import type { SectionProps } from "./types";

export function Hours({ section }: SectionProps<"hours">) {
  const { content } = section;
  return (
    <SectionContainer id={section.id ?? "zeiten"}>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
          {content.intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{content.intro}</p> : null}
          <ul className="mt-8 border-t border-line">
            {content.hours.map((row) => (
              <li key={row.days} className="flex justify-between gap-6 border-b border-line py-3 text-lg">
                <span className="font-medium">{row.days}</span>
                <span className="text-right text-muted">{row.hours}</span>
              </li>
            ))}
          </ul>
        </div>
        {content.area_text ? (
          <div>
            <h3 className="heading text-2xl">{content.area_headline ?? "Einsatzgebiet"}</h3>
            <p className="mt-4 text-lg leading-relaxed text-muted">{content.area_text}</p>
          </div>
        ) : null}
      </div>
    </SectionContainer>
  );
}
