import { SectionContainer } from "@/components/primitives/SectionContainer";
import { SubmitButton } from "@/components/primitives/Button";
import { telHref } from "@/lib/content/links";
import { cn } from "@/lib/cn";
import { resolveHref, type SiteContext } from "@/lib/site-context";
import type { SectionProps } from "./types";

const field =
  "mt-1.5 block min-h-12 w-full rounded-box border border-ink/25 bg-bg px-4 py-3 text-base text-ink placeholder:text-muted/70";

function ContactForm({ ctx, note }: { ctx: SiteContext; note?: string | null }) {
  return (
    <form method="post" action="/api/contact" className="space-y-5">
      {/* In der Vorschau wird nichts versendet; der Versand folgt vor dem ersten Go-Live (Milestone 6). */}
      <fieldset disabled={ctx.isPreview} className="m-0 min-w-0 space-y-5 border-0 p-0 disabled:opacity-90">
        <div>
          <label htmlFor="cf-name" className="text-sm font-semibold">
            Name
          </label>
          <input id="cf-name" name="name" type="text" autoComplete="name" required className={field} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-email" className="text-sm font-semibold">
              E-Mail
            </label>
            <input id="cf-email" name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor="cf-phone" className="text-sm font-semibold">
              Telefon <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id="cf-phone" name="phone" type="tel" autoComplete="tel" className={field} />
          </div>
        </div>
        <div>
          <label htmlFor="cf-message" className="text-sm font-semibold">
            Ihre Nachricht
          </label>
          <textarea id="cf-message" name="message" rows={5} required className={cn(field, "min-h-32")} />
        </div>
        {/* Honigtopf gegen Spam-Bots: Menschen sehen und füllen dieses Feld nie aus. */}
        <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input type="checkbox" name="consent" required className="mt-1 size-5 shrink-0 accent-[var(--t-primary)]" />
          <span>
            Ich habe die{" "}
            <a href={resolveHref("/datenschutz", ctx.basePath)} className="underline">
              Datenschutzerklärung
            </a>{" "}
            gelesen und bin mit der Verarbeitung meiner Angaben zur Beantwortung der Anfrage einverstanden.
          </span>
        </label>
        <SubmitButton>Anfrage senden</SubmitButton>
      </fieldset>
      {ctx.isPreview ? (
        <p className="rounded-box border border-dashed border-ink/30 px-4 py-3 text-sm text-muted">
          In der Vorschau wird das Formular nicht versendet.
        </p>
      ) : null}
      {note ? <p className="text-sm text-muted">{note}</p> : null}
    </form>
  );
}

function Info({ content }: { content: SectionProps<"contact">["section"]["content"] }) {
  return (
    <dl className="space-y-6">
      {content.phone ? (
        <div>
          <dt className="eyebrow">Telefon</dt>
          <dd className="mt-1 text-xl font-semibold">
            <a href={telHref(content.phone)} className="text-ink no-underline hover:underline">
              {content.phone}
            </a>
          </dd>
        </div>
      ) : null}
      {content.email ? (
        <div>
          <dt className="eyebrow">E-Mail</dt>
          <dd className="mt-1 text-lg">
            <a href={`mailto:${content.email}`} className="text-ink underline underline-offset-4">
              {content.email}
            </a>
          </dd>
        </div>
      ) : null}
      {content.address ? (
        <div>
          <dt className="eyebrow">Adresse</dt>
          <dd className="mt-1 whitespace-pre-line text-lg">{content.address}</dd>
        </div>
      ) : null}
      {content.opening_hours?.length ? (
        <div>
          <dt className="eyebrow">Öffnungszeiten</dt>
          <dd className="mt-1">
            <ul className="space-y-1 text-lg">
              {content.opening_hours.map((row) => (
                <li key={row.days} className="flex justify-between gap-6 border-b border-line py-1.5">
                  <span>{row.days}</span>
                  <span className="text-muted">{row.hours}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

export function Contact({ section, ctx }: SectionProps<"contact">) {
  const { content, variant } = section;
  const id = section.id ?? "kontakt";

  if (variant === "form-centered") {
    return (
      <SectionContainer id={id} tone="surface">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
          {content.intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{content.intro}</p> : null}
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <ContactForm ctx={ctx} note={content.form_note} />
        </div>
        <div className="mx-auto mt-14 max-w-3xl border-t border-line pt-10">
          <Info content={content} />
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer id={id} tone="surface" innerClassName="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <div>
        <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
        {content.intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{content.intro}</p> : null}
        <div className="mt-8">
          <Info content={content} />
        </div>
      </div>
      <ContactForm ctx={ctx} note={content.form_note} />
    </SectionContainer>
  );
}
