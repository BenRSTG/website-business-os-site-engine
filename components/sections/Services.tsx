import { Card } from "@/components/primitives/Card";
import { SectionContainer } from "@/components/primitives/SectionContainer";
import type { SectionProps } from "./types";

export function Services({ section }: SectionProps<"services">) {
  const { content, variant } = section;
  const id = section.id ?? "leistungen";

  const head = (
    <div className="max-w-2xl">
      <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
      {content.intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{content.intro}</p> : null}
    </div>
  );

  if (variant === "list-alternating") {
    return (
      <SectionContainer id={id}>
        {head}
        <ol className="mt-12 border-b border-line">
          {content.items.map((item) => (
            <li
              key={item.title}
              className="grid gap-3 border-t border-line py-8 md:grid-cols-[1fr_2fr] md:gap-12 md:even:grid-cols-[2fr_1fr] md:even:[&>*:first-child]:order-2"
            >
              <h3 className="heading text-2xl">{item.title}</h3>
              <p className="max-w-prose text-lg leading-relaxed text-muted">{item.description}</p>
            </li>
          ))}
        </ol>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id={id} tone="surface">
      {head}
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item) => (
          <li key={item.title}>
            <Card className="h-full bg-bg">
              <h3 className="heading text-xl">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
            </Card>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
