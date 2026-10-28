import { ImageSlot } from "@/components/primitives/ImageSlot";
import { SectionContainer } from "@/components/primitives/SectionContainer";
import type { SectionProps } from "./types";

export function Team({ section, ctx }: SectionProps<"team">) {
  const { content } = section;
  return (
    <SectionContainer id={section.id ?? "team"}>
      <div className="max-w-2xl">
        <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
        {content.intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{content.intro}</p> : null}
      </div>
      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {content.members.map((member, index) => (
          <li key={`${member.name}-${index}`}>
            <ImageSlot
              image={member.image ?? { slot_id: `team-${index + 1}`, alt: `Foto von ${member.name}`, source: "placeholder" }}
              isPreview={ctx.isPreview}
              className="aspect-square w-full"
            />
            <p className="heading mt-4 text-xl">{member.name}</p>
            <p className="text-muted">{member.role}</p>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
