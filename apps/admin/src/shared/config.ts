/**
 * The admin's configuration, parsed once from the environment. Nothing else reads
 * `import.meta.env`. Every value here ships to the browser, so only public values belong in it.
 */
import { z } from 'zod';

const EnvSchema = z.object({
  VITE_SUPABASE_URL: z.url({ message: 'VITE_SUPABASE_URL must be the Supabase project URL.' }),
  VITE_SUPABASE_ANON_KEY: z.string().min(1, 'VITE_SUPABASE_ANON_KEY is missing. Use the anon key, never the service role key.'),
});

export type AppConfig = Readonly<{
  supabaseUrl: string;
  supabaseAnonKey: string;
}>;

/**
 * @throws Error naming every missing or malformed variable, so a broken `.env` fails at start-up.
 */
export function loadConfig(env: Readonly<Record<string, unknown>>): AppConfig {
  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    throw new Error(`Admin configuration is invalid:\n${z.prettifyError(parsed.error)}\nSee apps/admin/.env.example.`);
  }
  return { supabaseUrl: parsed.data.VITE_SUPABASE_URL, supabaseAnonKey: parsed.data.VITE_SUPABASE_ANON_KEY };
}
