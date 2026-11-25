-- Undo v2 completely: drops the v2 schema and the two new buckets' policies. Nothing in `public` or the old
-- buckets is touched.
--
-- Empty the `event-media` and `guest-photos` buckets first (Storage in the dashboard, or the Storage API).
-- Supabase blocks deleting storage rows with SQL, so the buckets themselves are deleted from the dashboard.

drop policy if exists "Admins see v2 media" on storage.objects;
drop policy if exists "Admins upload v2 media" on storage.objects;
drop policy if exists "Admins replace v2 media" on storage.objects;
drop policy if exists "Admins delete v2 media" on storage.objects;

drop schema if exists v2 cascade;
