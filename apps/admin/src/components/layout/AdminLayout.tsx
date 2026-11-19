/** The frame around every admin page: who is signed in, and the way out. */
import { Outlet } from 'react-router';
import { useCurrentAdmin } from '../../context/AuthContext';
import { useSignOut } from '../../hooks/useAuth';

export function AdminLayout() {
  const { account } = useCurrentAdmin();
  const signOut = useSignOut();

  return (
    <>
      <header>
        <span>Signed in as {account.name}</span>{' '}
        <button type="button" onClick={() => signOut.mutate()} disabled={signOut.isPending}>
          {signOut.isPending ? 'Signing out…' : 'Sign out'}
        </button>
        {signOut.isError && <p role="alert">Sign-out didn't work. Try again.</p>}
      </header>
      <Outlet />
    </>
  );
}
