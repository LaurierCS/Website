# Laurier Computing Society

Public website and admin dashboard for LCS. Two independently deployable apps sharing one repository.

## Repository Structure

```
lcs/
├── apps/
│   ├── site/          → Public website (Astro + TypeScript + Tailwind)
│   └── admin/         → Admin dashboard (Vite + React + TypeScript)
├── .github/           → Shared CI/CD workflows
├── docs/              → Documentation
└── README.md          → This file
```

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+

### Running the public site

```sh
cd apps/site
pnpm install
cp .env.example .env
# Add SUPABASE_URL and SUPABASE_ANON_KEY from a VP of Engineering
pnpm dev
```

Server runs on `http://localhost:3000`.

### Running the admin dashboard

```sh
cd apps/admin
pnpm install
cp .env.example .env
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (public anon key only)
pnpm dev
```

Server runs on `http://localhost:5173`.

## Site (`apps/site/`)

Astro-based static + on-demand rendering. Renders events and team pages on each request via Supabase.

### Scripts
- `pnpm dev` — Local server
- `pnpm build` — Production build (Vercel output)
- `pnpm preview` — Serve the build locally
- `pnpm check` — Astro type check

### Structure
- `src/pages/` — Routes. `/`, `/events`, `/events/[id]` render on-demand. `/hack-to-the-future` is prerendered.
- `src/components/` — UI split by page.
- `src/layouts/Base.astro` — Nav, footer, background, glows.
- `src/lib/queries/` — Read-only Supabase queries.
- `public/` — Logos, mascots, favicons.

### Deployment
Each Vercel project has one environment variable pair: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (never the service role key).

## Admin (`apps/admin/`)

Vite + React for a fast, future-proof admin dashboard. Currently minimal; expand with user auth, forms, and Supabase integration.

### Scripts
- `pnpm dev` — Local dev server
- `pnpm build` — Production build
- `pnpm preview` — Serve the build locally
- `pnpm lint` — Run oxlint

### Structure
- `src/App.tsx` — Root component.
- `src/main.tsx` — React entry point.
- `public/` — Static assets.

### Environment Variables
Vite env vars are public (shipped to the browser) and must be prefixed with `VITE_`. Never add a Supabase service role key.

### Deployment
Each Vercel project has: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Vercel Deployment

Two separate Vercel projects, each with its own Root Directory and environment variables.

### Site project
- **Root Directory**: `apps/site`
- **Framework**: Astro
- **Environment**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

### Admin project
- **Root Directory**: `apps/admin`
- **Framework**: Vite
- **Environment**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Environment Variables

### Site (server-only)
- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase public anon key

### Admin (public, shipped to browser)
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase public anon key

See `apps/site/.env.example` and `apps/admin/.env.example` for templates.

## GitHub Workflows

CI runs on every branch. Workflows run in their respective app directories.

## Supabase

Read-only queries. Tables:
- `events` — Event list and detail pages
- `team` — Team page

## Notes

- No monorepo tooling (Turborepo, Nx, workspaces). Each app is independent.
- Each app has its own `package.json` and `pnpm-lock.yaml`.
- Root `.gitignore` covers both apps: `node_modules`, `dist`, `.astro`, `.vercel`, `.env*`.
- See `docs/redesign.md` for what the redesign covers and why.
