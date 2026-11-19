/** Every event, loaded and cached by TanStack Query. */
import { useQuery } from '@tanstack/react-query';
import { listEvents } from '../lib/events';

export function useEvents() {
  return useQuery({ queryKey: ['events'], queryFn: listEvents });
}
