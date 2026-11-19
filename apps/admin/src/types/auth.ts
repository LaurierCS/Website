/**
 * Who is using the admin and whether they may. Anyone who signs in with a provider and belongs to the LCS
 * community there (the LCS Discord server or the LCS Notion workspace) gets in. Belonging is checked on the
 * server, never in the browser.
 */
import { z } from 'zod';

/** The ways to sign in. Execs will later keep one; removing the other is deleting it here and in `PROVIDERS`. */
export const SIGN_IN_PROVIDERS = ['discord', 'notion'] as const;
export type SignInProvider = (typeof SIGN_IN_PROVIDERS)[number];

/** Each provider's name, and where someone must belong on it to get in. */
export const PROVIDERS: Readonly<Record<SignInProvider, { label: string; community: string }>> = {
  discord: { label: 'Discord', community: 'the LCS Discord server' },
  notion: { label: 'Notion', community: 'the LCS Notion workspace' },
};

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
