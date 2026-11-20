/** Events loaded and cached by TanStack Query, and the changes that refresh them: create, update, delete. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createEvent, deleteEvent, getEvent, listEvents, updateEvent } from '../lib/events';
import type { Event, EventFields } from '../types/event';

// Every events query starts with this key, so one invalidation refreshes the list and any open event.
const EVENTS_KEY = ['events'] as const;

export function useEvents() {
  return useQuery({ queryKey: EVENTS_KEY, queryFn: listEvents });
}

/** One event for the edit page; `data` is null when there is no such event. */
export function useEvent(id: string) {
  return useQuery({ queryKey: [...EVENTS_KEY, id], queryFn: () => getEvent(id) });
}

/** Refreshes every events query once a change has been saved. */
function useRefreshEvents() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY });
}

export function useCreateEvent() {
  const refresh = useRefreshEvents();
  return useMutation({ mutationFn: (fields: EventFields) => createEvent(fields), onSuccess: refresh });
}

export function useUpdateEvent(id: string) {
  const refresh = useRefreshEvents();
  return useMutation({ mutationFn: (changes: Partial<EventFields>) => updateEvent(id, changes), onSuccess: refresh });
}

/** Deletes an event, then reloads the list so it disappears everywhere the events are shown. */
export function useDeleteEvent() {
  const refresh = useRefreshEvents();
  return useMutation({ mutationFn: (event: Event) => deleteEvent(event), onSuccess: refresh });
}
