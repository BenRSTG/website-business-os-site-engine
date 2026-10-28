import { Card } from "@/components/primitives/Card";
import { SectionContainer } from "@/components/primitives/SectionContainer";
import type { SectionProps } from "./types";

export function Pricing({ section }: SectionProps<"pricing">) {
  const { content } = section;
  return (
    <SectionContainer id={section.id ?? "preise"}>
      <div className="max-w-2xl">
        <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
        {content.intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{content.intro}</p> : null}
      </div>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item) => (
          <li key={item.title}>
            <Card className="flex h-full flex-col bg-bg">
              <h3 className="heading text-xl">{item.title}</h3>
              <p className="mt-3 text-2xl font-semibold text-primary">{item.price}</p>
              <p className="mt-3 leading-relaxed text-muted">{item.description}</p>
              {item.features?.length ? (
                <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span aria-hidden className="text-primary">
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
      {content.note ? <p className="mt-6 text-sm text-muted">{content.note}</p> : null}
    </SectionContainer>
  );
}
