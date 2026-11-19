/**
 * Errors the admin shows to people. A failed request throws one of these, so a page can tell "failed to load"
 * apart from "there are none" and show a message that is safe to read.
 */

/** Supabase could not be reached or refused the request. The message is written for the person using the admin. */
export class UnavailableError extends Error {}

/** A message that is safe to show for anything thrown: ours as written, anything else as a generic one. */
export function messageFor(error: unknown): string {
  return error instanceof UnavailableError ? error.message : 'Something went wrong.';
}
