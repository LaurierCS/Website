/**
 * The signed-in admin, provided by `RequireAdmin` (through `CurrentAdminProvider`) to every screen behind it, so
 * screens never re-check access.
 */
import { createContext, use } from 'react';
import type { Admin } from '../domain/access';

export const CurrentAdminContext = createContext<Admin | null>(null);

/** The signed-in admin. Only valid on screens behind `RequireAdmin`. */
export function useCurrentAdmin(): Admin {
  const admin = use(CurrentAdminContext);
  if (!admin) throw new Error('useCurrentAdmin() was called outside a RequireAdmin route.');
  return admin;
}
