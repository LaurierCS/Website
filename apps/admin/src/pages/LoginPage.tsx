/**
 * The way in: sign in with Discord or Notion. It says plainly what is happening at each step: checking, signed
 * out, not a member, or unable to check. A verified admin goes straight to the dashboard.
 */
import { Navigate } from 'react-router';
import { useAccess, useSignIn, useSignOut } from '../hooks/useAuth';
import { messageFor } from '../lib/errors';
import { PATHS } from '../paths';
import { PROVIDERS, SIGN_IN_PROVIDERS } from '../types/auth';

export function LoginPage() {
  return (
    <main>
      <h1>LCS Admin</h1>
      <LoginState />
    </main>
  );
}

function LoginState() {
  const access = useAccess();
  const signIn = useSignIn();
  const signOut = useSignOut();

  if (access.isPending) return <p role="status">Checking your sign-in…</p>;

  if (access.isError) {
    return (
      <div role="alert">
        <h2>Couldn't check your sign-in</h2>
        <p>{`${messageFor(access.error)} Wait a minute and try again. If it keeps happening, sign out and sign back in.`}</p>
        <button type="button" onClick={() => void access.refetch()} disabled={signOut.isPending}>
          Try again
        </button>{' '}
        <button type="button" onClick={() => signOut.mutate()} disabled={signOut.isPending}>
          Sign out
        </button>
      </div>
    );
  }

  switch (access.data.kind) {
    case 'admin':
      return <Navigate to={PATHS.home} replace />;
    case 'signed_out':
      return (
        <>
          <h2>Sign in</h2>
          <p>Anyone in the LCS Discord server or the LCS Notion workspace can sign in.</p>
          {SIGN_IN_PROVIDERS.map((provider) => (
            <p key={provider}>
              <button type="button" onClick={() => signIn.mutate(provider)} disabled={signIn.isPending}>
                {signIn.isPending && signIn.variables === provider
                  ? `Opening ${PROVIDERS[provider].label}…`
                  : `Continue with ${PROVIDERS[provider].label}`}
              </button>
            </p>
          ))}
          {signIn.isError && <p role="alert">That sign-in didn't open. Try again in a moment.</p>}
        </>
      );
    case 'not_member': {
      const { account } = access.data;
      const busy = signIn.isPending || signOut.isPending;
      return (
        <>
          <h2>Not on the list</h2>
          <p>{`${account.name}, you're not in ${PROVIDERS[account.provider].community}. If that's wrong, ask a VP of Engineering.`}</p>
          <button type="button" onClick={() => signIn.mutate(account.provider)} disabled={busy}>
            Check again
          </button>{' '}
          <button type="button" onClick={() => signOut.mutate()} disabled={busy}>
            Sign out
          </button>
          {(signIn.isError || signOut.isError) && <p role="alert">That didn't work. Try again in a moment.</p>}
        </>
      );
    }
  }
}
