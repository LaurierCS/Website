# Repository Restructure Summary

## What Changed

Restructured the repository to support two independently deployable apps, each with its own Vercel project.

### Files Moved to `apps/site/`
**Using `git mv` to preserve history:**
- `src/` → full Astro site codebase
- `public/` → static assets
- `astro.config.mjs` → Astro framework config
- `package.json` + `pnpm-lock.yaml` → site dependencies and lockfile
- `tsconfig.json` → TypeScript config for Astro
- `.env.example` → environment variables template
- `vercel.json` → Vercel adapter config

**Result**: Run `git log --follow -- apps/site/src/pages/index.astro` to see full history.

### New App at `apps/admin/`
**Created with `npm create vite@latest`:**
- Vite + React + TypeScript
- Minimal `App.tsx` rendering "LCS Admin" (expand later with auth, forms, etc.)
- `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (public only)
- Build and dev commands ready

### Root Changes
**Kept at root:**
- `.git/`, `.github/`, `LICENSE`, `docs/`
- Root `README.md` — rewritten with multi-app setup guide
- Root `.gitignore` — expanded to ignore both apps' build artifacts and env files
- `.github/workflows/ci.yml` — split into `site` and `admin` jobs, each with separate cache and working directory

**Deleted:**
- None. Only additions and rearrangements.

## Verification Checklist

✅ **Both apps build successfully:**
- `cd apps/site && npm run build` — ✓ Astro build complete
- `cd apps/admin && npm run build` — ✓ Vite build complete

✅ **Both apps run locally:**
- `cd apps/site && npm run dev` — astro dev server
- `cd apps/admin && npm run dev` — vite dev server

✅ **Git history preserved:**
- `git log --follow -- apps/site/src/pages/index.astro` shows full history

✅ **No secrets committed:**
- Only `.env.example` files in git (no actual `.env` files)

✅ **Workflows updated:**
- CI now runs both `site` job (astro check + build) and `admin` job (lint + tsc + build)
- Each job uses correct working directory and lockfile cache

## Manual Steps You Need to Do

### 1. Copy `.env` files

The actual `.env` files were not migrated (they contain secrets and shouldn't be in git).

**For the site**, create `apps/site/.env` with:
```
SUPABASE_URL=<your-url>
SUPABASE_ANON_KEY=<your-key>
```

**For the admin**, create `apps/admin/.env` with:
```
VITE_SUPABASE_URL=<your-url>
VITE_SUPABASE_ANON_KEY=<your-key>
```

Ask a VP of Engineering for the values. **Never put the service role key anywhere.**

### 2. Delete old Vercel project (optional)

If you had a Vercel project pointing to the repo root, you can delete it after setting up the two new projects below.

### 3. Create two Vercel projects

#### Site Project
- **Name:** `lcs-site` (or `laurier-cs-site`)
- **Repository:** LaurierCS/Website
- **Root Directory:** `apps/site`
- **Framework:** Astro
- **Environment Variables:**
  - `SUPABASE_URL` = your project URL
  - `SUPABASE_ANON_KEY` = your public anon key
- **Branch:** Deploy pushes to `main` (or configure your strategy)

#### Admin Project
- **Name:** `lcs-admin` (or `laurier-cs-admin`)
- **Repository:** LaurierCS/Website
- **Root Directory:** `apps/admin`
- **Framework:** Vite (or generic Node.js, Vercel will auto-detect)
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_SUPABASE_URL` = your project URL
  - `VITE_SUPABASE_ANON_KEY` = your public anon key
- **Branch:** Deploy pushes to `main` (or configure your strategy)

### 4. Test locally before pushing

```sh
# Site
cd apps/site
pnpm install
pnpm build

# Admin
cd apps/admin
pnpm install
pnpm build
```

Both should complete without errors.

## Commits in This PR

1. **Chore: move site to apps/site**
   - Moves all site files using `git mv` to preserve history
   - 113 file renames, no deletions

2. **Feat: scaffold admin Vite app**
   - Scaffolds minimal Vite + React + TypeScript app
   - Strips demo content, adds `.env.example`

3. **Docs: update README, .gitignore, and CI workflows for multi-app layout**
   - Rewrites root `README.md` with setup guides for both apps
   - Expands root `.gitignore` for both apps
   - Updates CI workflow to run both app checks in parallel

## Future Work

- Admin app: Add Supabase client, auth flow, UI/forms for dashboard
- Site app: No changes expected; maintain as-is
- CI: Could add security scanning, visual regression testing, deploy preview previews
- Docs: Add deployment troubleshooting guide if needed

## Questions?

- See `docs/restructure-plan.md` for planning notes
- Root `README.md` for setup and deployment instructions
- `.github/workflows/ci.yml` for CI configuration
