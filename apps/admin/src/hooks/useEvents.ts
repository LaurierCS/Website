/** Every event, loaded and cached by TanStack Query, and deleting one. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteEvent, listEvents } from '../lib/events';
import type { Event } from '../types/event';

const EVENTS_KEY = ['events'] as const;

export function useEvents() {
  return useQuery({ queryKey: EVENTS_KEY, queryFn: listEvents });
}

/** Deletes an event, then reloads the list so it disappears everywhere the events are shown. */
export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (event: Event) => deleteEvent(event),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
}
