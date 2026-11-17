# Laurier Computing Society

The public LCS site. Astro, TypeScript, and Tailwind v4. Pages that read Supabase render on each request so a new event shows up without a redeploy.

## Setup

Node.js and pnpm.

```sh
git clone https://github.com/LaurierCS/Website
cd Website
pnpm i
cp .env.example .env
```

Ask a VP of Engineering for `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Put them in `.env`. They are server-only. Do not prefix them with `PUBLIC_` and do not commit `.env`.

```sh
pnpm dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Local server |
| `pnpm check` | `astro check` |
| `pnpm build` | Production build (Vercel output) |
| `pnpm preview` | Serve the build locally |

## Structure

- `src/pages/` routes. `/`, `/events`, and `/events/[id]` set `prerender = false`. `/hack-to-the-future` is prerendered.
- `src/components/` UI, split by page.
- `src/layouts/Base.astro` nav, footer, background, glows.
- `src/styles/` tokens ported from the redesign mockups.
- `src/lib/supabase.ts` server client.
- `src/lib/queries/` read-only `events` and `team` queries.
- `src/lib/department.ts` role to department and hierarchy, from the previous site.
- `src/lib/site.ts` hero stat numbers and social URLs.
- `src/lib/todo-data.ts` empty stubs for fields that are not in the database yet.
- `src/lib/hackathon.ts` March 2026 winners and the project list.
- `public/` logos, mascots, letter assets, favicons.

`design-ref/` is a local copy of the HTML mockups. It is git-excluded.

## Supabase

Read-only. No migrations and no writes from this app.

`events`: `id`, `title`, `description`, `date`, `time`, `location`, `picture_url`, `created_at`.

`team`: `id`, `name`, `picture_url`, `role`, `department`, `github_url`, `linkedin_url`, `is_public`, `created_at`. The team page loads `is_public = true` and groups people with the role map, not the `department` column.

The event URL is `/events/[id]`. Switch that to a slug once `events.slug` exists.

Null `description`, `time`, and `picture_url` render as "coming soon", "Time TBA", or a letter poster. A failed query shows a short error and does not crash the page.

## TODO(db)

These components are built. The arrays in `src/lib/todo-data.ts` are empty, so the UI says coming soon instead of inventing records.

| Stub | Needs |
| --- | --- |
| Event type | `events.type` (`review`, `mtp`, `workshop`, `hackathon`, `other`) |
| Series | `events.series` |
| Streamed flag | `events.is_streamed` |
| Recording | `events.youtube_url` |
| Slug | `events.slug` |
| Resources | `event_resources` (`event_id`, `title`, `kind`, `url`, `note`) |
| Related events | `event_links` (`event_id`, `related_event_id`, `sort`) |
| Photos | `event_photos` |
| Latest videos | `videos`, or the YouTube API |

`docs/redesign-plan.md` maps each mockup section to the component that renders it.

## Deploy

Vercel, via `@astrojs/vercel`. Set the same two env vars on the project. `vercel.json` does not rewrite routes. The adapter serves them.

Pushing `main` is the production deploy. Feature work stays on a branch.
