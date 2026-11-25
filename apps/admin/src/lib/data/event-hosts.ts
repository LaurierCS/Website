/**
 * Reading, adding, changing, and deleting event hosts in Supabase v2. Rows are checked and turned into
 * `EventHost`s here, once, so pages get typed data. Each host is either a team member or a guest, never both.
 */
import { z } from 'zod';
import type { Database } from '../../types/database.types';
import { type EventHost, type HostFields, EventHostSchema } from '../../types/event-host';
import { UnavailableError } from '../server/errors';
import { getSupabase } from '../server/supabase';

type HostRow = Database['v2']['Tables']['event_hosts']['Row'];
type HostInsert = Database['v2']['Tables']['event_hosts']['Insert'];
type HostUpdate = Database['v2']['Tables']['event_hosts']['Update'];

const COLUMNS = 'id, event_id, team_id, guest_id, sort_order';

const v2 = () => getSupabase().schema('v2');

/**
 * All hosts for an event, in sort order. Empty when there are none. A row that doesn't fit `EventHost` is left out
 * and logged, so one bad row can't hide every other host.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listHosts(eventId: string): Promise<readonly EventHost[]> {
  if (!z.uuid().safeParse(eventId).success) return [];
  const { data, error } = await v2().from('event_hosts').select(COLUMNS).eq('event_id', eventId).order('sort_order') as any;
  if (error) throw new UnavailableError('Hosts could not be loaded.', { cause: error });
  return data.flatMap((row: any) => toEventHost(row) ?? []);
}

/**
 * One host by id, or null when there is no such host (including an id that isn't a valid id at all).
 * @throws UnavailableError when Supabase cannot be reached, or the saved host has data the admin can't read.
 */
export async function getHost(id: string): Promise<EventHost | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const { data, error } = await v2().from('event_hosts').select(COLUMNS).eq('id', id).maybeSingle() as any;
  if (error) throw new UnavailableError('This host could not be loaded.', { cause: error });
  if (!data) return null;
  const host = toEventHost(data);
  if (!host) throw new UnavailableError("This host has saved data the admin can't read. It needs fixing in Supabase.");
  return host;
}

/**
 * Adds a host (team member or guest) to an event.
 * @throws UnavailableError when the row could not be saved.
 */
export async function addHost(eventId: string, fields: HostFields): Promise<void> {
  if (!z.uuid().safeParse(eventId).success) throw new UnavailableError('Invalid event id.');

  const insert: HostInsert = {
    event_id: eventId,
    team_id: fields.kind === 'team' ? fields.teamId : null,
    guest_id: fields.kind === 'guest' ? fields.guestId : null,
    sort_order: 0, // Will be adjusted if needed
  };

  const { data, error } = await v2()
    .from('event_hosts')
    .select(COLUMNS)
    .eq('event_id', eventId)
    .order('sort_order', { ascending: false })
    .limit(1) as any;
  if (error) throw new UnavailableError("The host couldn't be added.", { cause: error });

  const nextSortOrder = data.length > 0 ? (data[0]?.sort_order ?? -1) + 1 : 0;
  insert.sort_order = nextSortOrder;

  const { error: insertError } = await v2().from('event_hosts').insert(insert);
  if (insertError) throw new UnavailableError("The host couldn't be added.", { cause: insertError });
}

/**
 * Adds a team member as a host to an event.
 * @throws UnavailableError when the row could not be saved.
 */
export async function addTeamHost(eventId: string, teamId: string): Promise<void> {
  return addHost(eventId, { kind: 'team', teamId });
}

/**
 * Adds a guest as a host to an event.
 * @throws UnavailableError when the row could not be saved.
 */
export async function addGuestHost(eventId: string, guestId: string): Promise<void> {
  return addHost(eventId, { kind: 'guest', guestId });
}

/**
 * Updates a host (changing which team member or guest it refers to).
 * @throws UnavailableError when it could not be saved (Supabase down, the host is gone, or the update was refused).
 */
export async function updateHost(host: EventHost, fields: HostFields): Promise<void> {
  const update: HostUpdate = {
    team_id: fields.kind === 'team' ? fields.teamId : null,
    guest_id: fields.kind === 'guest' ? fields.guestId : null,
  };

  const { data, error } = await v2().from('event_hosts').update(update).eq('id', host.id).select('id');
  if (error || data.length === 0) throw new UnavailableError("Your changes couldn't be saved.", { cause: error });
}

/**
 * Deletes a host from an event.
 * @throws UnavailableError when the host could not be deleted (Supabase down, or the delete was refused).
 */
export async function deleteHost(host: EventHost): Promise<void> {
  const { data, error } = await v2().from('event_hosts').delete().eq('id', host.id).select('id');
  if (error || data.length === 0) throw new UnavailableError("The host couldn't be deleted.", { cause: error });
}

/**
 * Reorders hosts by sort_order. All sort orders must be valid, contiguous, and start from 0.
 * @throws UnavailableError when the reorder could not be saved.
 */
export async function reorderHosts(hosts: readonly EventHost[]): Promise<void> {
  if (hosts.length === 0) return;

  for (let i = 0; i < hosts.length; i++) {
    const { error } = await v2()
      .from('event_hosts')
      .update({ sort_order: i })
      .eq('id', hosts[i]!.id);
    if (error) throw new UnavailableError("The hosts couldn't be reordered.", { cause: error });
  }
}

function toEventHost(row: HostRow): EventHost | null {
  const baseData = {
    id: row.id,
    eventId: row.event_id,
    sortOrder: row.sort_order,
  };

  if (row.team_id && !row.guest_id) {
    const parsed = EventHostSchema.safeParse({
      ...baseData,
      kind: 'team' as const,
      teamId: row.team_id,
      guestId: null,
    });
    if (parsed.success) return parsed.data;
  } else if (row.guest_id && !row.team_id) {
    const parsed = EventHostSchema.safeParse({
      ...baseData,
      kind: 'guest' as const,
      teamId: null,
      guestId: row.guest_id,
    });
    if (parsed.success) return parsed.data;
  }

  console.warn('event_hosts.row_skipped', { id: row.id, reason: 'invalid discriminator (must have exactly one of team_id or guest_id)' });
  return null;
}
