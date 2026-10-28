"use client";

import { useState, useSyncExternalStore } from "react";
import { resolveHref } from "@/lib/site-context";
import { cn } from "@/lib/cn";

// Einwilligung wird nur lokal im Browser gespeichert (kein Cookie, keine Übermittlung). "Notwendig" braucht keine
// Einwilligung; "Karten" (Google Maps) lädt erst nach Zustimmung, weil dabei Daten an Google übertragen werden.
const KEY = "cc_v1";
type Consent = { maps: boolean };
type Snapshot = "pending" | "undecided" | string;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): Snapshot {
  try {
    return window.localStorage.getItem(KEY) ?? "undecided";
  } catch {
    return "undecided";
  }
}

function parse(snapshot: Snapshot): Consent | null {
  if (snapshot === "pending" || snapshot === "undecided") return null;
  try {
    const value = JSON.parse(snapshot) as Partial<Consent>;
    return { maps: value.maps === true };
  } catch {
    return null;
  }
}

function useConsentSnapshot() {
  // Auf dem Server (und beim ersten Hydrieren) ist nichts bekannt: weder Banner noch Karte werden dann gezeigt.
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => "pending" as Snapshot);
  return { ready: snapshot !== "pending", consent: parse(snapshot) };
}

export function saveConsent(consent: Consent) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(consent));
  } catch {
    // Speicher blockiert: die Auswahl gilt dann nur bis zum nächsten Laden.
  }
  emit();
}

export function reopenConsent() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // nichts zu tun
  }
  emit();
}

export function CookieBanner({ basePath, hasStickyCta }: { basePath: string; hasStickyCta: boolean }) {
  const { ready, consent } = useConsentSnapshot();
  const [settings, setSettings] = useState(false);
  const [maps, setMaps] = useState(false);

  if (!ready || consent) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies und externe Inhalte"
      className={cn(
        "fixed inset-x-3 z-50 mx-auto max-w-xl rounded-box border border-line bg-bg p-5 text-ink shadow-[0_12px_40px_rgb(0_0_0/0.25)] sm:inset-x-auto sm:right-4",
        hasStickyCta ? "bottom-24 md:bottom-4" : "bottom-4",
      )}
    >
      <p className="heading text-base">Cookies und externe Inhalte</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Diese Website speichert nur, was technisch nötig ist. Die Karte (Google Maps) lädt erst mit Ihrer Zustimmung;
        dabei werden Daten an Google übertragen. Mehr dazu in der{" "}
        <a href={resolveHref("/datenschutz", basePath)} className="underline">
          Datenschutzerklärung
        </a>
        .
      </p>

      {settings ? (
        <fieldset className="mt-4 space-y-3 border-t border-line pt-4">
          <legend className="sr-only">Auswahl</legend>
          <label className="flex items-start gap-3 text-sm opacity-70">
            <input type="checkbox" checked disabled className="mt-1 size-4" />
            <span>
              <strong>Notwendig</strong>, immer aktiv
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={maps}
              onChange={(e) => setMaps(e.target.checked)}
              className="mt-1 size-4 accent-[var(--t-primary)]"
            />
            <span>
              <strong>Karten</strong> (Google Maps)
            </span>
          </label>
          <button
            type="button"
            onClick={() => saveConsent({ maps })}
            className="min-h-11 cursor-pointer rounded-[var(--t-btn-radius)] border border-[var(--t-btn-border)] bg-[var(--t-btn-bg)] px-5 py-2 text-sm font-semibold text-[var(--t-btn-fg)]"
          >
            Auswahl speichern
          </button>
        </fieldset>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => saveConsent({ maps: true })}
            className="min-h-11 cursor-pointer rounded-[var(--t-btn-radius)] border border-[var(--t-btn-border)] bg-[var(--t-btn-bg)] px-5 py-2 text-sm font-semibold text-[var(--t-btn-fg)]"
          >
            Alle akzeptieren
          </button>
          <button
            type="button"
            onClick={() => saveConsent({ maps: false })}
            className="min-h-11 cursor-pointer rounded-[var(--t-btn-radius)] border border-ink/30 px-5 py-2 text-sm font-semibold"
          >
            Nur notwendige
          </button>
          <button
            type="button"
            onClick={() => setSettings(true)}
            className="min-h-11 cursor-pointer px-3 py-2 text-sm underline"
          >
            Einstellungen
          </button>
        </div>
      )}
    </div>
  );
}

export function ConsentReopenButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={reopenConsent} className={cn("cursor-pointer underline", className)}>
      Cookie-Einstellungen
    </button>
  );
}

export function MapEmbed({ query, title, basePath }: { query: string; title: string; basePath: string }) {
  const { ready, consent } = useConsentSnapshot();
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  if (ready && consent?.maps) {
    return (
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[4/3] w-full rounded-box border border-line"
      />
    );
  }

  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 rounded-box border border-line bg-surface p-6 text-center">
      <p className="max-w-xs text-sm leading-relaxed text-muted">
        Die Karte wird von Google Maps bereitgestellt. Beim Laden werden Daten an Google übertragen (
        <a href={resolveHref("/datenschutz", basePath)} className="underline">
          Datenschutz
        </a>
        ).
      </p>
      <button
        type="button"
        onClick={() => saveConsent({ maps: true })}
        className="min-h-11 cursor-pointer rounded-[var(--t-btn-radius)] border border-[var(--t-btn-border)] bg-[var(--t-btn-bg)] px-5 py-2 text-sm font-semibold text-[var(--t-btn-fg)]"
      >
        Karte laden
      </button>
    </div>
  );
}
