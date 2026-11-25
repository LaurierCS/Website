/**
 * Reading, adding, changing, and deleting event relationships in Supabase v2. Rows are checked and turned into
 * `EventRelated`s here, once, so pages get typed data. These are one-way links: event_id → related_id.
 */
import { z } from 'zod';
import type { Database } from '../types/database.types';
import { type EventRelated, EventRelatedSchema } from '../types/event-related';
import { UnavailableError } from './errors';
import { getSupabase } from './supabase';

type RelatedRow = Database['v2']['Tables']['event_related']['Row'];
type RelatedInsert = Database['v2']['Tables']['event_related']['Insert'];

const COLUMNS = 'event_id, related_id, sort_order';

const v2 = () => getSupabase().schema('v2');

/**
 * All events related to a given event, in sort order. Empty when there are none. A row that doesn't fit
 * `EventRelated` is left out and logged, so one bad row can't hide every other relationship.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listRelated(eventId: string): Promise<readonly EventRelated[]> {
  if (!z.uuid().safeParse(eventId).success) return [];
  const { data, error } = await v2().from('event_related').select(COLUMNS).eq('event_id', eventId).order('sort_order') as any;
  if (error) throw new UnavailableError('Related events could not be loaded.', { cause: error });
  return data.flatMap((row: any) => toEventRelated(row) ?? []);
}

/**
 * Adds a related event link (event_id → related_id).
 * @throws UnavailableError when the row could not be saved.
 */
export async function addRelated(eventId: string, relatedId: string): Promise<void> {
  if (!z.uuid().safeParse(eventId).success || !z.uuid().safeParse(relatedId).success) {
    throw new UnavailableError('Invalid event id.');
  }

  const { data, error } = await v2()
    .from('event_related')
    .select(COLUMNS)
    .eq('event_id', eventId)
    .order('sort_order', { ascending: false })
    .limit(1) as any;
  if (error) throw new UnavailableError("The related event couldn't be added.", { cause: error });

  const nextSortOrder = data.length > 0 ? (data[0]?.sort_order ?? -1) + 1 : 0;

  const insert: RelatedInsert = {
    event_id: eventId,
    related_id: relatedId,
    sort_order: nextSortOrder,
  };

  const { error: insertError } = await v2().from('event_related').insert(insert);
  if (insertError) throw new UnavailableError("The related event couldn't be added.", { cause: insertError });
}

/**
 * Deletes a related event link.
 * @throws UnavailableError when the link could not be deleted (Supabase down, or the delete was refused).
 */
export async function deleteRelated(eventId: string, relatedId: string): Promise<void> {
  if (!z.uuid().safeParse(eventId).success || !z.uuid().safeParse(relatedId).success) {
    throw new UnavailableError('Invalid event id.');
  }

  const { data, error } = await v2()
    .from('event_related')
    .delete()
    .eq('event_id', eventId)
    .eq('related_id', relatedId)
    .select('event_id');
  if (error || data.length === 0) throw new UnavailableError("The related event couldn't be deleted.", { cause: error });
}

/**
 * Reorders related events by sort_order. All sort orders must be valid, contiguous, and start from 0.
 * @throws UnavailableError when the reorder could not be saved.
 */
export async function reorderRelated(related: readonly EventRelated[]): Promise<void> {
  if (related.length === 0) return;

  for (let i = 0; i < related.length; i++) {
    const { error } = await v2()
      .from('event_related')
      .update({ sort_order: i })
      .eq('event_id', related[i]!.eventId)
      .eq('related_id', related[i]!.relatedId);
    if (error) throw new UnavailableError("The related events couldn't be reordered.", { cause: error });
  }
}

function toEventRelated(row: RelatedRow): EventRelated | null {
  const parsed = EventRelatedSchema.safeParse({
    eventId: row.event_id,
    relatedId: row.related_id,
    sortOrder: row.sort_order,
  });
  if (parsed.success) return parsed.data;
  console.warn('event_related.row_skipped', { eventId: row.event_id, relatedId: row.related_id, problems: parsed.error.issues.map((issue) => issue.path.join('.')) });
  return null;
}
