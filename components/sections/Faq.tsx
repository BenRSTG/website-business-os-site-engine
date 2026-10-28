import { SectionContainer } from "@/components/primitives/SectionContainer";
import type { SectionProps } from "./types";

export function Faq({ section }: SectionProps<"faq">) {
  const { content } = section;
  return (
    <SectionContainer id={section.id ?? "faq"} innerClassName="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
      <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
      <div className="border-b border-line">
        {content.items.map((item) => (
          <details key={item.question} className="group border-t border-line">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {item.question}
              <span aria-hidden className="relative size-5 shrink-0">
                <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-0 h-5 w-0.5 -translate-x-1/2 bg-current transition-transform group-open:scale-y-0" />
              </span>
            </summary>
            <p className="pb-6 pr-9 leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </SectionContainer>
  );
}
