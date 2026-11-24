/**
 * The site's error for data it could not get. "Couldn't load" is never shown as "there are none".
 */

/** Supabase (or another source) could not be reached, or refused the read. The message is safe to show. */
export class UnavailableError extends Error {
  readonly kind = 'unavailable';

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UnavailableError';
  }
}
