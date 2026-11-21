/**
 * Reading, adding, changing, showing or hiding, and deleting team members in Supabase, with their photos. Rows
 * are checked and turned into `TeamMember`s here, once, so pages get typed data.
 */
import { z } from 'zod';
import type { Database } from '../types/database.types';
import { type MemberFields, type TeamMember, TeamMemberSchema } from '../types/team';
import { UnavailableError } from './errors';
import type { PictureChange } from './images';
import { BUCKETS, removeImage, uploadImage } from './storage';
import { getSupabase } from './supabase';

type TeamRow = Database['public']['Tables']['team']['Row'];
type TeamUpdate = Database['public']['Tables']['team']['Update'];

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
 * One member for the edit page, or null when there is no such member (or the id in the URL isn't one).
 * @throws UnavailableError when Supabase cannot be reached, or the member's saved data can't be read.
 */
export async function getMember(id: string): Promise<TeamMember | null> {
  // The id comes from the URL; anything that isn't a uuid can't be a member, so don't ask Supabase.
  if (!z.uuid().safeParse(id).success) return null;
  const { data, error } = await getSupabase().from('team').select(COLUMNS).eq('id', id).maybeSingle();
  if (error) throw new UnavailableError('This team member could not be loaded.', { cause: error });
  if (!data) return null;
  const member = toTeamMember(data);
  if (!member) throw new UnavailableError("This member has saved data the admin can't read. It needs fixing in Supabase.");
  return member;
}

/**
 * Adds a member, uploading their photo first when one was chosen. If the member can't be saved, the uploaded
 * photo is deleted again so no unused file is left behind.
 * @throws UnavailableError when the photo or the member could not be saved (Supabase down, or refused).
 */
export async function createMember(fields: MemberFields, photo: PictureChange): Promise<void> {
  const newPhotoUrl = photo.kind === 'replace' ? await uploadImage(BUCKETS.team, photo.image) : null;
  // `name` is spelled out because it is the one column a new row must have; the types check it is there.
  const { data, error } = await getSupabase()
    .from('team')
    .insert({ ...toColumns(fields), name: fields.name, picture_url: newPhotoUrl })
    .select('id');
  // Row-level security refuses an insert by saving nothing rather than by failing, so check a row came back.
  if (error || data.length === 0) {
    if (newPhotoUrl) await removeImage(BUCKETS.team, newPhotoUrl);
    throw new UnavailableError(`${fields.name} couldn't be saved.`, { cause: error });
  }
}

/**
 * Saves the fields an exec changed on a member, and their photo change; the rest stay as they were. A new photo
 * is uploaded before the row changes and the old file is deleted only after, so a failure part-way never leaves
 * the member pointing at a missing photo.
 * @throws UnavailableError when it could not be saved (Supabase down, the member is gone, or the update was refused).
 */
export async function updateMember(member: TeamMember, changes: Partial<MemberFields>, photo: PictureChange): Promise<void> {
  const newPhotoUrl = photo.kind === 'replace' ? await uploadImage(BUCKETS.team, photo.image) : null;
  const row = photo.kind === 'keep' ? toColumns(changes) : { ...toColumns(changes), picture_url: newPhotoUrl };
  const { data, error } = await getSupabase().from('team').update(row).eq('id', member.id).select('id');
  // Row-level security refuses an update by changing nothing rather than by failing, so check a row came back.
  if (error || data.length === 0) {
    if (newPhotoUrl) await removeImage(BUCKETS.team, newPhotoUrl);
    throw new UnavailableError("Your changes couldn't be saved.", { cause: error });
  }
  if (photo.kind !== 'keep' && member.pictureUrl) await removeImage(BUCKETS.team, member.pictureUrl);
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
 * A member's fields as table columns. A field left out (undefined) is left out of the request, so an update
 * only touches what changed.
 */
function toColumns(fields: Partial<MemberFields>): TeamUpdate {
  return {
    name: fields.name,
    role: fields.role,
    department: fields.department,
    github_url: fields.githubUrl,
    linkedin_url: fields.linkedinUrl,
    is_public: fields.isPublic,
  };
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
