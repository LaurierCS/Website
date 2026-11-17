# LCS Astro redesign plan (v2)

Source of truth: `design-ref/` (copied from `~/gh/lcsd`, git-excluded). Pages are `src/index.html`, `src/events.html`, `src/event.html`, `src/hack-to-the-future.html`, shared `src/_nav.html` and `src/_footer.html`, tokens in `css/lcs.css`, behavior notes in `style-guide.html` and `mobile.html`. Screenshots in `design-ref/shots/` are the visual check.

This rebuild starts from `main`. Nothing is reused from `feat/astro-redesign`.

## Allowed differences from the mockups

1. **Page background** is the live site, not mockup slate `#2C3844`. `linear-gradient(135deg, #0e263d 0%, #0c2238 100%)` plus `/assets/patterns/Icon_Pattern.svg`, tiled at 800px desktop / 600px under 768px, opacity 0.02, rotated -15deg, `position: fixed`. From `PatternBackground.tsx`.
2. **`.section.deep` flips to light.** Background `#F3F7FC`, ink `#0F172A`, secondary text `#334155`. Ticket punch-outs use the light section color. Eyebrows and “Up next” use darker accent ink so they stay readable (`#9a4d6c`, `#8a6414`, `#0b5cad`, `#b85a32`). Cards, tickets, calendars, and code windows stay the mockup’s dark surfaces. Page heads (`.page-head`, `.ev-head`, `.hh`), nav, and footer stay dark.
3. **Ambient glows.** Fixed, blurred orbs in `#FF9FC4`, `#FF9770`, `#FFD670`, `#268AF9`, `#B1E0FF`. Animation is transform and opacity only, and it pauses under `prefers-reduced-motion`.
4. **Hero title** is “Laurier Computing Society” in Dosis 800. No scrapbook letters in the hero (B, Y, and J have no assets). The mockup line “Learn, build and meet people who love computing.” stays underneath, with the gradient on “love computing.”
5. **Scrapbook letters** for team department headings. Every department name in `departmentMap.ts` is fully supported (A C D E F G H I K L M N O P R S T U V W). Anything else falls back to Dosis text. Same overlap (`marginRight: -size * 0.45`), random rotation ±3°, offset ±1px, scale 0.98–1.02, and drop shadow. Entrance animation may change.
6. **Nav** has no “Join Discord” button. Socials are Instagram, Discord, LinkedIn, GitHub, and YouTube from `SocialLinks.tsx`. Blur appears after scroll. Mobile menu keeps those links and the socials. Nav links pick a random accent on hover, never the same color twice in a row, with an animated underline.
7. **Scrollbar** thumb uses one random accent, chosen on load (`--scrollbar-color`).
8. **Stats** count up to the live-site numbers, stored in `src/lib/site.ts`: 20 events a year, 44 exec members, 4000 students, plus the mockup’s fourth stat (2012, founded as PHI Society, not animated).
9. **Team** follows the current site, not the mockup’s six-avatar filter: public members grouped by department and role hierarchy, horizontal cards with photo, role, GitHub, and LinkedIn. Section chrome (eyebrow, spacing) matches the mockup.
10. **Missing database fields** render real components fed by `src/lib/todo-data.ts`. Empty stubs show a short “coming soon” line. Placeholder rows are labelled preview and are never presented as live club data.

## Tokens ported from `lcs.css`

| Token | Value | Use |
| --- | --- | --- |
| `--bg-deep` | `#0F172A` | Page heads, footer, code windows, card.deep |
| `--bg-card` | `#344250` | Cards, tickets, calendar, minis |
| `--bg-titlebar` | `#1E2429` | Code window bar |
| `--border` | `#475569` | 1px borders |
| `--pink` | `#FF9FC4` | Primary button, industry, MTP |
| `--orange` | `#FF9770` | Workshops |
| `--yellow` | `#FFD670` | Reviews, today ring |
| `--blue` | `#268AF9` | Accent |
| `--light-blue` | `#B1E0FF` | Hackathons, secondary button, ticket meta |
| `--grad` | `#6CB3FF → #89F7FE` | `.hl` clipped text |
| `--radius` / `--radius-sm` | `20px` / `14px` | Cards, tickets, resource rows |
| `--max` | `1280px` | `.wrap` |
| `--font-head` | Dosis 500–800 | Headings |
| `--font-body` | Montserrat 300–700 | Body |
| `.wrap` | padding `0 40px`, `20px` under 860px | All sections |
| `.section` | padding `96px 0`, `64px 0` under 860px | Section rhythm |
| `.h-sec` | `clamp(34px, 4.4vw, 52px)`, weight 800 | Section titles |
| `.lede` | 18px, weight 300, max-width 640px | Intros |
| `.eyebrow` | 13px, weight 600, tracking 0.18em, uppercase | Section labels |

### Components and the classes that define them

- **Buttons** `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-sm`. Pill radius, 13×22 padding (9×16 small), weight 600, 15px. Primary fill pink, ink text, hard shadow `0 4px 0 #c76d92` (6px on hover). Hover `translateY(-2px)`.
- **Pills** `.pill` plus `.pink` `.yellow` `.orange`. 12px, 5×12, radius 999, translucent fill and 1px border.
- **Chips** `.chip` / `.chip.on`. Filter controls. On state is light-blue fill with ink text.
- **Code window** `.window`, `.window-bar`, dots `#FF5F57` `#FEBC2E` `#28C840`, `pre` 15px/1.7, padding 22×24. Shadow `0 30px 60px -20px rgba(0,0,0,.6)`. Tokens `.c-k` `.c-p` `.c-s` `.c-n` `.c-c`.
- **Ticket** `.ticket` grid `120px 1fr` (92px under 860px). Punch circles 18px at left 112px (83px on small screens). Date column dashed right border. `.sticker` yellow (or `.pink` `.blue` `.orange`), rotate -4deg, shadow `0 4px 0 rgba(0,0,0,.25)`, day 38px Dosis. Hover lifts and tilts.
- **Mini** `.mini` cover 16/9, body padding 18×20, date 12px tracking 0.14em yellow. Hover `translateY(-4px)` and pink border.
- **Calendar** `.cal` padding 24, `.cal-day` min-height 84 (52 on small), radius 12, today border yellow. Event chips 11px (dots only under 860px). Legend swatches 10px.
- **Initiative** `.init`, `.badge` 64px, radius 16, rotate -4deg.
- **Team** current-site row cards, accent ring from the member id. Department title is scrapbook at 68px (36px mobile).
- **Resources** `.res-row`, `.ficon` 48px radius 10, orange (pink for video).
- **Grids** `.g2` `.g3` `.g4` gap 24. `.g4` becomes 2 columns under 1100px and 1 under 520px. `.g2` and `.g3` collapse under 860px.

## Page map

### Home `/` (`prerender = false`)

| Mockup block | Component | Notes |
| --- | --- | --- |
| Nav | `shell/Nav.astro` + `shell/nav.ts` | Links: About `#about`, Events `/events`, What We Host `#host`, Videos `#videos`, Team `#team`, Hackathon `/hack-to-the-future`. Socials replace the Discord button. |
| Hero copy + CTAs | `home/Hero.astro` | Doodles Asteriks and Bracket, hidden under 860px. CTAs: `#events` and Discord. |
| Next event code window | `home/NextEvent.astro`, `home/Countdown.tsx` | Next upcoming row. Krill, window rotated 1.2deg. Fields from the row; null time/location become “Time TBA” / “Location TBA”. Countdown ticks every second. |
| Stats | `home/Stats.astro` + `home/count-up.ts` | Four `.stat` cells. Numbers from `src/lib/site.ts`. |
| Events this month | `home/MonthEvents.astro`, `events/Calendar.astro` | Light section. Calendar of the next event’s month, or this month. Two `.ticket`s. |
| What We Host | `home/HostGrid.astro` | Four `.card.init` links. “Last …” only when a real past event can be typed; otherwise the line is omitted. |
| YouTube + next stream | `home/Videos.astro` | Light section. Stream banner and video grid from `todo-data`. Coming soon when empty. |
| Team | `team/TeamSection.astro`, `team/TeamCard.astro` | Live `team` query. |
| Footer | `shell/Footer.astro` | Mockup four-column footer, real social URLs. |

### Events `/events` (`prerender = false`)

| Mockup block | Component | Notes |
| --- | --- | --- |
| Page head | `events/EventsHero.astro` | Doug, absolute, smaller and faded under 960px. |
| Filters + search | `events/EventsBrowser.astro` + `events/browser.ts` | Chips filter `data-type`. Untyped events only match All. Search matches title, description, location. |
| Calendar + upcoming | `events/Calendar.astro`, `events/Ticket.astro` | Upcoming list is every future event, soonest first. |
| Archive by term | `events/Archive.astro`, `events/MiniCard.astro` | Past events, newest term first. Term from the date: Sep–Dec Fall, Jan–Apr Winter, May–Aug Spring. Cover uses `picture_url` or a type-colored placeholder. |

### Event detail `/events/[id]` (`prerender = false`)

`// TODO: switch to slug once events.slug exists`

| Mockup block | Component | Notes |
| --- | --- | --- |
| Head + poster | `events/EventHero.astro` | Crumb, pills when type/series/stream exist. Poster is `picture_url` or a type-colored initial block with Coco. Add-to-calendar downloads an `.ics` built from `date` + parsed `time`. |
| About | `events/EventAbout.astro` | Real `description`, or a one-line empty state. |
| Resources + embed | `events/Resources.astro` | `todo-data` resources for this id. Coming soon when none. |
| Earlier in the series | `events/SeriesDocs.astro` | Same, hidden or coming soon. |
| Details + series card | `events/EventAside.astro` | When / where from the row. Host and stream lines only from stubs. |
| Similar events | `events/RelatedEvents.astro` | Manual links from stubs, else coming soon. |

Unknown id: a short not-found state and a link back to `/events`, still HTTP 404.

### Hack to the Future `/hack-to-the-future` (prerendered)

| Mockup block | Component | Notes |
| --- | --- | --- |
| Recap hero | `hack/HackHero.astro` | Stats 48h, 42 projects, $700, 6 prizes. Coco and Krill. Devpost link from `hackathonData`. |
| Podium + category awards | `hack/Podium.astro` | Winners from `HACKATHON_PRIZES` and `HACKATHON_CATEGORY_AWARDS`. |
| Challenge + code window | `hack/Challenge.astro` | Light section. Copy from `HACKATHON_CHALLENGE_OPTIONS`. Rooms LH1011 and N2085. |
| Project gallery | `hack/Gallery.astro` | Names from `HACKATHON_PRESENTATIONS`, winners highlighted. |
| Photos | `hack/Photos.astro` | Dashed slots. Real photos only if a stub lists them; otherwise “Photos coming soon”. |
| CTA | `hack/HackCta.astro` | Pink band, Discord. |

## Data

Read-only. No migrations, writes, or new columns.

- `src/lib/supabase.ts` creates the client from `import.meta.env.SUPABASE_URL` and `SUPABASE_ANON_KEY` on the server. Missing env or a failed query returns an error the page can render. The key is never sent to the client and never printed.
- `src/lib/queries/events.ts` selects `id, title, description, date, time, location, picture_url, created_at`, ordered by `date`.
- `src/lib/queries/team.ts` selects public rows (`is_public = true`). Grouping and sort use `src/lib/department.ts` (ported from `departmentMap.ts`). The `department` column is not the sort key.
- `src/lib/todo-data.ts` holds typed stubs. Each export is commented `// TODO(db): needs …` using the style-guide table.

### TODO(db)

| Stub | Needs | UI when empty |
| --- | --- | --- |
| Event type | `events.type` (`review`, `mtp`, `workshop`, `hackathon`, `other`) | No type pill. Filters other than All match nothing. Host “last event” line omitted. |
| Series | `events.series` | Series card and prior-docs block show coming soon. |
| Streamed flag | `events.is_streamed` | No streamed pill. Next-stream banner says coming soon. |
| YouTube recording | `events.youtube_url` | No embed. |
| Resources | `event_resources` (`event_id`, `title`, `kind`, `url`, `note`) | Coming soon inside the resources card. |
| Related events | `event_links` (`event_id`, `related_event_id`, `sort`) | Coming soon. |
| Photos | `event_photos` | Dashed “Photos coming soon” on the recap. Not used as if they were real photos. |
| Latest videos | `videos` or the YouTube API | Video grid coming soon. |
| Slug | `events.slug` | Routes stay `/events/[id]`. |

`events.start_at` / `events.end_at` are not required for v1. Calendar and countdown use `date`. Time stays the text column. `.ics` uses a parsed start when `time` looks like `7:00 PM`, and a one-hour duration when no end is present.

## Motion

- Lenis on the document, destroyed when `prefers-reduced-motion: reduce`. Anchor clicks offset by the 76px nav.
- Scroll reveals: one shared `motion/reveal.ts` toggles `.is-in` on `[data-reveal]`. Stagger via `data-reveal-delay`. Reduced motion shows everything immediately.
- Mascots and doodles: slow translate on scroll, transform only, disabled when reduced motion is set.
- Tickets, minis, cards, and buttons use the mockup hover lift. Tickets add a 0.6deg tilt.
- Stats count with `requestAnimationFrame` once the row intersects.
- Countdown interval is cleared on teardown.

## Stack

Astro + TypeScript + Tailwind v4 (`@tailwindcss/vite`) for tokens and a few utilities. Mockup layout lives in ported global CSS (`src/styles/tokens.css`, `components.css`, `pages.css`) so spacing matches `lcs.css`. React (`@astrojs/react`) only for the countdown island and scrapbook letters. `@astrojs/vercel` is the adapter. `output` stays static; home, `/events`, and `/events/[id]` set `prerender = false`.

`vercel.json` loses the SPA rewrite. The Vercel adapter serves the routes. Keeping the rewrite would send every path to `index.html`.

Every file stays under 250 lines.

## Verify

`pnpm install`, `pnpm astro check`, `pnpm build`, `pnpm preview`. Line count via `find src -type f | xargs wc -l | sort -n | tail`. Screenshots of `/`, `/events`, one real event, and `/hack-to-the-future` at 1440 and 390, compared with `design-ref/shots/`.
