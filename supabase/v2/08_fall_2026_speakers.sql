-- v2 step 9: the Fall 2026 Meet the Professionals speakers, their companies, and them as the event's hosts.
-- Needs step 8 (07_companies_photos_posters.sql).
--
-- Upload the files first (Storage in the dashboard), with these exact names, at the top of each bucket:
--   guest-photos:   alex-astrum.jpg, mubin-qureshi.jpg, stephanie-yee.jpg, mahsa-panahi.jpg, kanwar-anand.jpg,
--                   nicole-freij-camacho.jpg
--   company-logos:  logo-google.png, logo-rippling.png, logo-accenture.png, logo-rbc.png, logo-sun-life.png,
--                   logo-capitalize-analytics.png
-- (all from apps/site/src/assets/speakers/). Safe to run again: nothing already there is added twice.

begin;

insert into v2.companies (name, colour, logo_path)
values
  ('Google', '#4285f4', 'logo-google.png'),
  ('Rippling', '#502d3c', 'logo-rippling.png'),
  ('Accenture', '#a100ff', 'logo-accenture.png'),
  ('RBC', '#005daa', 'logo-rbc.png'),
  ('Sun Life', '#f2a900', 'logo-sun-life.png'),
  ('Capitalize Analytics', '#0b45bb', 'logo-capitalize-analytics.png')
on conflict (name) do nothing;

-- The speakers, in the order they're shown.
create temporary table speakers (place int, name text, title text, company text, picture text, link text)
  on commit drop;

insert into speakers
values
  (1, 'Alex Astrum', 'Sr. Developer Relations Engineer', 'Google', 'alex-astrum.jpg',
    'https://www.linkedin.com/in/alexastrum/'),
  (2, 'Mubin Qureshi', 'Software Engineer', 'Rippling', 'mubin-qureshi.jpg',
    'https://www.linkedin.com/in/mubinqureshi/'),
  (3, 'Stephanie Yee', 'Infra Transformation Senior Manager', 'Accenture', 'stephanie-yee.jpg',
    'https://www.linkedin.com/in/yeestephanie/'),
  (4, 'Mahsa Panahi', 'Machine Learning Engineer', 'RBC', 'mahsa-panahi.jpg',
    'https://www.linkedin.com/in/mahsapanahi/'),
  (5, 'Kanwar Anand', 'Business Growth Strategy', 'Sun Life', 'kanwar-anand.jpg',
    'https://www.linkedin.com/in/anandkanwar/'),
  (6, 'Nicole Freij Camacho', 'Analyst', 'Capitalize Analytics', 'nicole-freij-camacho.jpg',
    'https://www.linkedin.com/in/nicole-freij-camacho/');

insert into v2.guests (name, title, company_id, picture_path, link_url)
select s.name, s.title, c.id, s.picture, s.link
from speakers as s
join v2.companies as c on c.name = s.company
where not exists (select 1 from v2.guests as g where g.name = s.name);

-- Each speaker hosts the Fall 2026 Meet the Professionals, in order.
insert into v2.event_hosts (event_id, guest_id, sort_order)
select e.id, g.id, s.place
from speakers as s
join v2.guests as g on g.name = s.name
cross join (select id from v2.events where category = 'meet_the_pros' and date = '2026-11-19') as e
on conflict (event_id, guest_id) do nothing;

-- Check before committing: six speakers, each with a company, hosting the event, with their files uploaded.
select g.name, g.title, c.name as company, h.sort_order,
  exists (
    select 1 from storage.objects as o where o.bucket_id = 'guest-photos' and o.name = g.picture_path
  ) as photo_uploaded,
  exists (
    select 1 from storage.objects as o where o.bucket_id = 'company-logos' and o.name = c.logo_path
  ) as logo_uploaded
from v2.event_hosts as h
join v2.guests as g on g.id = h.guest_id
join v2.companies as c on c.id = g.company_id
join v2.events as e on e.id = h.event_id
where e.category = 'meet_the_pros' and e.date = '2026-11-19'
order by h.sort_order;

commit;
