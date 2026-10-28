import { cn } from "@/lib/cn";
import type { ImageRef } from "@/lib/content/schemas";

/**
 * Bild mit dokumentierter Herkunft. Ohne echtes Bild erscheint ein neutraler Platzhalter; in der Vorschau
 * ist er als solcher beschriftet, damit niemand ihn mit einem fertigen Bild verwechselt.
 */
export function ImageSlot({
  image,
  isPreview,
  className,
  fill = false,
}: {
  image?: ImageRef | null;
  isPreview: boolean;
  className?: string;
  /** füllt den Elterncontainer (Vollbild-Hero), statt ein festes Seitenverhältnis zu nutzen */
  fill?: boolean;
}) {
  // "relative" und "absolute" dürfen nicht beide gesetzt sein: ohne Klassen-Merge gewinnt sonst die spätere Regel im CSS.
  const frame = cn("overflow-hidden", fill ? "absolute inset-0" : "relative rounded-box", className);

  if (image?.src) {
    return (
      <figure className={cn("m-0", frame)}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Quelle und Lizenz je Bild sind dokumentiert, Optimierung folgt mit dem Bildkonzept */}
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        {image.credit ? (
          <figcaption className="absolute bottom-0 right-0 bg-black/60 px-2 py-1 text-[11px] text-white">
            {image.credit}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <div
      role="img"
      aria-label={image?.alt || "Platzhalter für ein Bild"}
      className={cn(
        frame,
        "flex items-center justify-center bg-[linear-gradient(135deg,var(--t-surface),color-mix(in_srgb,var(--t-primary)_20%,var(--t-surface)))]",
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(45deg,transparent_0_14px,color-mix(in_srgb,var(--t-text)_6%,transparent)_14px_15px)]"
      />
      {isPreview && !fill ? (
        <span className="relative rounded-full bg-bg/80 px-3 py-1 text-xs font-medium text-muted">Platzhalter-Bild</span>
      ) : null}
    </div>
  );
}
