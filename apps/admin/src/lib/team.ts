/**
 * Reading, adding, changing, importing, showing or hiding, and deleting team members in Supabase v2, with their
 * photos. Rows are checked and turned into `TeamMember`s here, once, so pages get typed data.
 */
import { z } from 'zod';
import type { Database } from '../types/database.types';
import { type MemberFields, type TeamMember, TeamMemberSchema } from '../types/team';
import type { ImportRows } from './csv-import';
import { UnavailableError } from './errors';
import type { PictureChange } from './images';
import { BUCKETS, publicUrl, removeImage, uploadImage } from './storage';
import { getSupabase } from './supabase';

type TeamRow = Database['v2']['Tables']['team']['Row'];
type TeamUpdate = Database['v2']['Tables']['team']['Update'];

const COLUMNS = 'id, name, role, department, is_public, picture_path, github_url, linkedin_url';

const v2 = () => getSupabase().schema('v2');

/**
 * Every team member, hidden ones included (admins can see them), sorted by name. Empty when there are none. A
 * row that doesn't fit `TeamMember` is left out and logged, so one bad row can't hide everyone else.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listTeam(): Promise<readonly TeamMember[]> {
  const { data, error } = await v2().from('team').select(COLUMNS).order('name');
  if (error) throw new UnavailableError('The team could not be loaded.', { cause: error });
  return data.flatMap((row) => toTeamMember(row) ?? []);
}

/**
 * One member for the edit page, or null when there is no such member (or the id in the URL isn't one).
 * @throws UnavailableError when Supabase cannot be reached, or the member's saved data can't be read.
 */
export async function getMember(id: string): Promise<TeamMember | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const { data, error } = await v2().from('team').select(COLUMNS).eq('id', id).maybeSingle();
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
  const newPhotoPath = photo.kind === 'replace' ? await uploadImage(BUCKETS.team, photo.image) : null;
  const { data, error } = await v2()
    .from('team')
    .insert({ name: fields.name, department: fields.department, ...toColumns(fields), picture_path: newPhotoPath })
    .select('id');
  if (error || data.length === 0) {
    if (newPhotoPath) await removeImage(BUCKETS.team, newPhotoPath);
    throw new UnavailableError(`${fields.name} couldn't be saved.`, { cause: error });
  }
}

/**
 * Saves the fields an exec changed on a member, and their photo change; the rest stay as they were.
 * @throws UnavailableError when it could not be saved (Supabase down, the member is gone, or the update was refused).
 */
export async function updateMember(member: TeamMember, changes: Partial<MemberFields>, photo: PictureChange): Promise<void> {
  const newPhotoPath = photo.kind === 'replace' ? await uploadImage(BUCKETS.team, photo.image) : null;
  const row =
    photo.kind === 'keep' ? toColumns(changes) : { ...toColumns(changes), picture_path: photo.kind === 'remove' ? null : newPhotoPath };
  const { data, error } = await v2().from('team').update(row).eq('id', member.id).select('id');
  if (error || data.length === 0) {
    if (newPhotoPath) await removeImage(BUCKETS.team, newPhotoPath);
    throw new UnavailableError("Your changes couldn't be saved.", { cause: error });
  }
  if (photo.kind !== 'keep' && member.photoPath) await removeImage(BUCKETS.team, member.photoPath);
}

/**
 * Shows a member on the public site, or hides them.
 * @throws UnavailableError when it could not be saved (Supabase down, the member is gone, or the update was refused).
 */
export async function setMemberPublic(member: TeamMember, isPublic: boolean): Promise<void> {
  const { data, error } = await v2().from('team').update({ is_public: isPublic }).eq('id', member.id).select('id');
  if (error || data.length === 0) {
    throw new UnavailableError(`${member.name} couldn't be ${isPublic ? 'shown' : 'hidden'}.`, { cause: error });
  }
}

/**
 * Deletes a member, then their photo if it is a file in our team bucket.
 * @throws UnavailableError when the member could not be deleted (Supabase down, or the delete was refused).
 */
export async function deleteMember(member: TeamMember): Promise<void> {
  const { data, error } = await v2().from('team').delete().eq('id', member.id).select('id');
  if (error || data.length === 0) {
    throw new UnavailableError(`${member.name} couldn't be deleted.`, { cause: error });
  }
  if (member.photoPath) await removeImage(BUCKETS.team, member.photoPath);
}

/**
 * Saves a checked CSV import in one go: the new members first, then every field of the changed ones (by `id`).
 * @throws UnavailableError when nothing could be saved (Supabase down, the import refused, or a changed member gone).
 */
export async function importTeam({ added, changed }: ImportRows<MemberFields>): Promise<void> {
  const db = v2();
  if (added.length > 0) {
    const { error } = await db.from('team').insert(
      added.map((fields) => ({ name: fields.name, department: fields.department, ...toColumns(fields) })),
    );
    if (error) throw new UnavailableError("The import couldn't be saved, so nothing was changed.", { cause: error });
  }
  if (changed.length === 0) return;
  for (const { id, fields } of changed) {
    const { data, error } = await db.from('team').update({ ...toColumns(fields), name: fields.name }).eq('id', id).select('id');
    if (error) throw new UnavailableError("The import couldn't be saved, so nothing was changed.", { cause: error });
    if (data.length === 0) throw new UnavailableError("The import couldn't be saved, so nothing was changed.");
  }
}

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

function toTeamMember(row: Pick<TeamRow, 'id' | 'name' | 'role' | 'department' | 'is_public' | 'picture_path' | 'github_url' | 'linkedin_url'>): TeamMember | null {
  const picturePath = row.picture_path || null;
  const parsed = TeamMemberSchema.safeParse({
    id: row.id,
    name: row.name,
    role: row.role,
    department: row.department,
    isPublic: row.is_public === true,
    photoPath: picturePath,
    pictureUrl: picturePath ? publicUrl(BUCKETS.team, picturePath) : null,
    githubUrl: row.github_url || null,
    linkedinUrl: row.linkedin_url || null,
  });
  if (parsed.success) return parsed.data;
  console.warn('team.row_skipped', { id: row.id, problems: parsed.error.issues.map((issue) => issue.path.join('.')) });
  return null;
}