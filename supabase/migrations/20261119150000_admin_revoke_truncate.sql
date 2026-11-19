-- TRUNCATE empties a table without checking row-level security. The API roles still had it on public.admins
-- (Supabase's default grants), as they did on events and team before 20261119090000_admin_write_rules.sql
-- revoked it. PostgREST has no way to send TRUNCATE, so this closes a door nobody can reach today, but it keeps
-- the admin list's protection in the database itself rather than relying on the API layer (#229).

revoke truncate on public.admins from anon, authenticated;
