/**
 * Reading, adding, changing, and deleting event documents in Supabase v2. Rows are checked and turned into
 * `EventDocument`s here, once, so pages get typed data. Supported formats: PDF, PowerPoint, images.
 */
import { z } from 'zod';
import type { Database } from '../types/database.types';
import { type EventDocument, type DocumentFields, EventDocumentSchema } from '../types/event-document';
import { UnavailableError } from './errors';
import type { CheckedImage } from './images';
import { BUCKETS, publicUrl, removeImage, uploadImage } from './storage';
import { getSupabase } from './supabase';

type DocumentRow = Database['v2']['Tables']['event_documents']['Row'];

const COLUMNS = 'id, event_id, title, path, sort_order';

const v2 = () => getSupabase().schema('v2');

/**
 * All documents for an event, in sort order. Empty when there are none. A row that doesn't fit `EventDocument` is
 * left out and logged, so one bad row can't hide every other document.
 * @throws UnavailableError when Supabase cannot be reached or refuses the read.
 */
export async function listDocuments(eventId: string): Promise<readonly EventDocument[]> {
  if (!z.uuid().safeParse(eventId).success) return [];
  const { data, error } = await v2().from('event_documents').select(COLUMNS).eq('event_id', eventId).order('sort_order') as any;
  if (error) throw new UnavailableError('Documents could not be loaded.', { cause: error });
  return data.flatMap((row: any) => toEventDocument(row) ?? []);
}

/**
 * One document by id, or null when there is no such document (including an id that isn't a valid id at all).
 * @throws UnavailableError when Supabase cannot be reached, or the saved document has data the admin can't read.
 */
export async function getDocument(id: string): Promise<EventDocument | null> {
  if (!z.uuid().safeParse(id).success) return null;
  const { data, error } = await v2().from('event_documents').select(COLUMNS).eq('id', id).maybeSingle() as any;
  if (error) throw new UnavailableError('This document could not be loaded.', { cause: error });
  if (!data) return null;
  const document = toEventDocument(data);
  if (!document) throw new UnavailableError("This document has saved data the admin can't read. It needs fixing in Supabase.");
  return document;
}

/**
 * Adds a document to an event, uploading the file to `event-media/<event_id>/docs/`.
 * @throws UnavailableError when the upload or the row could not be saved.
 */
export async function addDocument(eventId: string, title: string, file: CheckedImage): Promise<void> {
  if (!z.uuid().safeParse(eventId).success) throw new UnavailableError('Invalid event id.');

  const folder = `${eventId}/docs`;
  const path = await uploadImage(BUCKETS.events, file, folder);

  const { data, error } = await v2()
    .from('event_documents')
    .select(COLUMNS)
    .eq('event_id', eventId)
    .order('sort_order', { ascending: false })
    .limit(1) as any;
  if (error) {
    await removeImage(BUCKETS.events, path);
    throw new UnavailableError("The document couldn't be saved.", { cause: error });
  }

  const nextSortOrder = data.length > 0 ? (data[0]?.sort_order ?? -1) + 1 : 0;

  const { error: insertError } = await v2()
    .from('event_documents')
    .insert({ event_id: eventId, title: title.trim(), path, sort_order: nextSortOrder });
  if (insertError) {
    await removeImage(BUCKETS.events, path);
    throw new UnavailableError("The document couldn't be saved.", { cause: insertError });
  }
}

/**
 * Updates a document's title.
 * @throws UnavailableError when it could not be saved (Supabase down, the document is gone, or the update was refused).
 */
export async function updateDocument(document: EventDocument, changes: Partial<DocumentFields>): Promise<void> {
  const { data, error } = await v2()
    .from('event_documents')
    .update({ title: changes.title?.trim() ?? document.title })
    .eq('id', document.id)
    .select('id');
  if (error || data.length === 0) throw new UnavailableError("Your changes couldn't be saved.", { cause: error });
}

/**
 * Deletes a document, then the file in storage.
 * @throws UnavailableError when the document could not be deleted (Supabase down, or the delete was refused).
 */
export async function deleteDocument(document: EventDocument): Promise<void> {
  const { data, error } = await v2().from('event_documents').delete().eq('id', document.id).select('id');
  if (error || data.length === 0) throw new UnavailableError("The document couldn't be deleted.", { cause: error });
  await removeImage(BUCKETS.events, document.path);
}

/**
 * Reorders documents by sort_order. All sort orders must be valid, contiguous, and start from 0.
 * @throws UnavailableError when the reorder could not be saved.
 */
export async function reorderDocuments(documents: readonly EventDocument[]): Promise<void> {
  if (documents.length === 0) return;

  for (let i = 0; i < documents.length; i++) {
    const { error } = await v2()
      .from('event_documents')
      .update({ sort_order: i })
      .eq('id', documents[i]!.id);
    if (error) throw new UnavailableError("The documents couldn't be reordered.", { cause: error });
  }
}

function toEventDocument(row: DocumentRow): EventDocument | null {
  const parsed = EventDocumentSchema.safeParse({
    id: row.id,
    eventId: row.event_id,
    title: row.title,
    path: row.path,
    fileUrl: publicUrl(BUCKETS.events, row.path),
    sortOrder: row.sort_order,
  });
  if (parsed.success) return parsed.data;
  console.warn('event_documents.row_skipped', { id: row.id, problems: parsed.error.issues.map((issue) => issue.path.join('.')) });
  return null;
}
