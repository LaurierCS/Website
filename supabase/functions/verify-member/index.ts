/**
 * verify-member: decides whether a signed-in visitor gets into the admin dashboard.
 *
 * Called by the admin right after an OAuth sign-in, with the provider's access token. It checks that the token
 * belongs to the same person who signed in, then that they are in the LCS Discord server or the LCS Notion
 * workspace, and records the answer in `public.admins` with an expiry. Only this function writes that table
 * (it uses the service role key, which never leaves Supabase).
 *
 * Secrets: DISCORD_GUILD_ID, NOTION_WORKSPACE_ID. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by
 * Supabase.
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const DISCORD_API = 'https://discord.com/api/v10';
const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2026-03-11';
const ACCESS_DAYS = 7;
const PROVIDER_TIMEOUT_MS = 8000;

// The admin calls this from the browser with a bearer token, not cookies, so any origin is safe to allow.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type Config = Readonly<{
  supabaseUrl: string;
  serviceRoleKey: string;
  discordGuildId: string;
  notionWorkspaceId: string;
}>;

/** A provider answered in a way that says nothing about membership (outage, rate limit, bad token). */
class ProviderError extends Error {}

function readConfig(): Config {
  const read = (name: string): string => {
    const value = Deno.env.get(name);
    if (!value) throw new Error(`verify-member is missing the ${name} secret.`);
    return value;
  };
  return {
    supabaseUrl: read('SUPABASE_URL'),
    serviceRoleKey: read('SUPABASE_SERVICE_ROLE_KEY'),
    discordGuildId: read('DISCORD_GUILD_ID'),
    notionWorkspaceId: read('NOTION_WORKSPACE_ID'),
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
}

/** Logs why recording access failed (Postgres code and message, never tokens) and answers 503. */
function storeFailed(operation: 'upsert' | 'delete', error: { code?: string; message: string }): Response {
  console.error('verify-member.store_failed', { operation, code: error.code, message: error.message });
  return json({ error: 'unavailable' }, 503);
}

/** The provider's error, for the log: its status and the start of its body, which never contains our token. */
async function providerError(provider: string, response: Response): Promise<ProviderError> {
  const body = (await response.text()).slice(0, 300);
  return new ProviderError(`${provider} answered ${response.status}: ${body}`);
}

function fetchProvider(url: string, headers: Record<string, string>): Promise<Response> {
  return fetch(url, { headers, signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS) });
}

/** The provider did not accept the token as one of its own (401): it belongs to another provider. */
class NotThisProvidersToken extends Error {}

type MembershipCheck = (token: string, providerUserId: string, config: Config) => Promise<boolean>;

/** In the LCS server, and the token is the signed-in person's own Discord account. */
const isInDiscordGuild: MembershipCheck = async (token, discordUserId, config) => {
  const response = await fetchProvider(`${DISCORD_API}/users/@me/guilds/${config.discordGuildId}/member`, {
    Authorization: `Bearer ${token}`,
  });
  if (response.status === 401) throw new NotThisProvidersToken();
  // Discord answers 404 when the account is not in the server.
  if (response.status === 404) return false;
  if (!response.ok) throw await providerError('Discord', response);

  const member = await response.json();
  return member?.user?.id === discordUserId;
};

/** The token was authorized in the LCS workspace, by the signed-in person's own Notion account. */
const isInNotionWorkspace: MembershipCheck = async (token, notionUserId, config) => {
  const response = await fetchProvider(`${NOTION_API}/users/me`, {
    Authorization: `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
  });
  if (response.status === 401) throw new NotThisProvidersToken();
  if (!response.ok) throw await providerError('Notion', response);

  const self = await response.json();
  return self?.bot?.workspace_id === config.notionWorkspaceId && self?.bot?.owner?.user?.id === notionUserId;
};

/** One entry per sign-in provider. Dropping a provider later is deleting its line. */
const MEMBERSHIP_CHECKS: Readonly<Record<string, MembershipCheck>> = {
  discord: isInDiscordGuild,
  notion: isInNotionWorkspace,
};

type Identity = { provider: string; identity_data?: { sub?: unknown; provider_id?: unknown } | null };

/**
 * Which linked identity the token belongs to, and whether that identity is part of LCS. Supabase links
 * Discord and Notion sign-ins that share an email into one user and does not say which one was just used,
 * so the token decides: the provider that accepts it is the one, and its user ID must match the identity.
 * Returns null when no linked provider accepts the token.
 */
async function checkMembership(
  token: string,
  identities: readonly Identity[],
  config: Config,
): Promise<{ provider: string; isMember: boolean } | null> {
  for (const identity of identities) {
    const check = MEMBERSHIP_CHECKS[identity.provider];
    const providerUserId = identity.identity_data?.provider_id ?? identity.identity_data?.sub;
    if (!check || typeof providerUserId !== 'string') continue;
    try {
      return { provider: identity.provider, isMember: await check(token, providerUserId, config) };
    } catch (error) {
      if (!(error instanceof NotThisProvidersToken)) throw error;
    }
  }
  return null;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  // A missing secret is our setup problem, not the caller's. Answer like any other outage, with CORS headers, so
  // the browser shows "door's jammed" instead of a CORS error that hides the cause; the log names the secret.
  let config: Config;
  try {
    config = readConfig();
  } catch (error) {
    console.error('verify-member.misconfigured', { reason: error instanceof Error ? error.message : 'unknown' });
    return json({ error: 'unavailable' }, 503);
  }
  const supabase = createClient(config.supabaseUrl, config.serviceRoleKey, { auth: { persistSession: false } });

  const jwt = request.headers.get('Authorization')?.replace(/^Bearer /, '');
  if (!jwt) return json({ error: 'unauthenticated' }, 401);
  const { data: auth, error: authError } = await supabase.auth.getUser(jwt);
  const user = auth.user;
  if (authError || !user) return json({ error: 'unauthenticated' }, 401);

  const body = await request.json().catch(() => null);
  const providerToken = typeof body?.providerToken === 'string' ? body.providerToken : null;
  if (!providerToken) return json({ error: 'invalid_input', message: 'providerToken is required.' }, 400);

  let result: Awaited<ReturnType<typeof checkMembership>>;
  try {
    result = await checkMembership(providerToken, user.identities ?? [], config);
  } catch (error) {
    // An outage is not a "no": report it, and leave any existing access entry alone.
    console.error('verify-member.provider_failed', { reason: error instanceof Error ? error.message : 'unknown' });
    return json({ error: 'unavailable' }, 502);
  }
  if (!result) {
    console.error('verify-member.token_not_recognised', { providers: (user.identities ?? []).map((i) => i.provider) });
    return json({ error: 'invalid_input', message: 'No linked provider accepted the token.' }, 400);
  }

  const { provider, isMember } = result;
  if (!isMember) {
    const { error } = await supabase.from('admins').delete().eq('user_id', user.id);
    if (error) return storeFailed('delete', error);
    return json({ isMember: false, provider, verifiedUntil: null });
  }

  const verifiedUntil = new Date(Date.now() + ACCESS_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await supabase
    .from('admins')
    .upsert({ user_id: user.id, provider, verified_until: verifiedUntil, updated_at: new Date().toISOString() });
  if (error) return storeFailed('upsert', error);

  return json({ isMember: true, provider, verifiedUntil });
});
