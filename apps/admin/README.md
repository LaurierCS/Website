# Admin Dashboard

The admin dashboard at `admin.lauriercs.org`, where LCS execs keep the site's events and team current. It is a
Vite + React app that talks straight to Supabase with the public anon key; row-level security in Supabase
decides what each person may change.

## Setup

1. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (ask a VP of
   Engineering). Only the anon key goes here, never the service role key. `.env` is never committed.
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
| `src/pages/` | One file per screen |
| `src/hooks/` | Data for pages, through TanStack Query (`useEvents`) |
| `src/lib/` | The only code that talks to Supabase: the client, config, and one file per table |
| `src/types/` | Generated database types and the app's own types, checked with zod |
| `src/test/` | Test setup. Tests sit next to the file they test and mock `lib/` with `vi.mock` |
