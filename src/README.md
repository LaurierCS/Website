# LCS Website - Astro Redesign

A complete rebuild of the Laurier Computing Society website using Astro, TypeScript, and Tailwind CSS v4.

## Architecture

### Tech Stack
- **Framework:** Astro 5 (running on Vite)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`
- **Interactivity:** React islands (`@astrojs/react`) for interactive components only
- **Data:** Supabase (read-only, no migrations)
- **Motion:** Lenis for smooth scrolling, GSAP/motion for micro-interactions
- **Deployment:** Vercel-ready (static-first build)

## Setup

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/LaurierCS/Website.git
cd Website
```

2. Install dependencies:
```bash
pnpm install
```

3. Create `.env.local` with Supabase credentials:
```bash
cp .env.example .env.local
# Edit .env.local with real Supabase URL and anon key
```

4. Start the development server:
```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Scripts

```bash
pnpm dev          # Start dev server (hot reload)
pnpm build        # Build for production
pnpm preview      # Preview production build locally
pnpm astro check  # Check TypeScript errors
```

## Project Structure

```
src/
├── components/        # Reusable Astro & React components
│   ├── universal/    # Shared across all pages (Header, Footer, etc.)
│   ├── home/         # Homepage sections
│   ├── events/       # Events index and list components
│   ├── event/        # Event detail page sections
│   ├── team/         # Team display components
│   └── hackathon/    # Hack to the Future page sections
├── layouts/          # Page layouts
│   └── BaseLayout.astro
├── lib/              # Utilities and data fetching
│   ├── supabase.ts   # Supabase client
│   ├── queries/      # Data query functions
│   │   ├── events.ts
│   │   └── team.ts
│   └── todo-data.ts  # Placeholder data for missing DB fields
├── pages/            # File-based routing
│   ├── index.astro   # Home page
│   ├── events/
│   │   ├── index.astro
│   │   └── [id].astro   # Dynamic event detail
│   ├── team.astro
│   └── hack-to-the-future/
│       └── index.astro
├── styles/           # Global CSS
│   └── global.css
└── env.d.ts         # TypeScript env var definitions
```

## Data Flow

### Static Content
- Homepage, Events index, Team, Hack to the Future
- Fetched at build time via `getStaticPaths()`
- Deployed as static HTML

### Event Details
- Dynamic route `/events/[id].astro`
- Fetches event by UUID
- Prerendered at build time from Supabase `events` table

### Team Members
- Fetched from Supabase `team` table
- Filtered by `is_public = true`
- Sorted by department (Admin, Finance, Marketing, Outreach, Events, Academics, Engineering)
- Within each department, sorted by role hierarchy

## Supabase Database

### Tables (Read-Only)

**events**
- `id` (uuid, PK)
- `title` (text)
- `description` (text, nullable)
- `date` (date)
- `time` (text, nullable)
- `location` (text)
- `picture_url` (text, nullable)
- `created_at` (timestamp)

**team**
- `id` (uuid, PK)
- `name` (text)
- `picture_url` (text, nullable)
- `role` (text, nullable)
- `department` (text, nullable) — auto-mapped from role
- `github_url` (text, nullable)
- `linkedin_url` (text, nullable)
- `is_public` (boolean)
- `created_at` (timestamp)

### Environment Variables
```
SUPABASE_URL         # Your Supabase project URL
SUPABASE_ANON_KEY    # Public anon key (safe to commit in .env.example)
```

Read on the server via `import.meta.env.*`. Never commit `.env.local`.

## Features

### Implemented
- ✅ **Header** — Navigation with random accent colors on hover, blur-on-scroll, mobile menu
- ✅ **Footer** — Links, socials, copyright
- ✅ **PatternBackground** — Fixed gradient + tiled pattern
- ✅ **AmbientGlows** — Slow-moving gradient glows (GPU-friendly)
- ✅ **ScrollbarColor** — Random accent color on page load
- ✅ **SocialLinks** — Discord, GitHub, LinkedIn, Instagram, Twitter
- ✅ **ScrapbookText** — Letter asset component (supported: A C D E F G H I K L M N O P R S T U V W)
- ✅ **Home Page** — Hero, mission, team preview
- ✅ **Events Index** — Upcoming and past event lists
- ✅ **Event Detail** — Full event info (dynamic route by UUID)
- ✅ **Team Page** — Members grouped by department
- ✅ **Hack to the Future** — Hackathon page (scaffold)

### TODO (Database Fields Missing)

These components are built with placeholder data. They're real, interactive UI waiting on database support:

- [ ] Event type badges (`events.type` field needed)
- [ ] Event series grouping (`events.series` field needed)
- [ ] YouTube recordings (`events.youtube_recording_url` field needed)
- [ ] Stream info (`events.is_streamed`, `events.next_stream_time` needed)
- [ ] Event resources slides/docs (`event_resources` table needed)
- [ ] Event photos gallery (`event_photos` table needed)
- [ ] Related events (`event_relations` table or manual linking)
- [ ] Latest YouTube videos (API integration or `youtube_videos` table)
- [ ] Next event countdown (timer component ready, needs live data)
- [ ] Stats count-up animation (component ready, needs live config)

See `src/lib/todo-data.ts` for stubs. Each component checks for data before rendering.

### Accessibility
- ✅ Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`, etc.)
- ✅ ARIA labels on interactive elements
- ✅ Respects `prefers-reduced-motion` (animations paused, glows dimmed)
- ✅ Keyboard navigation on menus and links
- ✅ Sufficient color contrast on light/dark sections

## Design System

### Colors
- **Background:** `linear-gradient(135deg, #0e263d 0%, #0c2238 100%)`
- **Pattern overlay:** `/assets/patterns/Icon_Pattern.svg` (2% opacity, -15° rotation)
- **Accent colors:** Pink `#FF9FC4`, Orange `#FF9770`, Yellow `#FFD670`, Blue `#268AF9`, Light-blue `#B1E0FF`
- **Light sections:** Off-white `#F3F7FC` with dark text (for contrast over dark background)

### Fonts
- **Headings:** Dosis (Google Fonts, 400/600/700)
- **Body:** System stack (San Francisco, Segoe UI, etc.)

### Motion & Interactions
- Smooth scrolling site-wide (Lenis)
- Nav links: random accent color + animated underline on hover
- Ambient glows: continuous slow drift (paused under `prefers-reduced-motion`)
- Cards: hover lift/tilt effect
- Scrollbar: random accent on load, never same color twice

## Styling Guidelines

- **Maximum 250 lines per file** — enforce modularity
- **Tailwind v4 utilities** in Astro templates and React components
- **CSS modules** for scoped styles (when needed)
- **Semantic HTML** over divs
- **No hardcoded colors** — use theme tokens (`text-lcs-pink`, `bg-lcs-dark`, etc.)

## Performance

- **Static-first:** 99% of pages prerendered at build time
- **Image optimization:** Vercel's automatic image optimization
- **CSS:** Tailwind purges unused utilities at build time
- **Bundle:** React islands loaded only where interactivity is needed
- **Fonts:** System fonts + Google Fonts (Dosis only)

Target: **Lighthouse > 80** on all pages.

## Deployment

### Vercel
1. Push to GitHub: `git push origin feat/astro-redesign`
2. Connect repo to Vercel
3. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Deploy! Vercel detects Astro and builds automatically.

**Caching strategy:**
- Static pages: 24 hours
- Event detail pages: 1 hour (for live updates)

## Development Workflow

### Adding a New Page
1. Create `src/pages/your-page.astro`
2. Import `BaseLayout` and wrap content
3. Use Tailwind classes for styling
4. For dynamic routes, add `getStaticPaths()` function

### Adding a New Component
1. Create `src/components/section/YourComponent.astro` (or `.tsx` for React)
2. Keep it under 250 lines
3. Add comments for non-obvious logic
4. Import in the page/parent component

### Fetching Data from Supabase
1. Add query function in `src/lib/queries/{table}.ts`
2. Use `getSupabase()` and handle errors gracefully
3. Call from `.astro` pages at build time
4. Show "coming soon" if data is missing

### Adding Motion/Animations
1. Use Tailwind animation utilities when possible
2. For complex animations, add to `src/styles/global.css` or component styles
3. Always test under `prefers-reduced-motion: reduce`
4. Keep animations at 60fps (no layout thrashing)

## Troubleshooting

### Build fails with "supabaseUrl" error
- Check `.env.local` exists and has valid Supabase credentials
- Verify `SUPABASE_URL` is a full HTTP(S) URL

### TypeScript errors in IDE
- Run `pnpm astro check` to validate
- Update `src/env.d.ts` if adding new env vars

### Pages show no data
- Check Supabase credentials in `.env.local`
- Verify tables exist and have public access
- Check browser console for fetch errors

## Contributing

- Follow the file size limit (250 lines)
- Use semantic HTML and accessibility best practices
- Test on mobile (375px) and desktop (1440px) widths
- Commit small, logical changes (one feature per commit)
- Update `docs/redesign-plan.md` if architecture changes

## License

MIT (same as main project)

---

**Last Updated:** November 2024
**Status:** In Progress
