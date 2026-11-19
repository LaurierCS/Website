/**
 * Guards every admin page. Anyone who isn't a verified admin, including during an outage, goes to the login page,
 * which explains why. Hiding pages is only for convenience; row-level security in Supabase is what refuses
 * non-admin writes.
 */
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { useAccess } from '../../hooks/useAuth';
import { PATHS } from '../../paths';

export function RequireAdmin() {
  const access = useAccess();

  if (access.isPending) return <p role="status">Checking your sign-in…</p>;
  if (access.isError || access.data.kind !== 'admin') return <Navigate to={PATHS.login} replace />;

  return (
    <AuthContext value={access.data}>
      <Outlet />
    </AuthContext>
  );
}
