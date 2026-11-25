-- v2 step 5: read-only checks after steps 1 to 4. Changes nothing.

-- Row counts: v2 should match public.
select 'events' as area, (select count(*) from public.events) as public, (select count(*) from v2.events) as v2
union all
select 'team', (select count(*) from public.team), (select count(*) from v2.team)
union all
select 'events with a picture / covers',
  (select count(*) from public.events where picture_url is not null),
  (select count(*) from v2.event_photos where is_cover);

-- Events whose time couldn't be read (null start_time but public had a time). Fix these in v2 by hand.
select e.id, e.title, p.time as public_time
from v2.events as e
join public.events as p using (id)
where e.start_time is null and nullif(trim(p.time), '') is not null;

-- Rows deleted from public since the last populate (still in v2). Delete them from v2 if they should go.
select 'event' as kind, id, title as name from v2.events where id not in (select id from public.events)
union all
select 'team', id, name from v2.team where id not in (select id from public.team);

-- Cover rows whose file hasn't been copied into event-media yet (run 04_copy_event_photos.mjs).
select ph.event_id, ph.path
from v2.event_photos as ph
where not exists (select 1 from storage.objects as o where o.bucket_id = 'event-media' and o.name = ph.path);
