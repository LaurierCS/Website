# LCS Admin

The admin dashboard at `admin.lauriercs.org`, where LCS execs keep the site current. People sign in with
Discord or Notion; anyone in the LCS Discord server or the LCS Notion workspace gets in. Execs will later
keep one of the two (remove the other from `SIGN_IN_PROVIDERS` in `src/domain/access.ts` and
`src/ui/providers.ts`).

## Run it

From the repository root:

```powershell
corepack enable          # once, gives you the pnpm version pinned in package.json
pnpm install
Copy-Item apps/admin/.env.example apps/admin/.env   # then fill in the two values
pnpm dev:admin
```

| Script (in `apps/admin`) | What |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm test` | Tests (Vitest + Testing Library) |
| `pnpm lint` | oxlint |
| `pnpm exec tsc -b --noEmit` | Type check |
| `pnpm build` | Production build |

### Database types

`src/infra/database.types.ts` is generated from the database, so queries on `events`, `team` and `admins` are
typed. Regenerate it after any schema change (from the repository root):

```powershell
# Writes UTF-8 without a byte order mark (Out-File -Encoding utf8 would add one in Windows PowerShell).
$types = npx supabase gen types typescript --linked --schema public | Out-String
[IO.File]::WriteAllText("$PWD/apps/admin/src/infra/database.types.ts", $types)
```

## How it is laid out

| Folder | What lives there |
| --- | --- |
| `src/domain/` | Types, zod schemas, errors and ports. No React, no Supabase |
| `src/infra/` | Supabase adapters that implement the ports |
| `src/features/<name>/` | One folder per feature: screens, components, hooks, tests |
| `src/ui/` | Brand primitives (button, scrapbook word, loader) and the asset manifest |
| `src/app/` | Composition root: services, routes, the admin guard, the layout |
| `src/shared/` | Config parsing |
| `src/test/` | `renderApp` and typed fakes |

A new admin section is a new `features/<name>/` folder plus one `<Route>` line in `src/app/routes.tsx`.

## Sign-in and access

1. The visitor signs in with Discord or Notion through Supabase Auth.
2. The app reads the visitor's own `admins` row. If it has not expired, they are in; the provider is not asked
   again, because Discord rate-limits the lookup and a few refreshes would otherwise lock a member out.
3. With no valid row, right after sign-in, the app calls the `verify-member` Edge Function
   (`supabase/functions/`) with the provider's token. It confirms the person is in the LCS Discord server or
   LCS Notion workspace and records them in `public.admins` for 7 days, or removes them. When the row expires,
   signing in again renews it.

Row-level security is what actually refuses writes from people without access; the login screen is the
friendly front of it. Until the migration and function are deployed, a signed-in visitor sees the "door's
jammed" state.

## One-time setup (a VP of Engineering)

Providers, redirect URLs, the database, the Edge Function and Vercel: [`docs/admin.md`](../../docs/admin.md).
