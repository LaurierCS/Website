/**
 * After a form saves, it goes back to its list carrying a "saved" notice in the navigation state, so the list
 * can say what was saved. Navigation state is untyped, so it is checked here when read.
 */
import { z } from 'zod';

const SavedNoticeSchema = z.object({ saved: z.string() });

/** The navigation state for "this was just saved", e.g. `navigate(PATHS.events, { state: savedNotice(title) })`. */
export function savedNotice(name: string): z.infer<typeof SavedNoticeSchema> {
  return { saved: name };
}

/** The name from a "just saved" navigation, or null for any other way of arriving. */
export function savedNameFrom(state: unknown): string | null {
  const parsed = SavedNoticeSchema.safeParse(state);
  return parsed.success ? parsed.data.saved : null;
}
