/**
 * An LCS guest as the admin works with them, matching the v2 `guests` table.
 */
import { z } from 'zod';

export const GuestSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1, 'Give the guest a name.'),
  title: z.string().nullable(),
  /** Path in the `team-images` bucket, when there is a photo. */
  picturePath: z.string().nullable(),
  pictureUrl: z.url().nullable(),
  linkUrl: z.url().nullable(),
});
export type Guest = Readonly<z.infer<typeof GuestSchema>>;

/** What an exec fills in for a guest. */
export type GuestFields = Readonly<Pick<Guest, 'name' | 'title' | 'linkUrl'>>;

/** What a card shows about a guest. */
export type GuestCard = Readonly<Pick<Guest, 'name' | 'title' | 'pictureUrl' | 'linkUrl'>>;
