/**
 * Test answers for `lib/auth`. A test file calls `vi.mock('…/lib/auth/auth')` first, then `mockAccess(...)` to set what
 * the access check returns (or throws).
 */
import { checkAccess, onSignInChange, signIn, signOut } from '../../src/lib/auth/auth';
import type { Access, Account, Admin } from '../../src/types/auth';

export const SAM: Account = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  avatarUrl: null,
  provider: 'discord',
};

export const SAM_ADMIN: Admin = { kind: 'admin', account: SAM, verifiedUntil: new Date('2026-11-25T17:00:00Z') };

export function mockAccess(access: Access | Error) {
  vi.mocked(onSignInChange).mockReturnValue(() => {});
  vi.mocked(signIn).mockResolvedValue();
  vi.mocked(signOut).mockResolvedValue();
  if (access instanceof Error) vi.mocked(checkAccess).mockRejectedValue(access);
  else vi.mocked(checkAccess).mockResolvedValue(access);
}
