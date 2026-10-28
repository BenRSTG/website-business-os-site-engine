# Site-Engine

Öffentlich erreichbare Multi-Tenant-Rendering-Engine: rendert später alle
Kundenwebsites (und Previews) aus Datenbank-Inhalten. Planung: `../docs`
(v. a. Schritt 2, 5, 9). Stand: **Milestone 0** — nur Platzhalterseite, damit das
Deployment steht; Tenant-Routing folgt ab Milestone 4/5.

Stack: Next.js 16 (App Router, Cache Components) · TypeScript strict · Tailwind 4 ·
bewusst **kein** UI-Kit und keine Web-Fonts von Drittanbietern.

> Next.js 16 weicht in Details von älteren Versionen ab (z. B. `proxy.ts` statt
> `middleware.ts`). Doku: `node_modules/next/dist/docs/`, siehe `AGENTS.md`.

## Lokale Entwicklung

```bash
npm install
cp .env.example .env.local   # Werte eintragen
npm run dev                  # http://localhost:3000
```

Prüfungen (auch in der CI): `npm run lint`, `npm run typecheck`, `npm run build`.

## Environment-Variablen

| Variable | Zweck |
|---|---|
| `SUPABASE_URL` | Basis-URL des Supabase-Projekts, **ohne** `/rest/v1/` |
| `SUPABASE_ANON_KEY` | „anon public"-Key. Nur serverseitig gelesen (`lib/env.ts`) |

Dies ist der einzige Supabase-Zugang des site-engine. Ein Service-Role-Key oder
anderes Secret mit Schreibrechten darf hier **nie** konfiguriert werden — das
Deployment ist öffentlich erreichbar (siehe `../docs/02-architekturentscheidung.md` §9).

## Deployment (Vercel)

Als **eigenes** Vercel-Projekt (getrennt vom Dashboard): Repo pushen → Import →
beide Variablen eintragen → Deploy. Domains/Wildcard-Preview kommen ab Milestone 5.
