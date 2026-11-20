/**
 * What a list shows instead of its items: nothing there yet, nothing matching a search, or a failure to load. A
 * mascot reacts on the left (on top on a phone). A failure looks different on purpose, with a dashed red edge
 * and a "Couldn't load" chip, so it is never mistaken for an empty list.
 */
import { TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { MASCOTS, type MascotName } from '../../assets/brand';

const TONES = {
  /** Nothing is wrong: an empty list or a search with no matches. */
  calm: { frame: 'border border-line bg-card', role: undefined, chip: null },
  /** Loading failed. Announced to screen readers as soon as it appears. */
  failed: { frame: 'border-2 border-dashed border-danger-soft bg-slate', role: 'alert', chip: "Couldn't load" },
} as const;

export type StateBlockTone = keyof typeof TONES;

type StateBlockProps = {
  tone: StateBlockTone;
  mascot: MascotName;
  title: string;
  body: string;
  /** The one thing to do next, like "New event" or "Try again". */
  action: ReactNode;
};

export function StateBlock({ tone, mascot, title, body, action }: StateBlockProps) {
  const { frame, role, chip } = TONES[tone];

  return (
    <div role={role} className={`grid justify-items-start gap-6 rounded-card p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-10 sm:p-10 ${frame}`}>
      {/* The mascot stands in a soft spotlight. */}
      <div className="grid size-36 place-items-center rounded-full bg-deep/60 sm:size-40">
        <img src={MASCOTS[mascot]} alt="" className="h-28 w-auto sm:h-32" />
      </div>
      <div className="grid justify-items-start gap-2">
        {chip && (
          <p className="inline-flex items-center gap-1.5 rounded-tag bg-danger px-2.5 py-1 font-display text-xs font-bold tracking-wide text-danger-ink uppercase">
            <TriangleAlert aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
            {chip}
          </p>
        )}
        <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
        <p className="text-text-2">{body}</p>
        <div className="mt-3">{action}</div>
      </div>
    </div>
  );
}
