import { getSupabase, type QueryError } from '../supabase';

export type TeamMember = {
  id: string;
  name: string;
  picture_url: string | null;
  role: string | null;
  department: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  is_public: boolean;
  created_at: string;
};

const COLUMNS = 'id, name, picture_url, role, department, github_url, linkedin_url, is_public, created_at';

export async function getPublicTeam(): Promise<{ members: TeamMember[]; error: QueryError | null }> {
  const sb = getSupabase();
  if ('error' in sb) return { members: [], error: sb.error };

  const { data, error } = await sb.client.from('team').select(COLUMNS).eq('is_public', true);
  if (error) return { members: [], error: { message: 'Could not load the team.' } };
  return { members: (data ?? []) as TeamMember[], error: null };
}
