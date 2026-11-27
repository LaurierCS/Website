-- v2 step 8: companies, photos and posters. Only adds; nothing is dropped or renamed.
--
--   companies           the companies guests work at: name, brand colour and logo (`company-logos` bucket)
--   guests.company_id   where a guest works; their `title` is then just the job title ("Analyst")
--   photos              photos from the camera: taken at an event (event_id), of the team (is_team_photo), or
--                       both. Files live in the new `event-photos` bucket
--   photo_guests        which guests are in which photos, so a speaker shows their own photos
--   events.poster_path  each event's poster, in `event-media`, filled from today's cover rows
--
-- v2.event_photos stays for now, because the admin and the site still read covers from it. A later step drops
-- it once both read events.poster_path and v2.photos instead. Run once; 99_rollback.sql undoes it with the rest
-- of v2.

begin;

-- Companies ------------------------------------------------------------------------------------------------------

create table v2.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  colour text not null check (colour ~* '^#[0-9a-f]{6}$'),  -- their brand colour, as #rrggbb
  logo_path text,                                           -- path in the `company-logos` bucket
  created_at timestamptz not null default now()
);

alter table v2.guests add column company_id uuid references v2.companies (id) on delete set null;
create index guests_company_idx on v2.guests (company_id);

-- Photos ---------------------------------------------------------------------------------------------------------

-- A photo can be from an event, of the team, both, or neither yet. Deleting an event keeps its photos (a team
-- photo is still a team photo), with event_id cleared.
create table v2.photos (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,  -- path in the `event-photos` bucket
  alt text,
  event_id uuid references v2.events (id) on delete set null,
  is_team_photo boolean not null default false,  -- shown beside the team credits on the home page
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index photos_event_idx on v2.photos (event_id, sort_order);
create index photos_team_idx on v2.photos (created_at desc) where is_team_photo;

-- Who's in a photo. sort_order orders one guest's photos: their first is the one Meet the Professionals shows.
create table v2.photo_guests (
  photo_id uuid not null references v2.photos (id) on delete cascade,
  guest_id uuid not null references v2.guests (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (photo_id, guest_id)
);

create index photo_guests_guest_idx on v2.photo_guests (guest_id, sort_order);

-- Posters --------------------------------------------------------------------------------------------------------

alter table v2.events add column poster_path text;  -- path in the `event-media` bucket

-- Every cover today is a poster copied from `events-images`, so each event's cover becomes its poster.
update v2.events as e
set poster_path = p.path
from v2.event_photos as p
where p.event_id = e.id and p.is_cover;

-- Access ---------------------------------------------------------------------------------------------------------
-- Same rules as the rest of v2: anyone reads, only admins insert, update and delete, nobody truncates.

grant select on v2.companies, v2.photos, v2.photo_guests to anon, authenticated;
grant insert, update, delete on v2.companies, v2.photos, v2.photo_guests to authenticated;

do $$
declare
  t text;
begin
  foreach t in array array['companies', 'photos', 'photo_guests']
  loop
    execute format('alter table v2.%I enable row level security', t);
    execute format('create policy "Anyone reads" on v2.%I for select to anon, authenticated using (true)', t);
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

-- Storage --------------------------------------------------------------------------------------------------------
-- Both buckets are public, so anyone can view files by URL; only admins list, upload, replace and delete.
-- No SVG logos: an SVG can carry script, so logos are raster images.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('event-photos', 'event-photos', true, 20 * 1024 * 1024,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('company-logos', 'company-logos', true, 2 * 1024 * 1024,
    array['image/png', 'image/jpeg', 'image/webp', 'image/avif']);

create policy "Admins see photos and logos"
  on storage.objects for select to authenticated
  using (bucket_id in ('event-photos', 'company-logos') and (select public.is_admin()));

create policy "Admins upload photos and logos"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('event-photos', 'company-logos') and (select public.is_admin()));

create policy "Admins replace photos and logos"
  on storage.objects for update to authenticated
  using (bucket_id in ('event-photos', 'company-logos') and (select public.is_admin()))
  with check (bucket_id in ('event-photos', 'company-logos') and (select public.is_admin()));

create policy "Admins delete photos and logos"
  on storage.objects for delete to authenticated
  using (bucket_id in ('event-photos', 'company-logos') and (select public.is_admin()));

-- Check before committing: every cover became a poster, and the new tables are empty and readable.
select
  (select count(*) from v2.event_photos where is_cover) as covers,
  (select count(*) from v2.events where poster_path is not null) as posters,
  (select count(*) from v2.companies) as companies,
  (select count(*) from v2.photos) as photos;

commit;
