-- Only admins change events and team (#204). Everyone can still read events and published team members, so
-- lauriercs.org looks the same; admins (public.is_admin(), from 20261118120000_admin_access.sql) can also read
-- hidden members and insert, update and delete rows. Everyone else's writes are refused by the database itself,
-- whatever the admin app shows or hides.

alter table public.events enable row level security;
alter table public.team enable row level security;

-- events: keep the one existing read policy ("Allow public read on events", anyone can read) and add writes.
create policy "Admins insert events"
  on public.events for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins update events"
  on public.events for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins delete events"
  on public.events for delete to authenticated
  using ((select public.is_admin()));

-- team: three duplicate "anyone can read everything" policies become one, which hides unpublished members
-- from everyone but admins. Both sites already show only is_public = true, so nothing visible changes.
drop policy "Allow public read access" on public.team;
drop policy "Allow public read on team" on public.team;
drop policy "Enable read access for all users" on public.team;

create policy "Anyone reads published members; admins read all"
  on public.team for select to anon, authenticated
  using (is_public is true or (select public.is_admin()));

create policy "Admins insert team members"
  on public.team for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins update team members"
  on public.team for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins delete team members"
  on public.team for delete to authenticated
  using ((select public.is_admin()));

-- Signed-in users may attempt writes, and the policies above decide; signed-out visitors get no write access.
grant insert, update, delete on public.events, public.team to authenticated;

-- TRUNCATE empties a table without checking row-level security, so the API roles must not have it.
revoke truncate on public.events, public.team from anon, authenticated;
