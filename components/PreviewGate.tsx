"use client";

import { useActionState } from "react";
import { unlockPreview, type GateState } from "@/app/s/[key]/gate-actions";

// Bewusst neutral und ohne Firmennamen: Wer das Passwort nicht kennt, erfährt nichts über die Vorschau.
export function PreviewGate({ siteKey, returnTo }: { siteKey: string; returnTo: string }) {
  const [state, action, pending] = useActionState<GateState, FormData>(unlockPreview, { error: null });

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-50 p-6 text-neutral-900">
      <form action={action} className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Geschützte Vorschau</h1>
        <p className="mt-1 text-sm text-neutral-600">Bitte geben Sie das Passwort ein, das Sie erhalten haben.</p>
        <input type="hidden" name="key" value={siteKey} />
        <input type="hidden" name="returnTo" value={returnTo} />
        <label htmlFor="password" className="mt-5 block text-sm font-medium">
          Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          maxLength={200}
          autoComplete="off"
          autoFocus
          className="mt-1 min-h-11 w-full rounded-md border border-neutral-400 px-3 py-2 text-base"
        />
        {state.error ? (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-5 min-h-11 w-full cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-base font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Wird geprüft …" : "Öffnen"}
        </button>
      </form>
    </main>
  );
}
