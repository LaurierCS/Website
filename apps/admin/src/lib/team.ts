/**
 * Reading, showing or hiding, and deleting team members in Supabase. Rows are checked and turned into
 * `TeamMember`s here, once, so pages get typed data.
 */
import type { Database } from '../types/database.types';
import { type TeamMember, TeamMemberSchema } from '../types/team';
import { UnavailableError } from './errors';
import { BUCKETS, removeImage } from './storage';
import { getSupabase } from './supabase';

type TeamRow = Database['public']['Tables']['team']['Row'];

const COLUMNS = 'id, name, role, department, is_public, picture_url, github_url, linkedin_url';

/**
 * Every team member, hidden ones included (admins can see them), sorted by name. Empty when there are none. A
 * row that doesn't fit `TeamMember` is left out and logged, so one bad row can't hide everyone else.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listTeam(): Promise<readonly TeamMember[]> {
  const { data, error } = await getSupabase().from('team').select(COLUMNS).order('name');
  if (error) throw new UnavailableError('The team could not be loaded.', { cause: error });
  return data.flatMap((row) => toTeamMember(row) ?? []);
}

/**
 * Shows a member on the public site, or hides them.
 * @throws UnavailableError when it could not be saved (Supabase down, the member is gone, or the update was refused).
 */
export async function setMemberPublic(member: TeamMember, isPublic: boolean): Promise<void> {
  const { data, error } = await getSupabase().from('team').update({ is_public: isPublic }).eq('id', member.id).select('id');
  // Row-level security refuses an update by changing nothing rather than by failing, so check a row came back.
  if (error || data.length === 0) {
    throw new UnavailableError(`${member.name} couldn't be ${isPublic ? 'shown' : 'hidden'}.`, { cause: error });
  }
}

/**
 * Deletes a member, then their photo if it is a file in our team bucket. The row goes first, so the site never
 * shows a member whose photo is gone.
 * @throws UnavailableError when the member could not be deleted (Supabase down, or the delete was refused).
 */
export async function deleteMember(member: TeamMember): Promise<void> {
  const { data, error } = await getSupabase().from('team').delete().eq('id', member.id).select('id');
  // Row-level security refuses a delete by deleting nothing rather than by failing, so check a row came back.
  if (error || data.length === 0) {
    throw new UnavailableError(`${member.name} couldn't be deleted.`, { cause: error });
  }
  if (member.pictureUrl) await removeImage(BUCKETS.team, member.pictureUrl);
}

/**
 * Renames the snake_case columns. Empty text in a link or photo column means "none", the same as null. A
 * missing `is_public` counts as hidden, because the site only shows members whose `is_public` is true. Null
 * when the row is malformed; the row's id and the problem are logged (never the row's text).
 */
function toTeamMember(row: Pick<TeamRow, 'id' | 'name' | 'role' | 'department' | 'is_public' | 'picture_url' | 'github_url' | 'linkedin_url'>): TeamMember | null {
  const parsed = TeamMemberSchema.safeParse({
    id: row.id,
    name: row.name,
    role: row.role,
    department: row.department,
    isPublic: row.is_public === true,
    pictureUrl: row.picture_url || null,
    githubUrl: row.github_url || null,
    linkedinUrl: row.linkedin_url || null,
  });
  if (parsed.success) return parsed.data;
  console.warn('team.row_skipped', { id: row.id, problems: parsed.error.issues.map((issue) => issue.path.join('.')) });
  return null;
}
