# Admin Dashboard

The admin dashboard at `admin.lauriercs.org`, where LCS execs keep the site's events and team current. It is a
Vite + React app that talks straight to Supabase with the public anon key; row-level security in Supabase
decides what each person may change.

## Setup

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (the Supabase project URL) and `DATABASE_KEY`
   (the anon key); ask a VP of Engineering for both. Only the anon key goes here, never the service role key. `.env` is never committed.
2. `pnpm install`, then `pnpm dev` and open http://localhost:5173. Without a valid `.env` the app shows a setup
   page that names what is missing.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm test` | Tests (Vitest + Testing Library) |
| `pnpm lint` | oxlint |
| `pnpm build` | Type check and production build |

On Vercel, the same two variables are set in the admin project (Settings → Environment Variables, for
Production and Preview).

## Database types

`src/types/database.types.ts` is generated from the database, so queries on `events`, `team` and `admins` are
typed. Never edit it by hand. Regenerate it after any schema change, from the repository root:

```powershell
# Writes UTF-8 without a byte order mark (Out-File -Encoding utf8 would add one in Windows PowerShell).
$types = npx supabase gen types typescript --project-id <project-ref> --schema public | Out-String
[IO.File]::WriteAllText("$PWD/apps/admin/src/types/database.types.ts", $types)
```

## Where things go

| Folder | What |
| --- | --- |
| `src/App.tsx`, `src/paths.ts` | Which page shows at which URL. A new section is one `<Route>` |
| `src/pages/` | One file per screen |
| `src/components/` | Pieces of screens; `layout/` holds the route guard and the frame around admin pages |
| `src/hooks/` | Data for pages, through TanStack Query (`useEvents`, `useAuth`) |
| `src/context/` | The signed-in admin, for pages behind the guard (`useCurrentAdmin`) |
| `src/lib/` | The only code that talks to Supabase: the client, config, auth, and one file per table |
| `src/types/` | Generated database types and the app's own types, checked with zod |
| `tests/` | Every test, mirroring `src/` (`tests/pages/LoginPage.test.tsx` tests `src/pages/LoginPage.tsx`), plus setup, `renderApp` and mocks. Tests mock `src/lib/` with `vi.mock` |

## Sign-in

People sign in with Discord or Notion. Signing in isn't access: the `verify-member` Edge Function checks they
are in the LCS Discord server or Notion workspace and records a 7-day pass in `admins`, which the admin reads on
later visits. Sign-in only returns to `http://localhost:5173/login`, so the dev server refuses to start on any
other port. Setup steps are in `docs/admin.md`.
