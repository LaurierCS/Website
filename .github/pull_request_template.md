## Summary
<!-- What does this PR do and why? Keep it to 1–3 sentences. -->

Closes #<!-- issue number -->

## Type of change
<!-- Check one. Frontend = the public site. Backend = the admin dashboard, Supabase, or anything users don't see. -->
- [ ] 🎨 Frontend (public site UI, pages, styles, content)
- [ ] ⚙️ Backend / admin (admin dashboard, Supabase tables, RLS policies, data fetching, config)
- [ ] 📝 Docs / chore (README, CI, dependencies, cleanup)

## What changed
<!-- Bullet the main changes so a reviewer knows where to look. -->
-

---

### 🎨 Frontend only: screenshots
<!-- Required for frontend PRs. Delete this section for backend/admin or docs PRs. -->
| | Before | After |
| --- | --- | --- |
| Desktop | <!-- drag image here --> | <!-- drag image here --> |
| Mobile | <!-- drag image here --> | <!-- drag image here --> |

<!-- For animations or interactions, add a short GIF or screen recording. -->

- [ ] Checked on desktop and mobile widths
- [ ] Matches the Marketing design / branding (if a design was given)
- [ ] Images are compressed and have alt text

### ⚙️ Backend / admin only: data changes
<!-- No screenshots needed. Delete this section for frontend-only or docs PRs. -->
- [ ] No Supabase changes
- [ ] Supabase schema changed (tables/columns listed below, with a migration or SQL included)
- [ ] RLS policies added or changed (only signed-in execs can write; public can only read)
- [ ] New environment variables (added to `.env.example` and noted below)

<!-- Describe any schema, policy, or env changes here. -->

---

## How to test
<!-- Steps a reviewer can follow locally. -->
1. `pnpm i && pnpm dev`
2.

## Checklist
- [ ] `pnpm lint` and `pnpm build` pass locally
- [ ] PR is small and focused on one issue
- [ ] I understand every line of this code (AI-assisted is fine, AI-authored without review is not)
- [ ] No secrets, keys, or `.env` files committed (anon key only on the client, never the service role key)
- [ ] Docs/README updated if setup, routes, or env vars changed
