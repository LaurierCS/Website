/** Events loaded and cached by TanStack Query, and the changes that refresh them: create, update, delete, import. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ReadyImport, rowsToSave } from '../lib/csv/csv-import';
import { createEvent, deleteEvent, getEvent, importEvents, listEvents, updateEvent } from '../lib/data/events';
import type { PictureChange } from '../lib/ui/images';
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
  return useMutation({
    mutationFn: ({ fields, picture }: { fields: EventFields; picture: PictureChange }) => createEvent(fields, picture),
    onSuccess: refresh,
  });
}

export function useUpdateEvent(event: Event) {
  const refresh = useRefreshEvents();
  return useMutation({
    mutationFn: ({ changes, picture }: { changes: Partial<EventFields>; picture: PictureChange }) =>
      updateEvent(event, changes, picture),
    onSuccess: refresh,
  });
}

/** Deletes an event, then reloads the list so it disappears everywhere the events are shown. */
export function useDeleteEvent() {
  const refresh = useRefreshEvents();
  return useMutation({ mutationFn: (event: Event) => deleteEvent(event), onSuccess: refresh });
}

/** Saves a checked CSV import, all of it or none, then reloads the events. */
export function useImportEvents() {
  const refresh = useRefreshEvents();
  return useMutation({ mutationFn: (plan: ReadyImport<Event, EventFields>) => importEvents(rowsToSave(plan)), onSuccess: refresh });
}
