/**
 * A labelled form field, with an optional hint and error under it. It hands the input the attributes
 * that tie them together, so screen readers read the hint and the error with the input, know when it is invalid
 * and know when it must be filled in.
 */
import type { ReactNode } from 'react';
import { FieldError } from './FieldError';
import { Tag } from './Tag';

/** Spread onto the field's input. */
export type FieldInputProps = {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean;
  'aria-required': boolean;
};

type FormFieldProps = {
  id: string;
  label: string;
  /** Shows a "Required" tag beside the label. */
  required?: boolean;
  /** Drawn inside the input on its right, like a pin for a location. Decorative. */
  icon?: ReactNode;
  hint?: string | null;
  error?: string;
  children: (input: FieldInputProps) => ReactNode;
};

export function FormField({ id, label, required = false, icon, hint, error, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor={id} className="font-display text-base font-bold text-white">
          {label}
        </label>
        {/* Outside the label, so the input's name stays just the label; `aria-required` tells screen readers. */}
        {required && <Tag tone="reminder">Required</Tag>}
      </div>
      <div className="relative">
        {children({ id, 'aria-describedby': describedBy, 'aria-invalid': Boolean(error), 'aria-required': required })}
        {icon && (
          <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted">
            {icon}
          </span>
        )}
      </div>
      {hint && (
        <p id={hintId} className="mt-2 text-sm text-text-2">
          {hint}
        </p>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}
