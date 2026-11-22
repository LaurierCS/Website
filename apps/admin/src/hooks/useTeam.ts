/** Team members loaded and cached by TanStack Query, and the changes that refresh them. */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ReadyImport, rowsToSave } from '../lib/csv-import';
import { createMember, deleteMember, getMember, importTeam, listTeam, setMemberPublic, updateMember } from '../lib/team';
import type { PictureChange } from '../lib/images';
import type { MemberFields, TeamMember } from '../types/team';

// Every team query starts with this key, so one invalidation refreshes the list and any open member.
const TEAM_KEY = ['team'] as const;

export function useTeam() {
  return useQuery({ queryKey: TEAM_KEY, queryFn: listTeam });
}

/** One member for the edit page; `data` is null when there is no such member. */
export function useMember(id: string) {
  return useQuery({ queryKey: [...TEAM_KEY, id], queryFn: () => getMember(id) });
}

export function useCreateMember() {
  const refresh = useRefreshTeam();
  return useMutation({
    mutationFn: ({ fields, photo }: { fields: MemberFields; photo: PictureChange }) => createMember(fields, photo),
    onSuccess: refresh,
  });
}

export function useUpdateMember(member: TeamMember) {
  const refresh = useRefreshTeam();
  return useMutation({
    mutationFn: ({ changes, photo }: { changes: Partial<MemberFields>; photo: PictureChange }) =>
      updateMember(member, changes, photo),
    onSuccess: refresh,
  });
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

/** Saves a checked CSV import, all of it or none, then reloads the team. */
export function useImportTeam() {
  const refresh = useRefreshTeam();
  return useMutation({ mutationFn: (plan: ReadyImport<TeamMember, MemberFields>) => importTeam(rowsToSave(plan)), onSuccess: refresh });
}
