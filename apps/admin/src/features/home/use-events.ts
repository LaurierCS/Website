/**
 * Every event, for the home screen's overview of what is in Supabase.
 */
import { useQuery } from '@tanstack/react-query';
import { useServices } from '../../app/services';

export function useEvents() {
  const { events } = useServices();
  return useQuery({ queryKey: ['events'], queryFn: () => events.listEvents() });
}
