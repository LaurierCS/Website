-- Every team member belongs to one of the seven LCS departments. The public site groups people by this column
-- and the admin offers exactly these in a dropdown, so the database refuses anything else (a typo, a blank, a
-- department that doesn't exist) whoever writes it: the admin, the Supabase dashboard or a script.
--
-- Before applying, this must return no rows (every existing member already fits):
--   select id, name, department from public.team
--   where department is null
--      or department not in ('Admin', 'Finance', 'Marketing', 'Outreach', 'Events', 'Academics', 'Engineering');
--
-- Adding a department later is a new migration that drops and re-adds this check with the new name.

alter table public.team
  alter column department set not null,
  add constraint team_department_is_known
    check (department in ('Admin', 'Finance', 'Marketing', 'Outreach', 'Events', 'Academics', 'Engineering'));
