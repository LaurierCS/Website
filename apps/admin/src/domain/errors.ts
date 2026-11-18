/**
 * The admin's error categories. Adapters translate vendor errors into these at their edge;
 * screens branch on `kind`, never on message text. Every message is safe to show an exec.
 */

export const ERROR_KINDS = ['invalid_input', 'unauthenticated', 'forbidden', 'not_found', 'conflict', 'unavailable'] as const;
export type ErrorKind = (typeof ERROR_KINDS)[number];

export abstract class AppError extends Error {
  abstract readonly kind: ErrorKind;
}

/** A dependency (Supabase, Discord) could not be reached or failed. Retrying later may work. */
export class UnavailableError extends AppError {
  readonly kind = 'unavailable';
}

/** Anything thrown that is not one of ours, wrapped so screens only ever deal with `AppError`. */
export function toAppError(error: unknown): AppError {
  return error instanceof AppError ? error : new UnavailableError('Something went wrong.', { cause: error });
}
