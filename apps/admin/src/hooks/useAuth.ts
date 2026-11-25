/** The visitor's access and the sign-in and sign-out actions, shared by the login page, the route guard and the header. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { checkAccess, onSignInChange, signIn, signOut } from '../lib/auth/auth';
import type { Access, SignInProvider } from '../types/auth';

const ACCESS_KEY = ['access'] as const;
const SIGNED_OUT: Access = { kind: 'signed_out' };

// Browsers cap timers at about 24.8 days; a pass is 7, so this only guards against a far-future expiry.
const LONGEST_TIMER_MS = 2 ** 31 - 1;

/**
 * Milliseconds until an admin's pass runs out (at least a second), or false for anyone who isn't an admin. Their
 * access is checked again then: until it is, the page would look signed in while row-level security refuses
 * every save.
 */
export function untilPassRunsOut(access: Access | undefined): number | false {
  if (access?.kind !== 'admin') return false;
  return Math.min(Math.max(access.verifiedUntil.getTime() - Date.now(), 1000), LONGEST_TIMER_MS);
}

/** The visitor's access, checked again whenever someone signs in or out, and when an admin's pass runs out. */
export function useAccess() {
  const queryClient = useQueryClient();

  // Nothing waits on the invalidation; the query re-renders the page when fresh access arrives.
  useEffect(() => onSignInChange(() => void queryClient.invalidateQueries({ queryKey: ACCESS_KEY })), [queryClient]);

  return useQuery({
    queryKey: ACCESS_KEY,
    queryFn: checkAccess,
    // Otherwise access only changes when someone signs in or out, which invalidates it above.
    staleTime: (query) => untilPassRunsOut(query.state.data) || Infinity,
    refetchInterval: (query) => untilPassRunsOut(query.state.data),
    // One retry rides out a blip. More would only delay the "door's jammed" message, and each retry can call
    // verify-member, which asks Discord, which rate-limits.
    retry: 1,
  });
}

/** Starts a sign-in. On success the browser leaves the page, so the pending state is the last one seen. */
export function useSignIn() {
  return useMutation({ mutationFn: (provider: SignInProvider) => signIn(provider) });
}

/** Signs out on this device and drops straight to the signed-out state. */
export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.setQueryData(ACCESS_KEY, SIGNED_OUT),
  });
}
