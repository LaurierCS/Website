/** Event relationships loaded and cached by TanStack Query, and the changes that refresh them. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addRelated, deleteRelated, listRelated, reorderRelated } from '../lib/data/event-related';
import type { EventRelated } from '../types/event-related';

// Every related events query for an event starts with this key.
const makeRelatedKey = (eventId: string) => ['related', eventId] as const;

export function useEventRelated(eventId: string) {
  return useQuery({ queryKey: makeRelatedKey(eventId), queryFn: () => listRelated(eventId) });
}

/** Refreshes related events for an event once a change has been saved. */
function useRefreshRelated(eventId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: makeRelatedKey(eventId) });
}

export function useAddRelated(eventId: string) {
  const refresh = useRefreshRelated(eventId);
  return useMutation({
    mutationFn: (relatedId: string) => addRelated(eventId, relatedId),
    onSuccess: refresh,
  });
}

export function useDeleteRelated(eventId: string) {
  const refresh = useRefreshRelated(eventId);
  return useMutation({
    mutationFn: (relatedId: string) => deleteRelated(eventId, relatedId),
    onSuccess: refresh,
  });
}

export function useReorderRelated(eventId: string) {
  const refresh = useRefreshRelated(eventId);
  return useMutation({
    mutationFn: (related: readonly EventRelated[]) => reorderRelated(related),
    onSuccess: refresh,
  });
}
