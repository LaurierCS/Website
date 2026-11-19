-- Signed-in admins read events and team as the `authenticated` role; the public site reads as `anon`. Newer
-- Supabase projects do not grant the API roles access to tables created in SQL, so without this the admin
-- dashboard cannot load events once someone is signed in. Read access only: writes stay closed until #204.
-- Applied to LCS-Site by hand in the SQL editor on 2026-11-18.

grant select on public.events, public.team to authenticated;
