# Admin Dashboard

## Setup

Requirements: Node.js 22+ and pnpm 9+.

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Copy the example env file and fill in the values (ask a VP of Eng for them):

   ```sh
   cp .env.example .env
   ```

   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

   Never commit `.env`. Only the anon key belongs in the client, never the service role key.

3. Start the dev server:

   ```sh
   pnpm dev
   ```

The shared Supabase client lives in `src/lib/supabase.ts`. Database types are in `src/lib/database.types.ts`; regenerate them with `supabase gen types typescript --project-id <id> > src/lib/database.types.ts` when the schema changes.
