import { ImageSlot } from "@/components/primitives/ImageSlot";
import { SectionContainer } from "@/components/primitives/SectionContainer";
import type { SectionProps } from "./types";

export function About({ section, ctx }: SectionProps<"about">) {
  const { content, variant } = section;
  const id = section.id ?? "ueber-uns";

  const text = (
    <div>
      <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
        {content.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );

  if (variant === "stats-highlight") {
    return (
      <SectionContainer id={id} innerClassName="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {text}
        {content.stats?.length ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            {content.stats.map((s) => (
              <div key={s.label}>
                <dd className="heading text-4xl text-primary sm:text-5xl">{s.value}</dd>
                <dt className="mt-1 text-sm font-medium text-muted">{s.label}</dt>
              </div>
            ))}
          </dl>
        ) : (
          <ImageSlot image={content.image} isPreview={ctx.isPreview} className="aspect-[4/3] w-full shadow-box" />
        )}
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id={id} tone="surface" innerClassName="grid items-center gap-12 md:grid-cols-2">
      {text}
      <ImageSlot image={content.image} isPreview={ctx.isPreview} className="aspect-[4/3] w-full shadow-box" />
    </SectionContainer>
  );
}
