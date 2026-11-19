# Admin dashboard: auth setup

How sign-in to the admin dashboard (`apps/admin`, `admin.lauriercs.org`) is set up, so someone else can redo it.
Everything here is done in the Supabase, Discord, Notion and Vercel dashboards or with the Supabase CLI; no
secret goes in the repo.

## How access works

- People sign in with **Discord** or **Notion** through Supabase Auth. There are no passwords and no email sign-up.
- Signing in is not access. Right after sign-in the admin calls the `verify-member` Edge Function with the
  provider's token. It checks the person is in the **LCS Discord server** (guild `1479628976744960060`) or the
  **LCS Notion workspace** (`d5403402-1a5a-43fe-bfb8-3ad1b5a482d3`), and records them in `public.admins` for
  7 days. Until then the admin reads that row and does not ask Discord or Notion again (Discord rate-limits the
  lookup). When the pass runs out, an open dashboard notices on its own and shows "Your pass ran out" with a
  button to renew it by signing in again; someone who leaves the server or workspace loses access within a week.
- `public.is_admin()` is true for anyone with an unexpired `admins` row. The RLS policies on the data tables
  (#204) use it, so only admins can write.
- **Adding an admin** means they join the LCS Discord server or Notion workspace and sign in. **Removing one**
  right away: remove them from the server/workspace, then in the SQL editor find their row with
  `select user_id, provider, verified_until from public.admins;` and run
  `delete from public.admins where user_id = '<their user_id>';`. Their next save is refused, and their
  dashboard drops them at their next access check.

Execs will later keep only one of the two providers. Dropping the other means turning it off in Supabase and
removing it from the admin's sign-in options and from `MEMBERSHIP_CHECKS` in the Edge Function.

## 1. Discord provider

1. https://discord.com/developers/applications → **New Application** (e.g. "LCS Admin"; add the LCS icon).
2. **OAuth2**: copy the **Client ID**; **Reset Secret** and copy the **Client Secret** (shown once).
3. **OAuth2 → Redirects**: add the Supabase callback URL (step 3 below) and save.
4. Supabase → **Authentication → Sign In / Providers → Discord**: enable, paste the ID and secret, save.

No bot is needed. The admin asks for `identify email guilds.members.read` at sign-in; the last one lets the
function look the person up in the LCS server.

## 2. Notion provider

1. https://www.notion.so/profile/integrations → new **public** connection (OAuth), e.g. "LCS Admin".
2. **Installable in:** the Laurier Computing Society workspace.
3. **Redirect URI:** the Supabase callback URL (step 3 below).
4. **Capabilities:** read user information **including email addresses**.
5. Copy the OAuth **client ID** and **client secret** into Supabase → **Authentication → Sign In / Providers →
   Notion**, enable, save.

The workspace ID: `GET https://api.notion.com/v1/users/me` with a token authorized in the LCS workspace returns
it as `bot.workspace_id`.

## 3. Supabase auth settings

- **Callback URL** (for Discord and Notion): `https://<project-ref>.supabase.co/auth/v1/callback`, shown on each
  provider's page in Supabase.
- **Authentication → URL Configuration → Redirect URLs:** `http://localhost:5173/login` and
  `https://admin.lauriercs.org/login`. For Vercel previews, add the preview pattern
  (`https://*-<vercel-team>.vercel.app/login`).
- **No open sign-up:** turn **off** the **Email** provider (Authentication → Sign In / Providers → Email), so
  nobody can make an email/password account. Leave "Allow new users to sign up" **on**: Discord and Notion
  sign-ins create users through it, and the membership check is what keeps non-members out.

## 4. Database and Edge Function

From the repository root, with the Supabase CLI (`npx supabase ...`):

```powershell
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase secrets set DISCORD_GUILD_ID=1479628976744960060 NOTION_WORKSPACE_ID=d5403402-1a5a-43fe-bfb8-3ad1b5a482d3
npx supabase functions deploy verify-member --no-verify-jwt
```

- **Migrations** are in `supabase/migrations/` and listed in [`supabase/README.md`](../supabase/README.md). Apply
  with `npx supabase db push --remote`. On LCS-Site they were run by hand instead, because `db push` refuses
  while the project has older migrations the repo does not have yet:

  | Migration | Applied to LCS-Site |
  | --- | --- |
  | `20261118120000_admin_access.sql` | Yes, by hand in the SQL editor |
  | `20261118151500_admin_access_grants.sql` | Yes, by hand in the SQL editor |
  | `20261118170000_admin_read_events_team.sql` | Yes, by hand in the SQL editor |
  | `20261119090000_admin_write_rules.sql` | 2026-11-19, recorded in the migration history |
  | `20261119100000_admin_image_uploads.sql` | 2026-11-19, recorded in the migration history |
  | `20261119150000_admin_revoke_truncate.sql` | Not yet |

  Update this table when you apply one.
- **`--no-verify-jwt` is required.** The gateway's JWT check rejects this project's sessions; the function
  verifies the caller itself with `auth.getUser()` and refuses anyone not signed in.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided to the function by Supabase. The service role
  key never goes anywhere else.

## Checking it works

Steps 1 and 4 need the admin's login page (#207).

1. Sign in locally (`pnpm dev` in `apps/admin`, http://localhost:5173) and on `admin.lauriercs.org` with each
   provider. You land on the dashboard.
2. You are on the admin list: in the SQL editor,
   `select user_id, provider, verified_until from public.admins;` shows your row.
3. `is_admin()` is true for you: in the SQL editor, choose **Role → authenticated** and impersonate your user,
   then run `select public.is_admin();`. (Run as yourself in the editor without impersonating, it is `false`:
   the editor is not signed in as you.)
4. A random account is not an admin: sign in with a Discord account outside the LCS server. You get "not on
   the list" and no `admins` row.
5. Problems: Supabase → **Edge Functions → verify-member → Logs**. `verify-member.provider_failed` and
   `verify-member.store_failed` lines say what Discord, Notion or the database answered, check here for auth fails.
   `verify-member.misconfigured` means a secret from step 4 is missing; the dashboard shows "door's jammed".
