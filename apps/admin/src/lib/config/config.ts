/**
 * The admin's configuration, checked once from the environment. Nothing else reads `import.meta.env`. Every
 * value here ships to the browser, so only public values belong in it.
 */
import { z } from 'zod';

const EnvSchema = z.object({
  DATABASE_URL: z.url({ message: 'DATABASE_URL must be the Supabase project URL (https://<project-ref>.supabase.co).' }),
  DATABASE_KEY: z.string().min(1, 'DATABASE_KEY is missing. Use the anon key, never the service role key.'),
});

export type AppConfig = Readonly<{
  supabaseUrl: string;
  supabaseAnonKey: string;
}>;

/**
 * The Supabase URL and anon key.
 * @throws Error naming every missing or malformed variable, so a broken `.env` shows the setup page.
 */
export function loadConfig(env: Readonly<Record<string, unknown>> = import.meta.env): AppConfig {
  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    throw new Error(`Admin configuration is invalid:\n${z.prettifyError(parsed.error)}\nSee apps/admin/.env.example.`);
  }
  return { supabaseUrl: parsed.data.DATABASE_URL, supabaseAnonKey: parsed.data.DATABASE_KEY };
}
