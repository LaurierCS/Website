/**
 * An event host as the admin works with it, matching the v2 `event_hosts` table.
 * A discriminated union: either a team member (team_id set) or a guest (guest_id set), never both.
 */
import { z } from 'zod';

const TeamHostSchema = z.object({
  id: z.uuid(),
  eventId: z.uuid(),
  kind: z.literal('team'),
  teamId: z.uuid(),
  guestId: z.null(),
  sortOrder: z.number().int().nonnegative(),
});
export type TeamHost = Readonly<z.infer<typeof TeamHostSchema>>;

const GuestHostSchema = z.object({
  id: z.uuid(),
  eventId: z.uuid(),
  kind: z.literal('guest'),
  teamId: z.null(),
  guestId: z.uuid(),
  sortOrder: z.number().int().nonnegative(),
});
export type GuestHost = Readonly<z.infer<typeof GuestHostSchema>>;

export const EventHostSchema = z.union([TeamHostSchema, GuestHostSchema]);
export type EventHost = Readonly<z.infer<typeof EventHostSchema>>;

/** What an exec fills in when adding a host. */
export type HostFields = Readonly<
  | { kind: 'team'; teamId: string }
  | { kind: 'guest'; guestId: string }
>;
