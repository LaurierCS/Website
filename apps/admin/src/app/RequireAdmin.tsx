/**
 * Guards every admin route. Anyone who is not a verified admin, including during an outage, goes to the login,
 * which explains their state. Hiding screens is UX only; row-level security in Supabase is what refuses non-admin writes.
 */
import { Navigate, Outlet } from 'react-router';
import { useAccess } from '../features/auth/use-access';
import { BrandLoader } from '../ui/BrandLoader';
import { CurrentAdminProvider } from './CurrentAdminProvider';
import { PATHS } from './paths';

export function RequireAdmin() {
  const access = useAccess();

  if (access.isPending) return <BrandLoader label="Checking your pass…" />;
  if (access.isError || access.data.kind !== 'admin') return <Navigate to={PATHS.login} replace />;

  return (
    <CurrentAdminProvider admin={access.data}>
      <Outlet />
    </CurrentAdminProvider>
  );
}
