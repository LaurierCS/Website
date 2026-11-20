/**
 * How a text input looks in the admin's forms, shared by every form so they all match. A field with an icon on
 * its right also adds `FIELD_INPUT_WITH_ICON`.
 */

export const FIELD_INPUT =
  'block w-full rounded-field border-2 border-line bg-deep px-4 py-3 text-white scheme-dark placeholder:text-muted transition-colors duration-150 hover:border-muted focus:border-yellow aria-invalid:border-danger';

/** Room on the right for the field's icon, so text never runs under it. */
export const FIELD_INPUT_WITH_ICON = 'pr-12';
