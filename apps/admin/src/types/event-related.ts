/**
 * An event-to-event link as the admin works with it, matching the v2 `event_related` table.
 * One-way links: event_id → related_id.
 */
import { z } from 'zod';

export const EventRelatedSchema = z.object({
  eventId: z.uuid(),
  relatedId: z.uuid(),
  sortOrder: z.number().int().nonnegative(),
});
export type EventRelated = Readonly<z.infer<typeof EventRelatedSchema>>;
