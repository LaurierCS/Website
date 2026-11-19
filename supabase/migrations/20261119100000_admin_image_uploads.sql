-- Only admins upload, replace and delete photos in the events-images and team-images buckets (#205). Both buckets
-- stay public, so every existing photo URL keeps loading on the site; public URLs don't go through these policies.
-- public.is_admin() comes from 20261118120000_admin_access.sql.

-- The storage API also needs to see a file's entry to replace (upsert) or delete it, so admins get read access
-- too. This doesn't change public viewing.
create policy "Admins see event and team photos"
  on storage.objects for select to authenticated
  using (bucket_id in ('events-images', 'team-images') and (select public.is_admin()));

create policy "Admins upload event and team photos"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('events-images', 'team-images') and (select public.is_admin()));

create policy "Admins replace event and team photos"
  on storage.objects for update to authenticated
  using (bucket_id in ('events-images', 'team-images') and (select public.is_admin()))
  with check (bucket_id in ('events-images', 'team-images') and (select public.is_admin()));

create policy "Admins delete event and team photos"
  on storage.objects for delete to authenticated
  using (bucket_id in ('events-images', 'team-images') and (select public.is_admin()));
