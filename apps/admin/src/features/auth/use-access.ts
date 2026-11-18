/**
 * Server state for the visitor's access, shared by the login screen, the admin guard and the account menu.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useServices } from '../../app/services';
import type { Access, SignInProvider } from '../../domain/access';

const ACCESS_KEY = ['access'] as const;
const SIGNED_OUT: Access = { kind: 'signed_out' };

/** The visitor's access, refreshed whenever someone signs in or out. */
export function useAccess() {
  const { auth } = useServices();
  const queryClient = useQueryClient();

  // Nothing waits on the invalidation; the query itself re-renders the screen when fresh access arrives.
  useEffect(
    () => auth.onSignInChange(() => void queryClient.invalidateQueries({ queryKey: ACCESS_KEY })),
    [auth, queryClient],
  );

  return useQuery({
    queryKey: ACCESS_KEY,
    queryFn: () => auth.checkAccess(),
    // Access only changes when someone signs in or out, which invalidates it above.
    staleTime: Infinity,
  });
}

/** Starts a sign-in with a provider. On success the browser leaves the page, so a pending state is the last one seen. */
export function useSignIn() {
  const { auth } = useServices();
  return useMutation({ mutationFn: (provider: SignInProvider) => auth.signIn(provider) });
}

/** Signs out on this device and drops straight to the signed-out state. */
export function useSignOut() {
  const { auth } = useServices();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => auth.signOut(),
    onSuccess: () => queryClient.setQueryData(ACCESS_KEY, SIGNED_OUT),
  });
}
