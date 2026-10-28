import { telHref } from "@/lib/content/links";

/** Feste Anrufleiste am unteren Rand auf Mobilgeräten — für Handwerksbetriebe der wichtigste Conversion-Hebel. */
export function StickyCallCta({ phone, label }: { phone: string | null; label: string }) {
  if (!phone) return null;
  return (
    <>
      <div aria-hidden className="h-20 md:hidden" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <a
          href={telHref(phone)}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--t-btn-radius)] border border-[var(--t-btn-border)] bg-[var(--t-btn-bg)] px-5 py-3 text-base font-semibold text-[var(--t-btn-fg)] no-underline"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
          </svg>
          {label}
        </a>
      </div>
    </>
  );
}
