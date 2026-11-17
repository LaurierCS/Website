# LCS Website: Astro Redesign Plan

## Overview
Complete rebuild of the LCS website from React to Astro + TypeScript + Tailwind v4. Static mockups serve as design reference. This is a clean rebuild, not a migration of the React app.

## Architecture

### Tech Stack
- **Framework:** Astro (running on Vite)
- **Language:** TypeScript
- **Styling:** Tailwind v4 via `@tailwindcss/vite`
- **Interactivity:** React islands (`@astrojs/react`) only where needed
- **Data:** Supabase (read-only, no migrations)
- **Motion:** Lenis for smooth scrolling, GSAP/motion for micro-interactions
- **Deployment:** Vercel (@astrojs/vercel)

### Constraints
- **Maximum 250 lines per file**—strict modularity enforced
- **Read-only Supabase**—no migrations, inserts, updates, or schema changes
- **No SEO work yet**—skip sitemap, JSON-LD, OG tags (basic `<title>` only)
- **Build against the DB exactly as it exists**—no new tables/columns

## Pages

### 1. Home (`src/pages/index.astro`)
- **Hero:** Full-bleed with "Laurier Computing Society" title (Dosis, no scrapbook letters)
- **Next Event Card:** Live countdown, event details from Supabase
- **Who We Are:** Mission statement
- **Stats Section:** 20 events/year, 44 exec, 4000 students—counts up on scroll
- **Featured Events:** Next 2 upcoming events as cards
- **What We Host:** 4 cards—reviews, MTP, hackathons, workshops (some TODO data)
- **YouTube Section:** Next stream + latest videos (TODO: DB field)
- **Team Departments:** Scrapbook section intro
- **Ambient glow background** (pink, orange, yellow, blue, light-blue accents)

### 2. Events Index (`src/pages/events/index.astro`)
- **Hero:** "Our Events"
- **Filters:** By type, series, date range (TODO: DB fields)
- **Search:** Title/description
- **Calendar View:** Current month + upcoming months
- **Upcoming List:** Cards with next 5+ events
- **Archive By Term:** Past events grouped by semester
- **Pagination:** For archive

### 3. Event Detail (`src/pages/events/[id].astro`)
- **Hero:** Event banner
- **Header:** Title, date, time, location
- **Description:** Rich text
- **Sections:**
  - Event type (workshop, hackathon, review, etc.) — TODO: DB field
  - Series info — TODO: DB field
  - Resources (slides, docs, recordings) — TODO: DB table
  - YouTube recording — TODO: DB field
  - Event photos — TODO: DB table
  - Related events — TODO: DB field or manual linking
- **CTA:** Register/Join Discord
- **Note:** `/events/[id]` uses UUID; switch to slug once `events.slug` exists

### 4. Hack to the Future (`src/pages/hack-to-the-future/index.astro`)
- **Hero:** Recap title + banner
- **Winners Section:** By category (ported from `hackathonData.ts`)
- **Photos:** Event highlights
- **Next Hackathon CTA:** Link back to events
- **Prerendered:** Static content

## Components

### Layout (`src/layouts/`)
- **BaseLayout.astro** — Common head, nav, footer, background, glows
- **PageLayout.astro** — Hero + content sections with scroll-reveal

### Universal (`src/components/universal/`)
- **Header.astro** — Nav with random accent colors on link hover, blur-on-scroll, mobile menu
- **NavLink.astro** — Random accent per hover (never same twice), animated underline
- **SocialLinks.astro** — Discord, GitHub, LinkedIn, Instagram, Twitter (from current site)
- **Footer.astro** — Links, copyright, contact
- **PatternBackground.astro** — Gradient base + tiled Icon_Pattern.svg (800px desktop, 600px mobile, -15° rotation, ~2% opacity, fixed)
- **AmbientGlows.astro** — Slow, blurred gradient glows (pink, orange, yellow, blue, light-blue), GPU-friendly (transform/opacity only), respects `prefers-reduced-motion`
- **ScrapbookText.tsx** (React island) — Ported from React, identical styling (random rotation/offset/scale, marginRight -45% overlap, drop shadow). Only A C D E F G H I K L M N O P R S T U V W supported; fallback to normal text otherwise.
- **SmoothScroller.tsx** (React island) — Lenis integration for smooth scrolling site-wide

### Home (`src/components/home/`)
- **HeroSection.astro** — Title, tagline, CTA
- **NextEventCard.tsx** (React island) — Live countdown, event details
- **CountUpStats.tsx** (React island) — 20 events, 44 exec, 4000 students; count up on scroll
- **WhoWeAre.astro** — Mission text
- **FeaturedEvents.astro** — Next 2 events as cards with hover lift/tilt
- **WhatWeHost.astro** — 4 category cards (reviews, MTP, hackathons, workshops)
- **YouTubeSection.astro** — Next stream placeholder, latest videos (TODO: DB integration)

### Events (`src/components/events/`)
- **EventCard.tsx** (React island) — Hover lift/tilt effect
- **EventFilter.tsx** (React island) — Type, series, date range (TODO: form state)
- **EventSearch.tsx** (React island) — Live search by title/description
- **EventCalendar.tsx** (React island) — Calendar grid
- **EventList.astro** — Upcoming + archive sections
- **EventArchive.astro** — Grouped by term, paginated

### Event Detail (`src/components/event/`)
- **EventHero.astro** — Banner, title, date, time, location
- **EventDescription.astro** — Rich text
- **EventType.astro** — TODO: badge with event type
- **EventSeries.astro** — TODO: related series info
- **EventResources.astro** — TODO: slides, docs, recordings (stub data)
- **EventYouTube.astro** — TODO: recording embed (stub data)
- **EventPhotos.astro** — TODO: gallery (stub data)
- **RelatedEvents.astro** — TODO: manually linked events (stub data)

### Team (`src/components/team/`)
- **TeamDepartment.astro** — Department heading (using ScrapbookText for heading), member list
- **TeamCard.tsx** (React island) — Hover lift/tilt, role, department, social links
- **TeamGrid.astro** — All departments (Admin, Finance, Marketing, Outreach, Events, Academics, Engineering)

### Hackathon (`src/components/hackathon/`)
- **HackToTheFutureHero.astro** — Recap title
- **WinnersSection.astro** — Categories with cards
- **HackathonPhotos.astro** — Gallery

## Data & Queries

### Supabase Tables (Read-Only)
```
events (id, title, description, date, time, location, picture_url, created_at)
team (id, name, picture_url, role, department, github_url, linkedin_url, is_public, created_at)
```

### Query Files (`src/lib/queries/`)
- **events.ts** — `getEvents()`, `getEventById(id)`, filter/sort helpers
- **team.ts** — `getTeamMembers()` filtered by `is_public = true`, sorted by department then hierarchy

### Supabase Client (`src/lib/supabase.ts`)
- Initializes Supabase client with typed queries

### TODO Data (`src/lib/todo-data.ts`)
Typed stubs for missing DB fields. Each stub:
- Clearly marked as placeholder
- Carries `// TODO(db): needs events.<field>` comment
- Used in components only when real data is available

**Missing fields:**
- `events.type` (workshop, hackathon, review, etc.)
- `events.series` (related series info)
- `events.youtube_recording_url` (recording embed)
- `events.is_streamed` / `events.next_stream_time` (stream status)
- Resources table: event ID, type, URL (slides, docs, recordings)
- Event photos table: event ID, photo URL
- Event-to-event relationships table: manual linking
- YouTube videos table or YouTube API integration

## Styling & Theme

### Colors & Gradients
- **Background:** `linear-gradient(135deg, #0e263d 0%, #0c2238 100%)` + tiled pattern (fixed, -15° rotation)
- **Accent colors:** Pink `#FF9FC4`, Orange `#FF9770`, Yellow `#FFD670`, Blue `#268AF9`, Light-blue `#B1E0FF`
- **Light sections:** Off-white/light-blue (`#F3F7FC`) with dark ink text, floated over dark patterned background

### Fonts
- **Headings:** Dosis (from current site)
- **Body:** System stack or current site font
- **Scrapbook letters:** Only on team dept headings; supported: A C D E F G H I K L M N O P R S T U V W

### Motion
- **Scroll reveal:** Staggered animations on sections/cards (fade-in + slide-up)
- **Parallax:** Subtle on mascots and doodles
- **Hover:** Card lift/tilt, link underlines, button scale
- **Scrollbar:** Random accent color on load (ported from `useRandomScrollbarColor`)
- **Countdown:** Live ticker on next-event card
- **Stats:** Count-up animation on scroll (Intersection Observer)
- **Ambient glows:** Slow, continuous motion (paused under `prefers-reduced-motion`)
- **Smooth scroll:** Lenis integration for all navigation and anchor links

### Accessibility
- Respect `prefers-reduced-motion`—disable parallax, slow glows, but keep interactive feedback
- Use semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation on menus

## Deployment

### Environment Variables
- `SUPABASE_URL` (read on server via `import.meta.env`)
- `SUPABASE_ANON_KEY` (read on server via `import.meta.env`)
- Update `.env.example`

### Vercel Setup
- Use `@astrojs/vercel`
- Home, `/events`, `/events/[id]` with `prerender = false` (live data)
- `/hack-to-the-future` and other static pages with `prerender = true` (or default static)
- Caching: 1 hour on event pages, 24 hour on static

## TODOs

### Database
- [ ] Add `events.type` (enum: workshop, hackathon, review, series, etc.)
- [ ] Add `events.series` (text or FK to series table)
- [ ] Add `events.youtube_recording_url` (text)
- [ ] Add `events.is_streamed`, `events.next_stream_time` (bool, timestamp)
- [ ] Create `event_resources` table (id, event_id, type, url)
- [ ] Create `event_photos` table (id, event_id, photo_url, created_at)
- [ ] Create `event_relations` table (id, event_id, related_event_id, for manual linking)
- [ ] Add `events.slug` column, backfill, make unique (switch from UUID route)
- [ ] YouTube videos table or API integration

### Frontend
- [ ] Integrate YouTube API for "latest videos" section
- [ ] Add event type badges to cards and filters
- [ ] Implement series grouping and filtering
- [ ] Build event photo gallery with lightbox
- [ ] Add event registration CTA (link to Discord or external form)
- [ ] Implement countdown animations
- [ ] Test SEO later (OG tags, JSON-LD, sitemap)

### Verification Checklist
- [ ] `pnpm install` succeeds
- [ ] `pnpm astro check` passes (no TS errors)
- [ ] `pnpm build` succeeds
- [ ] `pnpm preview` loads without errors
- [ ] No file exceeds 250 lines
- [ ] Home page: hero, next event, stats, featured events, what we host, YouTube, team preview
- [ ] Events page: filters, search, calendar, upcoming list, archive
- [ ] Event detail: all sections render correctly, handles missing data gracefully
- [ ] Hack to the Future: winners, photos, navigation
- [ ] Mobile: all pages responsive at 375px width
- [ ] Desktop: all pages render at 1440px+ width
- [ ] Hover effects: card lift/tilt, nav link colors, scrollbar color on load
- [ ] Scroll animations: reveal, parallax, count-up stats, countdown
- [ ] Smooth scrolling works (Lenis)
- [ ] Navigation links work (anchor links with offset)
- [ ] Nav blur-on-scroll works
- [ ] Footer links work
- [ ] Performance: Lighthouse > 80 on home page
- [ ] Dark mode: ambient glows visible, light sections readable

## Commits Strategy

Logical commits by feature:
1. `docs: add Astro redesign plan`
2. `chore: remove React app and scaffold Astro + Tailwind`
3. `feat(lib): add read-only Supabase queries for events and team`
4. `feat(ui): add layout, background, glows, nav and footer`
5. `feat(ui): port ScrapbookText`
6. `feat(home): build hero, stats, featured events sections`
7. `feat(home): add next event card and YouTube section`
8. `feat(events): build event list and calendar`
9. `feat(events): build event detail page`
10. `feat(hackathon): add hack-to-the-future page with winners`
11. `feat(motion): add scroll-reveal, parallax, and animations`
12. `feat(motion): integrate Lenis smooth scrolling`
13. `docs: rewrite README with setup, structure, and deployment`

Each commit must pass `pnpm build`.

## File Size Audit

Enforce 250-line limit:
```bash
find src -type f \( -name "*.astro" -o -name "*.tsx" -o -name "*.ts" \) | xargs wc -l | sort -n | tail
```

## Next Steps

1. Create this plan (DONE)
2. Commit the plan
3. Delete React app, scaffold Astro
4. Build lib queries
5. Build layout + components
6. Build pages
7. Add motion & animations
8. Test & verify
9. Open PR
