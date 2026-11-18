/**
 * Who is using the admin and whether they may. Anyone who signs in through a provider and belongs to the LCS
 * community there (the LCS Discord server, or the LCS Notion workspace) gets in. Belonging is checked on the
 * server, never in the browser.
 */
import { z } from 'zod';

/** The ways to sign in. Execs will later keep one of them; removing the other is deleting one entry. */
export const SIGN_IN_PROVIDERS = ['discord', 'notion'] as const;
export type SignInProvider = (typeof SIGN_IN_PROVIDERS)[number];

export const AccountSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1),
  avatarUrl: z.url().nullable(),
  provider: z.enum(SIGN_IN_PROVIDERS),
});
export type Account = Readonly<z.infer<typeof AccountSchema>>;

export type Access =
  | { readonly kind: 'signed_out' }
  | { readonly kind: 'not_member'; readonly account: Account }
  | { readonly kind: 'admin'; readonly account: Account; readonly verifiedUntil: Date };

export type Admin = Extract<Access, { kind: 'admin' }>;

/** The first word of a display name, for a friendly greeting. */
export function firstName(account: Account): string {
  return account.name.split(/\s+/)[0] ?? account.name;
}
