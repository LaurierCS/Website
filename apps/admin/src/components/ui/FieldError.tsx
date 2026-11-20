/**
 * What is wrong with a field, under it: an alert icon and the reason, so colour is never the only clue. The
 * field points at it with `aria-describedby`, using `id`.
 */
import { TriangleAlert } from 'lucide-react';

export function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm font-semibold text-danger-soft">
      <span aria-hidden="true" className="grid size-5.5 shrink-0 place-items-center rounded-full bg-danger text-danger-ink">
        <TriangleAlert className="size-3.5" strokeWidth={2.5} />
      </span>
      <span className="pt-0.5">{children}</span>
    </p>
  );
}
