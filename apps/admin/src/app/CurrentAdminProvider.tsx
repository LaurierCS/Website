/** Hands the signed-in admin to every screen behind `RequireAdmin`; read it with `useCurrentAdmin()`. */
import type { ReactNode } from 'react';
import type { Admin } from '../domain/access';
import { CurrentAdminContext } from './current-admin';

export function CurrentAdminProvider({ admin, children }: { admin: Admin; children: ReactNode }) {
  return <CurrentAdminContext value={admin}>{children}</CurrentAdminContext>;
}
