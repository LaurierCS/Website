/**
 * An event photo as the admin works with it, matching the v2 `event_photos` table.
 */
import { z } from 'zod';

export const EventPhotoSchema = z.object({
  id: z.uuid(),
  eventId: z.uuid(),
  /** Path in the `event-media` bucket. */
  path: z.string(),
  pictureUrl: z.url(),
  alt: z.string().nullable(),
  isCover: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
});
export type EventPhoto = Readonly<z.infer<typeof EventPhotoSchema>>;

/** What an exec fills in for a photo. */
export type PhotoFields = Readonly<Pick<EventPhoto, 'alt'>>;
