/**
 * A department's heading on the crew board: its name on a label in a rotating accent, how many crew it has and
 * how many are hidden, and a rule out to the edge.
 */
import { accentAt } from '../../lib/accents';
import { ACCENT_FILLS } from '../ui/accent-styles';

type DepartmentHeadingProps = {
  name: string;
  /** Its place on the board, which picks its accent. */
  index: number;
  crew: number;
  hidden: number;
};

export function DepartmentHeading({ name, index, crew, hidden }: DepartmentHeadingProps) {
  return (
    <div className="flex items-center gap-3">
      <h2 className={`rounded-tag px-3 py-1 font-display text-lg font-extrabold shadow-(--shadow-cutout) ${ACCENT_FILLS[accentAt(index)]}`}>
        {name}
      </h2>
      <p className="shrink-0 font-display text-xs font-bold tracking-widest text-text-2 uppercase">
        {crew} crew{hidden > 0 && ` · ${hidden} hidden`}
      </p>
      <span aria-hidden="true" className="h-px flex-1 bg-line" />
    </div>
  );
}
