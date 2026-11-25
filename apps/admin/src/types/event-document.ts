/**
 * An event document as the admin works with it, matching the v2 `event_documents` table.
 */
import { z } from 'zod';

export const EventDocumentSchema = z.object({
  id: z.uuid(),
  eventId: z.uuid(),
  title: z.string().trim().min(1),
  /** Path in the `event-media` bucket. */
  path: z.string(),
  fileUrl: z.url(),
  sortOrder: z.number().int().nonnegative(),
});
export type EventDocument = Readonly<z.infer<typeof EventDocumentSchema>>;

/** What an exec fills in for a document. */
export type DocumentFields = Readonly<Pick<EventDocument, 'title'>>;
