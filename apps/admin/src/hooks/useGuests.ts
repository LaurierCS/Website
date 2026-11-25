/** Guests loaded and cached by TanStack Query, and the changes that refresh them. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createGuest, deleteGuest, getGuest, listGuests, updateGuest } from '../lib/guests';
import type { PictureChange } from '../lib/images';
import type { Guest, GuestFields } from '../types/guest';

// Every guests query starts with this key, so one invalidation refreshes the list and any open guest.
const GUESTS_KEY = ['guests'] as const;

export function useGuests() {
  return useQuery({ queryKey: GUESTS_KEY, queryFn: listGuests });
}

/** One guest for the edit page; `data` is null when there is no such guest. */
export function useGuest(id: string) {
  return useQuery({ queryKey: [...GUESTS_KEY, id], queryFn: () => getGuest(id) });
}

/** Refreshes every guests query once a change has been saved. */
function useRefreshGuests() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: GUESTS_KEY });
}

export function useCreateGuest() {
  const refresh = useRefreshGuests();
  return useMutation({
    mutationFn: ({ fields, picture }: { fields: GuestFields; picture: PictureChange }) => createGuest(fields, picture),
    onSuccess: refresh,
  });
}

export function useUpdateGuest(guest: Guest) {
  const refresh = useRefreshGuests();
  return useMutation({
    mutationFn: ({ changes, picture }: { changes: Partial<GuestFields>; picture: PictureChange }) =>
      updateGuest(guest, changes, picture),
    onSuccess: refresh,
  });
}

export function useDeleteGuest() {
  const refresh = useRefreshGuests();
  return useMutation({ mutationFn: (guest: Guest) => deleteGuest(guest), onSuccess: refresh });
}
