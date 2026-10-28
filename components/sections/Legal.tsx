import { SectionContainer } from "@/components/primitives/SectionContainer";
import type { SectionProps } from "./types";

// Rechtstexte kommen aus einer festen Vorlage und werden nie von der KI erzeugt. Solange sie nicht geprüft und
// bestätigt sind (site_pages.legal_confirmed_at), ist der Hinweis sichtbar und die Veröffentlichung gesperrt.
export function Legal({ section }: SectionProps<"legal">) {
  const { content } = section;
  return (
    <SectionContainer id={section.id ?? content.kind} innerClassName="max-w-3xl">
      <h1 className="heading text-4xl sm:text-5xl">{content.title}</h1>
      {content.notice ? (
        <p role="note" className="mt-8 rounded-box border-2 border-dashed border-amber-500 bg-amber-100 px-5 py-4 text-sm font-semibold text-black">
          {content.notice}
        </p>
      ) : null}
      {content.fields.length ? (
        <dl className="mt-10 divide-y divide-line border-y border-line">
          {content.fields.map((f) => (
            <div key={f.label} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
              <dt className="font-semibold">{f.label}</dt>
              <dd className="whitespace-pre-line">{f.value ?? <span className="text-muted">[bitte ergänzen]</span>}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {content.sections?.map((s) => (
        <div key={s.heading} className="mt-10">
          <h2 className="heading text-2xl">{s.heading}</h2>
          <p className="mt-3 leading-relaxed text-muted">{s.placeholder}</p>
        </div>
      ))}
    </SectionContainer>
  );
}
