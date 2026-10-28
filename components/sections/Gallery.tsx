import { ImageSlot } from "@/components/primitives/ImageSlot";
import { SectionContainer } from "@/components/primitives/SectionContainer";
import type { SectionProps } from "./types";

export function Gallery({ section, ctx }: SectionProps<"gallery">) {
  const { content } = section;
  return (
    <SectionContainer id={section.id ?? "referenzen"} tone="surface">
      <div className="max-w-2xl">
        <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
        {content.intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{content.intro}</p> : null}
      </div>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item, index) => (
          <li key={`${item.image.slot_id}-${index}`}>
            <figure className="m-0">
              <ImageSlot image={item.image} isPreview={ctx.isPreview} className="aspect-[4/3] w-full shadow-box" />
              <figcaption className="mt-3 text-sm text-muted">{item.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
