/**
 * The site's configuration, checked once from the environment, with the same variable names as the admin.
 * Nothing else reads `import.meta.env`. The site only ever reads public data, so it uses the anon key; the
 * service role key never belongs here.
 */
import { z } from 'zod';

const EnvSchema = z.object({
  DATABASE_URL: z.url({ message: 'DATABASE_URL must be the Supabase project URL (https://<project-ref>.supabase.co).' }),
  DATABASE_KEY: z.string().min(1, 'DATABASE_KEY is missing. Use the anon key, never the service role key.'),
});

export type SiteConfig = Readonly<{ supabaseUrl: string; supabaseAnonKey: string }>;

/**
 * The Supabase URL and anon key.
 * @throws Error naming every missing or malformed variable, so a build without them stops with the fix.
 */
export function loadConfig(env: Readonly<Record<string, unknown>> = import.meta.env): SiteConfig {
  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    throw new Error(`Site configuration is invalid:\n${z.prettifyError(parsed.error)}\nSee apps/site/.env.example.`);
  }
  return { supabaseUrl: parsed.data.DATABASE_URL, supabaseAnonKey: parsed.data.DATABASE_KEY };
}
