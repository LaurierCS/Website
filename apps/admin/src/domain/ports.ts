/**
 * The interfaces features depend on. Implementations live in `infra/`; only `app/services.ts`
 * chooses them.
 */
import type { Access, SignInProvider } from './access';
import type { Event } from './event';

export interface EventReader {
  /**
   * Every event, newest first. Empty when there are none.
   * @throws UnavailableError when Supabase cannot be reached or refuses the read.
   */
  listEvents(): Promise<readonly Event[]>;
}

export interface AuthGateway {
  /**
   * Sends the browser to `provider` to sign in. Resolves as the browser starts navigating away.
   * @throws UnavailableError when sign-in cannot be started.
   */
  signIn(provider: SignInProvider): Promise<void>;

  /**
   * The current visitor's access: signed out, signed in but not part of LCS on that provider, or an admin.
   * An unexpired access pass is used as it is; membership is checked with the provider only when there is none.
   * @throws UnavailableError when Supabase or the provider cannot be reached. Never reports "not a member" for an outage.
   */
  checkAccess(): Promise<Access>;

  /**
   * Ends the session on this device.
   * @throws UnavailableError when the session could not be ended.
   */
  signOut(): Promise<void>;

  /** Calls `listener` whenever someone signs in or out. Returns a function that stops listening. */
  onSignInChange(listener: () => void): () => void;
}
