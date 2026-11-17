# Repo Restructure Plan: Multi-app Layout

**Status**: Planning phase  
**Target**: Separate independently deployable Vercel projects for site and admin

## Directory Mapping

### Move to `apps/site/` (preserve history with `git mv`)
These are the site-only files and configs:
- `src/` — Astro pages and components (entire directory)
- `public/` — Static assets (entire directory)
- `astro.config.mjs` — Astro framework config
- `package.json` — Site dependencies and scripts
- `pnpm-lock.yaml` — Site lockfile
- `tsconfig.json` — TypeScript config
- `.env.example` — Environment variables template
- `vercel.json` — Site-specific Vercel config (redirect/rewrite rules)
- `design-ref/` — Design reference files (site-only)

### Keep at Root (no move)
These serve both apps or the monorepo:
- `.git/` — Git history (essential)
- `.github/` — Shared workflows (will update paths for each app)
- `LICENSE` — License for the entire repo
- `README.md` — Top-level repo guide (will rewrite)
- `docs/` — Documentation (including this file)
- `.gitignore` — Root-level ignore rules (will expand)

### Create in `apps/admin/` (new scaffolding)
- `src/` — React + TypeScript source (scaffolded by Vite)
- `public/` — Static assets (empty to start)
- `package.json` — Admin dependencies (React, Vite, TypeScript)
- `pnpm-lock.yaml` — Admin lockfile
- `tsconfig.json` — TypeScript config
- `.env.example` — Vite env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- `vite.config.ts` — Vite config
- `index.html` — Entry point

## Files to Handle Manually
- `.env*` files (not in git) — must move by hand from root to `apps/site/`
- Verify no hardcoded paths in GitHub workflows reference removed directories

## Breaking Changes / Fixes Required
1. **GitHub workflows** (`ci.yml`) — update to run in app-specific directories
2. **Root `.gitignore`** — expand to ignore `node_modules`, `dist`, `.astro`, `.vercel`, `.env*` in both apps
3. **Path references** — astro.config, tsconfig paths (if any) unchanged; imports should already be relative
4. **Vercel projects** — each app needs its own project with Root Directory set:
   - `apps/site` with Astro preset
   - `apps/admin` with Vite preset
5. **Environment variables** — each Vercel project has separate env var config

## Verification Checklist
- [ ] `cd apps/site && npm run build` passes
- [ ] `cd apps/site && npm run dev` serves the site without errors
- [ ] `cd apps/admin && npm run build` passes
- [ ] `cd apps/admin && npm run dev` opens the Vite dev server
- [ ] `git log --follow -- apps/site/src` shows full history from root `src/`
- [ ] Root README accurately describes running and deploying both apps
