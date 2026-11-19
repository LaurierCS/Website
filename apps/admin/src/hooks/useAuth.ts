/** The visitor's access and the sign-in and sign-out actions, shared by the login page, the route guard and the header. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { checkAccess, onSignInChange, signIn, signOut } from '../lib/auth';
import type { Access, SignInProvider } from '../types/auth';

const ACCESS_KEY = ['access'] as const;
const SIGNED_OUT: Access = { kind: 'signed_out' };

/** The visitor's access, checked again whenever someone signs in or out. */
export function useAccess() {
  const queryClient = useQueryClient();

  // Nothing waits on the invalidation; the query re-renders the page when fresh access arrives.
  useEffect(() => onSignInChange(() => void queryClient.invalidateQueries({ queryKey: ACCESS_KEY })), [queryClient]);

  return useQuery({
    queryKey: ACCESS_KEY,
    queryFn: checkAccess,
    // Access only changes when someone signs in or out, which invalidates it above.
    staleTime: Infinity,
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
