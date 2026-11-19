-- Who may use the admin dashboard.
--
-- A row means: this person signed in with Discord or Notion and the verify-member Edge Function confirmed they
-- are in the LCS Discord server or the LCS Notion workspace, until `verified_until`. Signing in after it
-- expires renews it. Only the Edge Function (service role) writes rows; the browser can only read its own.

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  provider text not null check (provider in ('discord', 'notion')),
  verified_until timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create policy "People read their own access"
  on public.admins
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- No insert, update or delete policies: with RLS on, those are refused for every browser client.

-- Used by the RLS policies on events, team and the image buckets: true only for unexpired access.
create function public.is_admin()
  returns boolean
  language sql
  stable
  security definer
  set search_path = ''
as $$
  select exists (
    select 1
    from public.admins
    where user_id = (select auth.uid())
      and verified_until > now()
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
