-- v2 step 3: copy the current data from `public` into `v2`.
--
-- Only reads from public.events and public.team; nothing in `public` changes. Keeps every id, so links and
-- bookmarks still match. Safe to run again (for example right before the new site goes live): rows that already
-- exist are updated from `public`, and fields that only exist in v2 (category after the first copy, will_stream, stream_url, hosts,
-- documents, related events, extra photos) are left as they are.
--
-- Run 04_copy_event_photos.mjs after this to copy the picture files themselves.

begin;

-- Team: same rows; picture_url (a full public URL) becomes the path inside team-images. Roles drop the
-- department ("VP of Marketing" becomes "VP") since department is its own column.
insert into v2.team (id, name, role, department, picture_path, github_url, linkedin_url, is_public, created_at)
select
  t.id,
  t.name,
  regexp_replace(t.role, '^(VP|Director) of .+$', '\1'),
  t.department,
  nullif(substring(t.picture_url from '/team-images/(.+)$'), ''),
  nullif(trim(t.github_url), ''),
  nullif(trim(t.linkedin_url), ''),
  coalesce(t.is_public, false),
  coalesce(t.created_at at time zone 'America/Toronto', now())
from public.team as t
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  department = excluded.department,
  picture_path = excluded.picture_path,
  github_url = excluded.github_url,
  linkedin_url = excluded.linkedin_url,
  is_public = excluded.is_public;

-- Events: the free-text `time` ("7:30PM", "7:30 PM - 9:00 PM", "TBD") becomes start_time and end_time. A time
-- that can't be read is left null; 05_verify.sql lists those so someone can fill them in.
with parsed as (
  select
    e.*,
    regexp_match(upper(coalesce(e.time, '')),
      '^\s*(\d{1,2}):(\d{2})\s*(AM|PM)(?:\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM))?\s*$') as m
  from public.events as e
)
insert into v2.events (id, title, description, date, start_time, end_time, location, category, created_at)
select
  p.id,
  p.title,
  p.description,
  p.date,
  case when p.m is not null then to_timestamp(p.m[1] || ':' || p.m[2] || ' ' || p.m[3], 'HH12:MI AM')::time end,
  case when p.m[4] is not null then to_timestamp(p.m[4] || ':' || p.m[5] || ' ' || p.m[6], 'HH12:MI AM')::time end,
  nullif(nullif(trim(p.location), ''), 'TBD'),
  -- Category from the old `kind`, with the calls made on 2026-11-25 for events it doesn't cover. Anything new
  -- that still doesn't match falls back to social; fix it in the admin.
  case
    when p.title in ('Build-A-Portfolio', 'Code Roulette', 'Code Royale', 'Functional Futures') then 'workshop'
    when p.title in ('Co-op for Dummies', 'Resume Review', 'Professional Headshot Day') then 'career'
    when p.title ilike 'Meet the Professionals%' then 'meet_the_pros'
    when p.title = 'Hack to the Future' then 'hackathon'
    when p.kind in ('review', 'social', 'career', 'workshop', 'hackathon') then p.kind
    else 'social'
  end,
  coalesce(p.created_at at time zone 'America/Toronto', now())
from parsed as p
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  date = excluded.date,
  start_time = excluded.start_time,
  end_time = excluded.end_time,
  location = excluded.location;

-- Cover photos: each event's picture_url becomes its cover, at <event_id>/photos/<original file name> in the
-- event-media bucket ("%20" in a name becomes "-", as 04 does). Only for events that don't have a cover in v2 yet, so a re-run never adds a second one.
insert into v2.event_photos (event_id, path, is_cover, sort_order)
select
  e.id,
  e.id || '/photos/' || replace(substring(e.picture_url from '/events-images/(.+)$'), '%20', '-'),
  true,
  0
from public.events as e
where substring(e.picture_url from '/events-images/(.+)$') is not null
  and not exists (select 1 from v2.event_photos as ph where ph.event_id = e.id and ph.is_cover)
on conflict (path) do nothing;

commit;
