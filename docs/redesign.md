# LCS Website Redesign (2026)

This is the one doc for the redesign: why we're doing it, why Astro, what the site needs to show, and what has to change in Supabase to support it. If something here is out of date, fix it in the same PR as the change.

Owner: Spencer Kelly (VP Engineering). Built with Marketing, who own the visual design.

## Why we're redesigning

- The current site was built last year and does the basics, but it's thin. Events are one picture and a blurb, there's no archive worth browsing, no calendar, and nothing about streams or recordings.
- Keeping it current is a chore. Every new event, photo or exec change means someone touching Supabase by hand.
- We want the site to be an open eng project. Anyone on eng should be able to pick up a piece of it, and Marketing should be able to shape how it looks.
- Feedback on the first preview: people like the new features (calendar, past videos), but the look reads as generic and "vibe coded", especially on mobile. The old site was simple but had real character. The goal is a middle ground: the new features with the old site's personality, designed with Marketing instead of generated.

## Why Astro

- The site is mostly content: events, photos, team. Astro renders that as plain HTML and ships almost no JavaScript by default, so pages are fast.
- Interactive bits (calendar, countdown, filters) are small islands. People can write them in plain TS, React or whatever they're comfortable with, which makes it easy for new members to contribute.
- Pages are file-based, so finding the code for a page is obvious.
- It runs on Vite under the hood, same as the admin app, so tooling feels the same across both.

## Repo layout

```
apps/
  site/    public site (Astro + TypeScript + Tailwind)
  admin/   admin dashboard (Vite + React + TypeScript)
docs/      this file
```

Each app is its own Vercel project (Root Directory set to `apps/site` or `apps/admin`), so they deploy separately. Both talk to the same LCS Supabase project.

## Pages

**Site map:** Home, Events archive, Event detail, Team, Hack to the Future (hackathon recap). The nav shows the social icons (Instagram, Discord, LinkedIn, GitHub, YouTube) with no separate Discord button.

### Home

- **Hero.** Needs a full rethink. It should say who LCS is right away. Ideas: the next event, a few headline stats (events per year, members, students reached) and the mascots.
- **Events.** A calendar marking the days with events, next to the three upcoming events. Each card has the cover photo, title, date, time and location. "View details" goes to the event page, "Archive" goes to the events archive. Needs a state for when nothing is upcoming.
- **What We Host.** A short overview of each kind of event: midterm and exam reviews, Meet the Professionals, hackathons, workshops (starting this winter) and socials. Each links to its filtered archive.
- **YouTube.** A note about the next event and whether it'll be streamed, plus our three latest videos pulled from the channel.
- **Meet the Team.** Photo, name and role, grouped by department. GitHub and LinkedIn icons, and a person can have neither, one or both. Photos come in every size and ratio, so they have to crop cleanly (`object-fit: cover`), which they don't right now.

### Events archive

- The same calendar component as the home page, at the top.
- Every past event below it, newest first, filterable by category.

### Event detail

- Everything on the event: title, cover image, description, date, time, location and category.
- A photo gallery. An event can have many photos, and one is picked as the cover used on cards.
- A series section showing other events in the same series, past and upcoming (for example every CP312 review). This replaces the preview's "earlier in the series" and "similar past events" blocks.
- Has to look fine with or without photos, since older events may only have one.

## Supabase: what we have

| Source | Fields |
| --- | --- |
| `team` table | id, name, picture, role, department, github_url, linkedin_url, is_public, created_at |
| `events` table | id, title, description, date, time, location, picture_url, created_at |
| Storage | team images bucket, event images bucket (one picture per event today) |

## Supabase: what we need

These are proposals. Nothing has been changed in the database yet. Each change goes in as a migration, reviewed before it's applied.

| Change | Why |
| --- | --- |
| `events.category`, one of `reviews`, `meet_the_pros`, `workshops`, `hackathons`, `socials_other` | Archive filters and the What We Host links |
| `event_photos` table (`id`, `event_id`, `path`, `is_cover`, `sort_order`, `created_at`) | Multiple photos per event, plus a cover pick. Replaces `events.picture_url` once data is moved over |
| `series` table (`id`, `name`) and `events.series_id` | The series section on the detail page |
| `events.will_stream` (boolean) | The "will this be streamed" note in the YouTube section |

Open question: we may want a stream or recording link per event later, but it isn't needed for launch.

YouTube videos come from the channel feed, not the database.

## Admin dashboard

A separate app in `apps/admin` so execs can add and edit events, photos and team members without touching code or the Supabase dashboard.

- **Login:** Supabase Auth, invite only. No public sign-up. Execs get an invite and log in with their own email, so we know who changed what and can remove someone when they leave.
- **Access:** every invited exec gets the same access. Row-level security lets anyone read public rows and only signed-in admins insert, update or delete. Storage policies do the same for the image buckets.
- **Keys:** the admin app only ever uses the public anon key. The service role key never goes in client code. If we need something that requires it, it goes in a Supabase Edge Function.

## Design direction

Marketing owns the look. What we're keeping from the current site as a starting point:

- **Fonts:** Dosis for headings, numbers, names and buttons. Montserrat for body text.
- **Colours:**

  | Colour | Hex |
  | --- | --- |
  | Slate (background) | `#2C3844` |
  | Pink | `#FF9FC4` |
  | Orange | `#FF9770` |
  | Yellow | `#FFD670` |
  | Blue | `#268AF9` |
  | Light blue | `#B1E0FF` |
  | White | `#FFFFFF` |

  The accents rotate at random across nav hovers, team card borders and the scrollbar. That randomness is part of the site's personality, so we want to keep it in some form.
- **Assets** (in `apps/site/public/assets`): the LCS icon and long logo (black and white), the mascots Krill, Doug and Coco, the scrapbook letters used for department names, the asterisk and bracket doodles, the icon pattern background, and event photos.

What we need from Marketing: a visual direction, designs for every section on desktop and mobile (mobile got the most criticism), empty and edge states (no upcoming events, no photos, no links, very long titles), copy for the hero and What We Host, and any new assets. Figma is easiest to build from.

## References

- Current live site: [lauriercs.org](https://www.lauriercs.org/)
- Older versions: [GitHub releases](https://github.com/LaurierCS/Website/releases)
- Redesign preview: the Vercel deploy of `feat/astro-redesign-v2`

## How we work on it

- Every piece of work starts with a short plan (an issue or a note) before code.
- Pick something, open a branch off `feat/astro-redesign-v2`, and open a PR back into it using the PR template.
- Frontend PRs include screenshots on desktop and mobile.
- Big changes get run by the exec (Michelle) first.
