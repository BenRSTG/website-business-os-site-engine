// Bewusst mit festen Farben statt Tokens: Der Hinweis ist Pflicht (Compliance) und darf sich nicht wegstylen lassen.
export function DraftBanner() {
  return (
    <div
      role="status"
      className="sticky top-0 z-50 flex min-h-9 items-center justify-center bg-amber-300 px-4 py-1.5 text-center text-xs font-semibold text-black sm:text-sm"
    >
      Unverbindlicher Entwurf. Gestaltung und Inhalte können sich noch ändern.
    </div>
  );
}
