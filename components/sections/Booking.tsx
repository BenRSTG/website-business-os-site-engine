import { SectionContainer } from "@/components/primitives/SectionContainer";
import { SubmitButton } from "@/components/primitives/Button";
import { cn } from "@/lib/cn";
import { resolveHref } from "@/lib/site-context";
import type { SectionProps } from "./types";

const field =
  "mt-1.5 block min-h-12 w-full rounded-box border border-ink/25 bg-bg px-4 py-3 text-base text-ink placeholder:text-muted/70";

// Terminanfrage, keine verbindliche Buchung: Der Betrieb bestätigt den Termin selbst. Versand erst ab Milestone 6,
// in der Vorschau ist das Formular nur zur Ansicht.
export function Booking({ section, ctx }: SectionProps<"booking">) {
  const { content } = section;
  return (
    <SectionContainer id={section.id ?? "termin"} tone="surface">
      <div className="mx-auto max-w-2xl">
        <h2 className="heading text-3xl sm:text-4xl">{content.headline}</h2>
        {content.intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{content.intro}</p> : null}
        <form method="post" action="/api/booking" className="mt-10 space-y-5">
          <fieldset disabled={ctx.isPreview} className="m-0 min-w-0 space-y-5 border-0 p-0 disabled:opacity-90">
            <div>
              <label htmlFor="bk-name" className="text-sm font-semibold">
                Name
              </label>
              <input id="bk-name" name="name" type="text" autoComplete="name" required className={field} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="bk-email" className="text-sm font-semibold">
                  E-Mail
                </label>
                <input id="bk-email" name="email" type="email" autoComplete="email" required className={field} />
              </div>
              <div>
                <label htmlFor="bk-phone" className="text-sm font-semibold">
                  Telefon <span className="font-normal text-muted">(optional)</span>
                </label>
                <input id="bk-phone" name="phone" type="tel" autoComplete="tel" className={field} />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="bk-date" className="text-sm font-semibold">
                  Wunschtermin
                </label>
                <input id="bk-date" name="date" type="date" required className={field} />
              </div>
              <div>
                <label htmlFor="bk-time" className="text-sm font-semibold">
                  Zeitfenster
                </label>
                <select id="bk-time" name="time" className={field} defaultValue="egal">
                  <option value="egal">Egal</option>
                  <option value="vormittags">Vormittags</option>
                  <option value="nachmittags">Nachmittags</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="bk-message" className="text-sm font-semibold">
                Worum geht es?
              </label>
              <textarea id="bk-message" name="message" rows={4} required className={cn(field, "min-h-28")} />
            </div>
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
                gelesen und bin mit der Verarbeitung meiner Angaben zur Terminvereinbarung einverstanden.
              </span>
            </label>
            <SubmitButton>Termin anfragen</SubmitButton>
          </fieldset>
          {ctx.isPreview ? (
            <p className="rounded-box border border-dashed border-ink/30 px-4 py-3 text-sm text-muted">
              In der Vorschau wird das Formular nicht versendet.
            </p>
          ) : null}
          <p className="text-sm text-muted">{content.note ?? "Das ist eine Anfrage. Wir bestätigen Ihnen den Termin persönlich."}</p>
        </form>
      </div>
    </SectionContainer>
  );
}
