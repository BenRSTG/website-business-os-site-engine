import { Card } from "@/components/primitives/Card";
import { SectionContainer } from "@/components/primitives/SectionContainer";
import { cn } from "@/lib/cn";
import type { SectionProps } from "./types";

function Stars({ rating }: { rating: number }) {
  return (
    <p role="img" aria-label={`${rating} von 5 Sternen`} className="text-lg tracking-widest text-accent">
      {"★".repeat(rating)}
      <span className="text-line">{"★".repeat(5 - rating)}</span>
    </p>
  );
}

export function Testimonials({ section }: SectionProps<"testimonials">) {
  const { content, variant } = section;
  const id = section.id ?? "bewertungen";
  const slider = variant === "slider";

  return (
    <SectionContainer id={id} tone="surface">
      <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
      <ul
        {...(slider ? { tabIndex: 0, role: "region", "aria-label": content.headline } : {})}
        className={cn(
          "mt-12",
          slider
            ? "-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:thin] sm:-mx-8 sm:px-8"
            : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {content.items.map((item) => (
          <li key={item.name + item.quote} className={cn(slider && "w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[32%]")}>
            <Card className="flex h-full flex-col gap-4 bg-bg">
              {item.rating ? <Stars rating={item.rating} /> : null}
              <blockquote className="m-0 flex-1 text-lg leading-relaxed">„{item.quote}“</blockquote>
              <p className="text-sm font-semibold text-muted">{item.name}</p>
            </Card>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
