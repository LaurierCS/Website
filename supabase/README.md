# Supabase

Database migrations and Edge Functions for the LCS project. Every change is reviewed before it is applied to
the hosted project (`docs/redesign.md`).

| Path | What |
| --- | --- |
| `migrations/20261118120000_admin_access.sql` | `public.admins` (who may use the admin dashboard) and `public.is_admin()` for RLS |
| `migrations/20261118151500_admin_access_grants.sql` | Table privileges for `public.admins` |
| `migrations/20261118170000_admin_read_events_team.sql` | Read access to `events` and `team` for signed-in admins (`authenticated`) |
| `functions/verify-member/` | Checks a signed-in person is in the LCS Discord server or LCS Notion workspace, and records it |

Setting up auth, deploying the function (always with `--no-verify-jwt`) and the secrets it needs:
[`docs/admin.md`](../docs/admin.md).
