/**
 * The crew badge beside the team form, hanging on its LCS lanyard. It shows the member as the form stands, so an
 * exec sees how they will look on the Team board before saving, hidden look included. Once saving works, `drop`
 * is set: the badge drops onto the lanyard and swings to rest, then `onDropped` moves on.
 */
import { motion, type Transition } from 'motion/react';
import type { BadgeFace } from '../../types/team';
import { Lanyard } from '../ui/Lanyard';
import { SwitchFace } from '../ui/Switch';
import { CrewBadge } from './CrewBadge';

// 1.2 s in all: the drop and swing take the first 0.66 s, then the badge hangs still so it can be seen before
// Team opens. With reduced motion only the opacity changes, so it fades in instead.
const DROP = {
  y: [-24, 0, 0, 0],
  rotate: [-4, 2, 0, 0],
  opacity: [0.4, 1, 1, 1],
};
const DROP_TRANSITION: Transition = { duration: 1.2, times: [0, 0.3, 0.55, 1], ease: 'easeOut' };

const CAPTIONS = {
  shown: 'The badge updates as you type. It’s how they show on the Team board, hidden look included.',
  hidden: 'Hidden: this is how the badge shows on the Team board, but it is not on the site.',
} as const;

type BadgePreviewProps = {
  face: BadgeFace;
  drop: { text: string; onDropped: () => void } | null;
};

export function BadgePreview({ face, drop }: BadgePreviewProps) {
  return (
    <div>
      <p aria-hidden="true" className="text-center font-display text-xs font-bold tracking-label text-muted uppercase">
        Preview · Team board
      </p>

      {/* Room above the badge for the strap, which hangs up from it. */}
      <div className="pt-40">
        <div className="relative mx-auto w-full max-w-68">
          <Lanyard size="badge" />
          {/* The strap stays put; the badge drops onto its clip and swings from there. The form already says all
              of this to screen readers, and inert keeps the badge's links out of the tab order. */}
          <motion.div
            inert
            aria-hidden="true"
            className="origin-top"
            animate={drop ? DROP : undefined}
            transition={DROP_TRANSITION}
            onAnimationComplete={() => drop?.onDropped()}
          >
            <CrewBadge face={face} layout="badge">
              <div className="border-t border-line/60 px-4 py-3">
                <span className="inline-flex min-h-11 items-center gap-3 font-display font-bold">
                  <SwitchFace checked={face.isPublic} saving={false} stateText={face.isPublic ? 'On the site' : 'Hidden'} />
                </span>
              </div>
            </CrewBadge>
          </motion.div>
        </div>
      </div>

      <p role="status" className="mx-auto mt-3 max-w-68 text-sm text-text-2 lg:max-w-none">
        {drop ? `${drop.text}. Back to Team in a moment.` : CAPTIONS[face.isPublic ? 'shown' : 'hidden']}
      </p>
    </div>
  );
}
