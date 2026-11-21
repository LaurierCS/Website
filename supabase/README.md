# Supabase

Database migrations and Edge Functions for the LCS project. Every change is reviewed before it is applied to
the hosted project (`docs/redesign.md`).

| Path | What |
| --- | --- |
| `migrations/20261118120000_admin_access.sql` | `public.admins` (who may use the admin dashboard) and `public.is_admin()` for RLS |
| `migrations/20261118151500_admin_access_grants.sql` | Table privileges for `public.admins` |
| `migrations/20261118170000_admin_read_events_team.sql` | Signed-in users (the admin) can read `events` and `team` |
| `migrations/20261119090000_admin_write_rules.sql` | Only admins insert, update and delete `events` and `team`; the public reads events and published team members |
| `migrations/20261119100000_admin_image_uploads.sql` | Only admins upload, replace and delete photos in `events-images` and `team-images`; both stay public to view |
| `migrations/20261119150000_admin_revoke_truncate.sql` | Takes TRUNCATE (which skips RLS) away from the API roles on `public.admins` |
| `migrations/20261121090000_team_department_required.sql` | Every team member must have one of the seven departments |
| `migrations/20261121200000_site_data_versions.sql` | A version number per area (`events`, `team`) that goes up on every change, read by the public site to keep its cache current and pushed to open tabs through Realtime |
| `functions/verify-member/` | Checks a signed-in person is in the LCS Discord server or LCS Notion workspace, and records it. A missing secret answers 503 and logs `verify-member.misconfigured` |

Setting up auth, deploying the function (always with `--no-verify-jwt`) and the secrets it needs:
[`docs/admin.md`](../docs/admin.md).
