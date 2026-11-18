/**
 * `AuthGateway` on Supabase Auth, with Discord and Notion as OAuth providers. Supabase errors stop here and
 * become domain errors.
 *
 * Access comes from the `admins` table, which only the `verify-member` Edge Function writes. A visitor with an
 * unexpired row is in, without asking the provider again: Discord rate-limits its membership lookup, so checking
 * on every page load would lock members out after a few refreshes. Only when there is no valid row does the
 * function use the provider's token (held right after sign-in) to confirm the visitor is in the LCS Discord
 * server or the LCS Notion workspace, and write a new row.
 *
 * Supabase links Discord and Notion sign-ins that share an email into one user and does not say which one was
 * just used. The function works it out from the token and reports it, and the `admins` row remembers it, so
 * the provider (and the name and avatar shown) always come from the server, never from a guess.
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { type Access, type Account, AccountSchema, SIGN_IN_PROVIDERS, type SignInProvider } from '../domain/access';
import { UnavailableError } from '../domain/errors';
import type { AuthGateway } from '../domain/ports';
import type { Database } from './database.types';

const VERIFY_FUNCTION = 'verify-member';
const ADMINS_TABLE = 'admins';

/** OAuth scopes per provider. Discord's `guilds.members.read` lets the function look the visitor up in the LCS server. */
const SCOPES: Readonly<Record<SignInProvider, string | undefined>> = {
  discord: 'identify email guilds.members.read',
  notion: undefined, // Notion has no scopes: the visitor picks the workspace while authorizing.
};

// Providers send null as well as leaving fields out (Discord's global_name is null without a display name).
const ProfileSchema = z.object({
  full_name: z.string().nullish(),
  name: z.string().nullish(),
  avatar_url: z.url().nullish(),
  custom_claims: z.object({ global_name: z.string().nullish() }).nullish(),
});

const SessionUserSchema = z.object({
  id: z.uuid(),
  identities: z.array(z.object({ provider: z.string(), identity_data: ProfileSchema.nullish() })),
  user_metadata: ProfileSchema,
});
type SessionUser = z.infer<typeof SessionUserSchema>;

const ProviderSchema = z.enum(SIGN_IN_PROVIDERS);

const VerifyResponseSchema = z.object({
  isMember: z.boolean(),
  provider: ProviderSchema,
  verifiedUntil: z.iso.datetime({ offset: true }).nullable(),
});

const AdminRowSchema = z.object({ provider: ProviderSchema, verified_until: z.iso.datetime({ offset: true }) });

export class SupabaseAuthGateway implements AuthGateway {
  private readonly client: SupabaseClient<Database>;
  private readonly redirectTo: string;

  constructor(client: SupabaseClient<Database>, redirectTo: string) {
    this.client = client;
    this.redirectTo = redirectTo;
  }

  async signIn(provider: SignInProvider): Promise<void> {
    const { error } = await this.client.auth.signInWithOAuth({
      provider,
      options: { redirectTo: this.redirectTo, scopes: SCOPES[provider] },
    });
    if (error) throw new UnavailableError('Sign-in could not be started.', { cause: error });
  }

  async checkAccess(): Promise<Access> {
    const { data, error } = await this.client.auth.getSession();
    if (error) throw new UnavailableError('Your session could not be checked.', { cause: error });
    if (!data.session) return { kind: 'signed_out' };

    const user = SessionUserSchema.parse(data.session.user);
    const providerToken = data.session.provider_token;
    const verdict =
      (await this.readAccessRow(user.id)) ?? (providerToken ? await this.verifyMembership(providerToken) : null);

    if (!verdict) return { kind: 'not_member', account: toAccount(user, fallbackProvider(user)) };
    const account = toAccount(user, verdict.provider);
    return verdict.verifiedUntil ? { kind: 'admin', account, verifiedUntil: verdict.verifiedUntil } : { kind: 'not_member', account };
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut({ scope: 'local' });
    if (error) throw new UnavailableError('You could not be signed out.', { cause: error });
  }

  onSignInChange(listener: () => void): () => void {
    const { data } = this.client.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') listener();
    });
    return () => data.subscription.unsubscribe();
  }

  /** Asks the Edge Function whether the visitor is part of LCS on the provider whose token this is. */
  private async verifyMembership(providerToken: string): Promise<Verdict> {
    const { data, error } = await this.client.functions.invoke(VERIFY_FUNCTION, { body: { providerToken } });
    if (error) throw new UnavailableError('Your membership could not be checked.', { cause: error });

    const result = VerifyResponseSchema.parse(data);
    const verifiedUntil = result.isMember && result.verifiedUntil ? new Date(result.verifiedUntil) : null;
    return { provider: result.provider, verifiedUntil };
  }

  /** The visitor's unexpired access entry, or null when there is none. RLS lets a visitor read only their own row. */
  private async readAccessRow(accountId: string): Promise<Verdict | null> {
    const { data, error } = await this.client
      .from(ADMINS_TABLE)
      .select('provider, verified_until')
      .eq('user_id', accountId)
      .gt('verified_until', new Date().toISOString())
      .maybeSingle();
    if (error) throw new UnavailableError('Your access could not be checked.', { cause: error });
    if (!data) return null;

    const row = AdminRowSchema.parse(data);
    return { provider: row.provider, verifiedUntil: new Date(row.verified_until) };
  }
}

/** Which provider vouched for the visitor, and until when; `verifiedUntil` is null when they are not a member. */
type Verdict = Readonly<{ provider: SignInProvider; verifiedUntil: Date | null }>;

/** The visitor's account, named and pictured as they are on `provider`. */
function toAccount(user: SessionUser, provider: SignInProvider): Account {
  const identity = user.identities.find((candidate) => candidate.provider === provider);
  const profile = identity?.identity_data ?? user.user_metadata;
  return AccountSchema.parse({
    id: user.id,
    name: profile.custom_claims?.global_name ?? profile.full_name ?? profile.name ?? 'LCS member',
    avatarUrl: profile.avatar_url ?? null,
    provider,
  });
}

/**
 * With no fresh token and no access row, nothing on the server says which provider was used. Any linked one
 * is right for the "not on the list" message, which then names a real place to join.
 */
function fallbackProvider(user: SessionUser): SignInProvider {
  return ProviderSchema.parse(user.identities.find((identity) => ProviderSchema.safeParse(identity.provider).success)?.provider);
}
