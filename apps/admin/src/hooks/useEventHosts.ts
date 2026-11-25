/** Event hosts loaded and cached by TanStack Query, and the changes that refresh them. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addGuestHost, addTeamHost, deleteHost, getHost, listHosts, reorderHosts, updateHost } from '../lib/event-hosts';
import type { EventHost, HostFields } from '../types/event-host';

// Every hosts query for an event starts with this key.
const makeHostsKey = (eventId: string) => ['hosts', eventId] as const;

export function useEventHosts(eventId: string) {
  return useQuery({ queryKey: makeHostsKey(eventId), queryFn: () => listHosts(eventId) });
}

/** One host for editing; `data` is null when there is no such host. */
export function useEventHost(id: string) {
  return useQuery({ queryKey: ['host', id], queryFn: () => getHost(id) });
}

/** Refreshes hosts for an event once a change has been saved. */
function useRefreshHosts(eventId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: makeHostsKey(eventId) });
}

export function useAddTeamHost(eventId: string) {
  const refresh = useRefreshHosts(eventId);
  return useMutation({
    mutationFn: (teamId: string) => addTeamHost(eventId, teamId),
    onSuccess: refresh,
  });
}

export function useAddGuestHost(eventId: string) {
  const refresh = useRefreshHosts(eventId);
  return useMutation({
    mutationFn: (guestId: string) => addGuestHost(eventId, guestId),
    onSuccess: refresh,
  });
}

export function useUpdateHost(host: EventHost) {
  const refresh = useRefreshHosts(host.eventId);
  return useMutation({
    mutationFn: (fields: HostFields) => updateHost(host, fields),
    onSuccess: refresh,
  });
}

export function useDeleteHost(host: EventHost) {
  const refresh = useRefreshHosts(host.eventId);
  return useMutation({ mutationFn: () => deleteHost(host), onSuccess: refresh });
}

export function useReorderHosts(eventId: string) {
  const refresh = useRefreshHosts(eventId);
  return useMutation({ mutationFn: (hosts: readonly EventHost[]) => reorderHosts(hosts), onSuccess: refresh });
}
