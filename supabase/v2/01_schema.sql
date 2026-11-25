-- v2 step 1: the new schema, its tables and their access rules.
--
-- Creates everything inside a new `v2` schema. Nothing in `public` (the tables the live site and the current
-- admin use) is created, changed or dropped. Safe to run once; run 99_rollback.sql to undo.
--
-- Reuses public.is_admin() from migrations/20261118120000_admin_access.sql, so the same people who can edit
-- the current site can edit v2.

create schema v2;

-- Team ---------------------------------------------------------------------------------------------------------

-- Same shape as public.team, with created_at as timestamptz. Photos stay in the `team-images` bucket; the
-- column holds the path inside that bucket, not a full URL.
create table v2.team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  department text not null
    check (department in ('Admin', 'Finance', 'Marketing', 'Outreach', 'Events', 'Academics', 'Engineering')),
  picture_path text,
  github_url text,
  linkedin_url text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

-- Guests: people who host or speak at an event but aren't on the LCS team (workshop leads, Meet the
-- Professionals speakers, alumni). One row per person so they can be reused across events.
create table v2.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,                -- role and/or company, e.g. "SWE at Shopify"
  picture_path text,         -- path in the `guest-photos` bucket: <guest_id>/<file>
  link_url text,             -- LinkedIn or personal site
  created_at timestamptz not null default now()
);

-- Events -------------------------------------------------------------------------------------------------------

create table v2.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  start_time time,           -- null when the time isn't set yet ("TBD")
  end_time time,
  location text,
  category text not null default 'other'
    check (category in ('review', 'meet_the_pros', 'workshop', 'hackathon', 'other')),
  will_stream boolean not null default false,
  stream_url text,           -- live stream or recording, once there is one
  created_at timestamptz not null default now(),
  constraint events_end_after_start check (end_time is null or start_time is null or end_time > start_time)
);

create index events_date_idx on v2.events (date desc);
create index events_category_date_idx on v2.events (category, date desc);

-- Photos: many per event, one of them the cover used on cards. Files live in the `event-media` bucket under
-- <event_id>/photos/.
create table v2.event_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references v2.events (id) on delete cascade,
  path text not null unique,
  alt text,
  is_cover boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index event_photos_event_idx on v2.event_photos (event_id, sort_order);
create unique index event_photos_one_cover_idx on v2.event_photos (event_id) where is_cover;

-- Documents: slides, review packages, PDFs. All public. Files live in `event-media` under <event_id>/docs/.
create table v2.event_documents (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references v2.events (id) on delete cascade,
  title text not null,
  path text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index event_documents_event_idx on v2.event_documents (event_id, sort_order);

-- Hosts: each row is one person hosting an event, either a team member or a guest, never both.
create table v2.event_hosts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references v2.events (id) on delete cascade,
  team_id uuid references v2.team (id) on delete cascade,
  guest_id uuid references v2.guests (id) on delete cascade,
  sort_order integer not null default 0,
  constraint event_hosts_one_person check (num_nonnulls(team_id, guest_id) = 1),
  constraint event_hosts_team_once unique (event_id, team_id),
  constraint event_hosts_guest_once unique (event_id, guest_id)
);

create index event_hosts_team_idx on v2.event_hosts (team_id);
create index event_hosts_guest_idx on v2.event_hosts (guest_id);

-- Similar past events, hand-picked in the admin. One-way: event_id's page lists related_id.
create table v2.event_related (
  event_id uuid not null references v2.events (id) on delete cascade,
  related_id uuid not null references v2.events (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (event_id, related_id),
  constraint event_related_not_itself check (event_id <> related_id)
);

create index event_related_related_idx on v2.event_related (related_id);

-- Access ---------------------------------------------------------------------------------------------------------
-- Same rules as phase 1: anyone reads (team only when published), only admins insert, update and delete, and
-- nobody truncates through the API.

grant usage on schema v2 to anon, authenticated;
grant select on all tables in schema v2 to anon, authenticated;
grant insert, update, delete on all tables in schema v2 to authenticated;

do $$
declare
  t text;
begin
  foreach t in array array['team', 'guests', 'events', 'event_photos', 'event_documents', 'event_hosts', 'event_related']
  loop
    execute format('alter table v2.%I enable row level security', t);

    if t = 'team' then
      execute 'create policy "Anyone reads published members; admins read all" on v2.team for select '
        'to anon, authenticated using (is_public or (select public.is_admin()))';
    else
      execute format('create policy "Anyone reads" on v2.%I for select to anon, authenticated using (true)', t);
    end if;

    execute format('create policy "Admins insert" on v2.%I for insert to authenticated '
      'with check ((select public.is_admin()))', t);
    execute format('create policy "Admins update" on v2.%I for update to authenticated '
      'using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('create policy "Admins delete" on v2.%I for delete to authenticated '
      'using ((select public.is_admin()))', t);
    execute format('revoke truncate on v2.%I from anon, authenticated', t);
  end loop;
end;
$$;

-- Hosts who are unpublished team members shouldn't show on the site. The team policy already hides them from
-- the public: a join from event_hosts to v2.team returns no team row for them.
