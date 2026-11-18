/**
 * A typed fake of `AuthGateway`. Tests set the outcome they need; failures are explicit.
 */
import type { Access, Account, Admin, SignInProvider } from '../domain/access';
import type { AppError } from '../domain/errors';
import type { AuthGateway } from '../domain/ports';

export const SAM: Account = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  avatarUrl: null,
  provider: 'discord',
};

export function adminAccess(account: Account = SAM): Admin {
  return { kind: 'admin', account, verifiedUntil: new Date('2026-11-25T17:00:00Z') };
}

export class FakeAuthGateway implements AuthGateway {
  /** What `checkAccess` returns next. */
  access: Access = { kind: 'signed_out' };
  /** When set, `checkAccess` throws this instead. */
  checkFailsWith: AppError | null = null;
  /** When set, `signIn` throws this instead. */
  signInFailsWith: AppError | null = null;
  /** Every provider `signIn` was called with, in order. */
  readonly signIns: SignInProvider[] = [];
  signOutCount = 0;

  private readonly listeners = new Set<() => void>();

  async signIn(provider: SignInProvider): Promise<void> {
    this.signIns.push(provider);
    if (this.signInFailsWith) throw this.signInFailsWith;
  }

  async checkAccess(): Promise<Access> {
    if (this.checkFailsWith) throw this.checkFailsWith;
    return this.access;
  }

  async signOut(): Promise<void> {
    this.signOutCount += 1;
    this.access = { kind: 'signed_out' };
    this.listeners.forEach((listener) => listener());
  }

  onSignInChange(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
