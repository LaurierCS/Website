-- A version number for each area of data the public site shows, so the site can cache events and the team and
-- still never show stale data. Any insert, update, delete or truncate on `events` or `team` adds 1 to that
-- area's number, whoever makes it: the admin, the Supabase dashboard or a script.
--
-- On a visit the site fetches only these numbers: the same as last time means its saved copy is current; a new
-- number means it fetches that area again. Open tabs hear about a new number through Supabase Realtime and update
-- straight away.
--
-- `version` is a bigint: at 1,000 changes a second it would take about 292 million years to run out, and
-- Postgres raises an error rather than wrapping round. A new area later (sponsors, event photos) is one row here
-- and one trigger on its table.

create table public.site_data_versions (
  area text primary key,
  version bigint not null default 0
);

insert into public.site_data_versions (area) values ('events'), ('team');

-- Anyone can read the numbers; they say only how many times an area has changed, nothing about what changed.
-- Nobody writes them through the API: Supabase grants new tables to the API roles by default, so take that back.
alter table public.site_data_versions enable row level security;

create policy "Anyone reads the site data versions"
  on public.site_data_versions for select to anon, authenticated
  using (true);

revoke insert, update, delete, truncate on public.site_data_versions from anon, authenticated;

-- Runs once per statement, so a bulk change (a CSV import later) is one new version, not one per row. It runs as
-- its owner because the admins who change events and team can't write this table themselves.
create function public.bump_site_data_version()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  update public.site_data_versions set version = version + 1 where area = tg_argv[0];
  return null;
end;
$$;

create trigger events_bump_site_data_version
  after insert or update or delete or truncate on public.events
  for each statement execute function public.bump_site_data_version('events');

create trigger team_bump_site_data_version
  after insert or update or delete or truncate on public.team
  for each statement execute function public.bump_site_data_version('team');

-- Lets open tabs subscribe to changes of these rows. Realtime applies the read policy above.
alter publication supabase_realtime add table public.site_data_versions;
