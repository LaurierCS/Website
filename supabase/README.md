# Supabase

Database migrations and Edge Functions for the LCS project. Every change is reviewed before it is applied to
the hosted project (`docs/redesign.md`).

| Path | What |
| --- | --- |
| `migrations/20261118120000_admin_access.sql` | `public.admins` (who may use the admin dashboard) and `public.is_admin()` for RLS |
| `migrations/20261118151500_admin_access_grants.sql` | Table privileges for `public.admins` |
| `migrations/20261119090000_admin_write_rules.sql` | Only admins insert, update and delete `events` and `team`; the public reads events and published team members |
| `functions/verify-member/` | Checks a signed-in person is in the LCS Discord server or LCS Notion workspace, and records it |

Setting up auth, deploying the function (always with `--no-verify-jwt`) and the secrets it needs:
[`docs/admin.md`](../docs/admin.md).
