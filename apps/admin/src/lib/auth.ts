/**
 * Signing in and out with Discord or Notion, and deciding whether the visitor may use the admin.
 *
 * Signing in is not access. Access comes from the visitor's row in `admins`, which only the `verify-member` Edge
 * Function writes. An unexpired row is used as it is: Discord rate-limits its membership lookup, so asking on
 * every page load would lock members out after a few refreshes. Only when there is no valid row does the
 * function check membership, using the provider token the browser holds right after sign-in.
 *
 * Supabase links Discord and Notion sign-ins that share an email into one user and doesn't say which one was just
 * used, so the function works out the provider from the token and the `admins` row remembers it.
 */
import { z } from 'zod';
import { PATHS } from '../paths';
import { type Access, type Account, AccountSchema, SIGN_IN_PROVIDERS, type SignInProvider } from '../types/auth';
import { UnavailableError } from './errors';
import { getSupabase } from './supabase';

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

/** Which provider vouched for the visitor, and until when; `verifiedUntil` is null when they are not a member. */
type Verdict = Readonly<{ provider: SignInProvider; verifiedUntil: Date | null }>;

/**
 * Sends the browser to `provider` to sign in, coming back to the login page.
 * @throws UnavailableError when sign-in cannot be started.
 */
export async function signIn(provider: SignInProvider): Promise<void> {
  const { error } = await getSupabase().auth.signInWithOAuth({
    provider,
    options: { redirectTo: new URL(PATHS.login, window.location.origin).toString(), scopes: SCOPES[provider] },
  });
  if (error) throw new UnavailableError('Sign-in could not be started.', { cause: error });
}

/**
 * The visitor's access: signed out, signed in but not part of LCS on that provider, signed in with a pass that
 * ran out, or an admin.
 * @throws UnavailableError when Supabase or the provider cannot be reached. An outage is never reported as
 * "not a member".
 */
export async function checkAccess(): Promise<Access> {
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw new UnavailableError('Your session could not be checked.', { cause: error });
  if (!data.session) return { kind: 'signed_out' };

  const user = SessionUserSchema.parse(data.session.user);
  const providerToken = data.session.provider_token;
  const verdict = (await readAccessRow(user.id)) ?? (providerToken ? await verifyMembership(providerToken) : null);

  if (!verdict) {
    // No unexpired pass and no fresh provider token: nobody has said they're *not* a member, their pass just ran
    // out (Supabase drops the provider token after the first hour). Signing in again gets a token to recheck with.
    // An account with no Discord or Notion identity (e.g. an email user made in the Supabase dashboard) has no
    // provider to sign in again with, so it gets the sign-in buttons instead.
    const provider = fallbackProvider(user);
    return provider ? { kind: 'expired', account: toAccount(user, provider) } : { kind: 'signed_out' };
  }
  const account = toAccount(user, verdict.provider);
  return verdict.verifiedUntil ? { kind: 'admin', account, verifiedUntil: verdict.verifiedUntil } : { kind: 'not_member', account };
}

/**
 * Ends the session on this device.
 * @throws UnavailableError when the session could not be ended.
 */
export async function signOut(): Promise<void> {
  const { error } = await getSupabase().auth.signOut({ scope: 'local' });
  if (error) throw new UnavailableError('You could not be signed out.', { cause: error });
}

/** Calls `listener` whenever someone signs in or out. Returns a function that stops listening. */
export function onSignInChange(listener: () => void): () => void {
  const { data } = getSupabase().auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') listener();
  });
  return () => data.subscription.unsubscribe();
}

/** The visitor's unexpired access row, or null when there is none. RLS lets a visitor read only their own row. */
async function readAccessRow(userId: string): Promise<Verdict | null> {
  const { data, error } = await getSupabase()
    .from('admins')
    .select('provider, verified_until')
    .eq('user_id', userId)
    .gt('verified_until', new Date().toISOString())
    .maybeSingle();
  if (error) throw new UnavailableError('Your access could not be checked.', { cause: error });
  if (!data) return null;

  const row = AdminRowSchema.parse(data);
  return { provider: row.provider, verifiedUntil: new Date(row.verified_until) };
}

/** Asks the `verify-member` Edge Function whether the visitor is part of LCS on the provider whose token this is. */
async function verifyMembership(providerToken: string): Promise<Verdict> {
  const { data, error } = await getSupabase().functions.invoke('verify-member', { body: { providerToken } });
  if (error) throw new UnavailableError('Your membership could not be checked.', { cause: error });

  const result = VerifyResponseSchema.parse(data);
  const verifiedUntil = result.isMember && result.verifiedUntil ? new Date(result.verifiedUntil) : null;
  return { provider: result.provider, verifiedUntil };
}

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
 * With no fresh token and no access row, nothing on the server says which provider was used. Any linked one is
 * fine to sign in again with, since the membership check then works out the right one. Null when none is linked.
 */
function fallbackProvider(user: SessionUser): SignInProvider | null {
  for (const identity of user.identities) {
    const provider = ProviderSchema.safeParse(identity.provider);
    if (provider.success) return provider.data;
  }
  return null;
}
