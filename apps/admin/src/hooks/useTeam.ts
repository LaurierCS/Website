/** Team members loaded and cached by TanStack Query, and the changes that refresh them. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteMember, listTeam, setMemberPublic } from '../lib/team';
import type { TeamMember } from '../types/team';

// Every team query starts with this key, so one invalidation refreshes them all.
const TEAM_KEY = ['team'] as const;

export function useTeam() {
  return useQuery({ queryKey: TEAM_KEY, queryFn: listTeam });
}

/** Refreshes every team query once a change has been saved. */
function useRefreshTeam() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: TEAM_KEY });
}

/** Shows or hides a member on the public site, saving straight away. */
export function useSetMemberPublic(member: TeamMember) {
  const refresh = useRefreshTeam();
  return useMutation({ mutationFn: (isPublic: boolean) => setMemberPublic(member, isPublic), onSuccess: refresh });
}

export function useDeleteMember() {
  const refresh = useRefreshTeam();
  return useMutation({ mutationFn: (member: TeamMember) => deleteMember(member), onSuccess: refresh });
}
