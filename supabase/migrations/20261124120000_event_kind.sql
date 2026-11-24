-- The kind of night each event is, so the public site can show past and upcoming events in rows by kind
-- ("Everything else we do") and the admin can set it beside the title. The database refuses anything outside
-- the four kinds, whoever writes it: the admin, the Supabase dashboard or a script.
--
-- Empty for events nobody has sorted yet, and for ones that fit none of the four (a hackathon); the site leaves
-- those out of the rows. Adding a kind later is a new migration that drops and re-adds this check with it.
--
-- Anyone can already read events (the "Allow public read on events" policy), and only admins write them, so
-- the new column needs no policy of its own.

alter table public.events
  add column kind text,
  add constraint events_kind_is_known check (kind in ('review', 'social', 'career', 'workshop'));
