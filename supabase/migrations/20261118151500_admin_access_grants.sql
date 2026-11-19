-- Explicit table privileges for public.admins. Newer Supabase projects do not grant the API roles access to
-- tables created in SQL, so without these the verify-member function cannot record access and the browser
-- cannot read its own row. RLS still limits the browser to its own row; only the service role writes.

grant select on public.admins to authenticated;
grant select, insert, update, delete on public.admins to service_role;
