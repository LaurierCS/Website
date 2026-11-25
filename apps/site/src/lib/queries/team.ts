/**
 * Reading the public team from Supabase (the `v2` schema). The team table only lets anyone read the members an
 * exec has made public, and this asks for only those too.
 */
import { UnavailableError } from '../errors';
import { BUCKETS, publicUrl } from '../storage';
import { getSupabase } from '../supabase';
import { toTeamMember, type TeamMember } from '../team';

const COLUMNS = 'id, name, role, department, picture_path, linkedin_url, github_url';

/**
 * Everyone on the public team, sorted by name. Empty when nobody is public yet. A row that can't be read is left
 * out and logged, so one bad row can't hide everyone else.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listPublicTeam(): Promise<readonly TeamMember[]> {
  const { data, error } = await getSupabase()
    .schema('v2')
    .from('team')
    .select(COLUMNS)
    .eq('is_public', true)
    .order('name');
  if (error) throw new UnavailableError('The team could not be loaded.', { cause: error });
  return data.flatMap((row) => {
    const member = toTeamMember(row, (path) => publicUrl(BUCKETS.team, path));
    if (!member) console.warn('Left a team row out of the site: it is missing a name or has a bad id.', row);
    return member ?? [];
  });
}
