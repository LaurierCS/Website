-- v2 follow-up, applied on 2026-11-25 to a database that already ran steps 1 to 3 with the first version of
-- 01_schema.sql. A fresh run of 01 and 03 already includes all of this; only run it on a database set up before.

begin;

-- Categories: review, social, career, workshop, hackathon, meet_the_pros. No `other` and no default.
alter table v2.events drop constraint if exists events_category_check;
alter table v2.events alter column category drop default;
alter table v2.events add constraint events_category_check
  check (category in ('review', 'social', 'career', 'workshop', 'hackathon', 'meet_the_pros'));

-- Roles: the department is its own column, so "VP of Marketing" becomes "VP".
update v2.team
set role = regexp_replace(role, '^(VP|Director) of .+$', '\1')
where role ~ '^(VP|Director) of ';

commit;
