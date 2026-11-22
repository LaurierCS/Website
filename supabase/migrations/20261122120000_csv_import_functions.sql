-- Saving a CSV import from the admin in one go: every new row and every changed row, or none of them. A function
-- runs as one transaction, so an error anywhere in it (a refused insert, a changed row that no longer exists, a
-- department the table doesn't accept) undoes everything it did.
--
-- Both run as the person calling them (security invoker), so the row-level security policies on events and team
-- still decide: an admin's import goes through, anyone else's insert is refused and their updates match no rows.
-- Pictures are never touched; the CSV has no picture column.
--
-- Each takes two JSON arrays of rows named like the table's columns: `new_rows` are inserted first, then
-- `changed_rows` update the rows with their `id`. Rows missing from the file are left alone, never deleted.

create function public.import_events(new_rows jsonb, changed_rows jsonb)
  returns void
  language plpgsql
  security invoker
  set search_path = ''
as $$
declare
  updated integer;
begin
  -- Reading the rows as public.events gives each column its real type (a date stays a date).
  insert into public.events (title, date, time, location, description)
  select r.title, r.date, r.time, r.location, r.description
  from jsonb_populate_recordset(null::public.events, new_rows) as r;

  update public.events as e
  set title = r.title, date = r.date, time = r.time, location = r.location, description = r.description
  from jsonb_populate_recordset(null::public.events, changed_rows) as r
  where e.id = r.id;

  -- Row-level security refuses an update by changing nothing, the same as an id that is gone, so count the rows.
  get diagnostics updated = row_count;
  if updated <> jsonb_array_length(changed_rows) then
    raise exception 'Only % of % changed events could be saved.', updated, jsonb_array_length(changed_rows);
  end if;
end;
$$;

create function public.import_team(new_rows jsonb, changed_rows jsonb)
  returns void
  language plpgsql
  security invoker
  set search_path = ''
as $$
declare
  updated integer;
begin
  insert into public.team (name, role, department, is_public, github_url, linkedin_url)
  select r.name, r.role, r.department, r.is_public, r.github_url, r.linkedin_url
  from jsonb_populate_recordset(null::public.team, new_rows) as r;

  update public.team as t
  set name = r.name, role = r.role, department = r.department, is_public = r.is_public,
      github_url = r.github_url, linkedin_url = r.linkedin_url
  from jsonb_populate_recordset(null::public.team, changed_rows) as r
  where t.id = r.id;

  get diagnostics updated = row_count;
  if updated <> jsonb_array_length(changed_rows) then
    raise exception 'Only % of % changed team members could be saved.', updated, jsonb_array_length(changed_rows);
  end if;
end;
$$;

-- Supabase lets every API role run new functions by default. Only signed-in people may call these; the policies
-- above then decide whether what they send is saved.
revoke execute on function public.import_events(jsonb, jsonb), public.import_team(jsonb, jsonb) from public, anon;
grant execute on function public.import_events(jsonb, jsonb), public.import_team(jsonb, jsonb) to authenticated;
