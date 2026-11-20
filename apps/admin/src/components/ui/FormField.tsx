/**
 * A labelled form field with an optional hint and error under it. It hands the input the attributes that tie
 * them together, so screen readers read the hint and the error with the input and know when it is invalid.
 */
import type { ReactNode } from 'react';

/** Spread onto the field's input. */
export type FieldInputProps = {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean;
};

type FormFieldProps = {
  id: string;
  label: string;
  hint?: string | null;
  error?: string;
  children: (input: FieldInputProps) => ReactNode;
};

export function FormField({ id, label, hint, error, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label htmlFor={id} className="font-display text-lg font-bold">
        {label}
      </label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': Boolean(error) })}
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-text-2">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-sm font-medium text-orange">
          {error}
        </p>
      )}
    </div>
  );
}
