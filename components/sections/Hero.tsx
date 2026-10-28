import { Button } from "@/components/primitives/Button";
import { ImageSlot } from "@/components/primitives/ImageSlot";
import { SectionContainer } from "@/components/primitives/SectionContainer";
import { cn } from "@/lib/cn";
import type { SectionProps } from "./types";

function Check() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="mt-1 size-4 shrink-0 fill-none stroke-[var(--t-accent)]" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}

export function Hero({ section, ctx }: SectionProps<"hero">) {
  const { content, variant } = section;
  const secondary = content.secondary_label && content.secondary_href ? { label: content.secondary_label, href: content.secondary_href } : null;
  const id = section.id ?? "start";

  const buttons = (onImage = false, center = false) => (
    <div className={cn("mt-8 flex flex-wrap gap-3", center && "justify-center")}>
      <Button href={content.cta_href} base={ctx.basePath}>
        {content.cta_label}
      </Button>
      {secondary ? (
        <Button href={secondary.href} base={ctx.basePath} variant={onImage ? "onImage" : "secondary"}>
          {secondary.label}
        </Button>
      ) : null}
    </div>
  );

  if (variant === "image-full") {
    return (
      <section id={id} className="relative isolate flex min-h-[78svh] items-center overflow-hidden text-white">
        <ImageSlot image={content.image} isPreview={ctx.isPreview} fill />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/35" />
        <div className="relative mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
          <div className="max-w-2xl">
            {content.eyebrow ? <p className="eyebrow !text-white/85">{content.eyebrow}</p> : null}
            <h1 className="heading mt-3 text-4xl sm:text-5xl lg:text-6xl">{content.headline}</h1>
            {content.subheadline ? <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/90">{content.subheadline}</p> : null}
            {buttons(true)}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "centered") {
    return (
      <SectionContainer id={id} tone="surface" innerClassName="text-center">
        <div className="mx-auto max-w-3xl">
          {content.eyebrow ? <p className="eyebrow">{content.eyebrow}</p> : null}
          <h1 className="heading mt-3 text-4xl sm:text-5xl lg:text-6xl">{content.headline}</h1>
          {content.subheadline ? <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">{content.subheadline}</p> : null}
          {buttons(false, true)}
          {content.points?.length ? (
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
              {content.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-left">
                  <Check />
                  {p}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {content.image ? <ImageSlot image={content.image} isPreview={ctx.isPreview} className="mx-auto mt-12 aspect-[16/7] w-full max-w-5xl shadow-box" /> : null}
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id={id} innerClassName="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] lg:gap-16">
      <div>
        {content.eyebrow ? <p className="eyebrow">{content.eyebrow}</p> : null}
        <h1 className="heading mt-3 text-4xl sm:text-5xl lg:text-6xl">{content.headline}</h1>
        {content.subheadline ? <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{content.subheadline}</p> : null}
        {buttons()}
        {content.points?.length ? (
          <ul className="mt-8 grid gap-2 text-sm font-medium sm:grid-cols-2">
            {content.points.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Check />
                {p}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <ImageSlot image={content.image} isPreview={ctx.isPreview} className="aspect-[4/3] w-full shadow-box" />
    </SectionContainer>
  );
}
