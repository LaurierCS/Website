/**
 * The signed-in admin, handed by `RequireAdmin` to every page behind it, so pages never check access again.
 */
import { createContext, use } from 'react';
import type { Admin } from '../types/auth';

export const AuthContext = createContext<Admin | null>(null);

/** The signed-in admin. Only valid on pages behind `RequireAdmin`. */
export function useCurrentAdmin(): Admin {
  const admin = use(AuthContext);
  if (!admin) throw new Error('useCurrentAdmin() was called outside a RequireAdmin route.');
  return admin;
}
