-- v2 step 2: the new storage buckets and who can write to them.
--
--   event-media/<event_id>/photos/<random>.<ext>   event photos (v2.event_photos.path)
--   event-media/<event_id>/docs/<random>.<ext>     event documents (v2.event_documents.path)
--   guest-photos/<guest_id>/<random>.<ext>         guest pictures (v2.guests.picture_path)
--
-- `team-images` stays as it is and v2.team keeps using it. `events-images` is left untouched for the live site.
-- Tables store the path inside the bucket, never the full URL; the site builds the URL with getPublicUrl().

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('event-media', 'event-media', true, 20 * 1024 * 1024,
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'application/pdf',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation']),
  ('guest-photos', 'guest-photos', true, 5 * 1024 * 1024,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

-- Both buckets are public, so anyone can view files by URL. These policies only let admins list, upload,
-- replace and delete, the same as migrations/20261119100000_admin_image_uploads.sql.
create policy "Admins see v2 media"
  on storage.objects for select to authenticated
  using (bucket_id in ('event-media', 'guest-photos') and (select public.is_admin()));

create policy "Admins upload v2 media"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('event-media', 'guest-photos') and (select public.is_admin()));

create policy "Admins replace v2 media"
  on storage.objects for update to authenticated
  using (bucket_id in ('event-media', 'guest-photos') and (select public.is_admin()))
  with check (bucket_id in ('event-media', 'guest-photos') and (select public.is_admin()));

create policy "Admins delete v2 media"
  on storage.objects for delete to authenticated
  using (bucket_id in ('event-media', 'guest-photos') and (select public.is_admin()));
