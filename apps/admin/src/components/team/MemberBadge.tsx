/**
 * One team member on the Team board: their crew badge, then a switch that shows or hides them on the site and
 * saves straight away, Edit and Delete. A hidden member also gets "Hidden" by the switch.
 */
import { Pencil, Trash } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { generatePath } from 'react-router';
import { useDeleteMember, useSetMemberPublic } from '../../hooks/useTeam';
import { messageFor } from '../../lib/errors';
import { PATHS } from '../../paths';
import type { TeamMember } from '../../types/team';
import { Button } from '../ui/Button';
import { ButtonLink } from '../ui/ButtonLink';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Switch } from '../ui/Switch';
import { CrewBadge } from './CrewBadge';

// Edit and Delete show their words on a badge, and are 44px icon buttons on a phone card.
const ROW_ACTION = 'max-sm:size-11 max-sm:px-0';

type MemberBadgeProps = {
  member: TeamMember;
  /** Its place in its department, so the badges flip in one after another. */
  index: number;
};

export function MemberBadge({ member, index }: MemberBadgeProps) {
  const [confirming, setConfirming] = useState(false);
  const visibility = useSetMemberPublic(member);
  const deletion = useDeleteMember();
  // While the switch is saving, show where it is going rather than where it was.
  const shown = visibility.isPending ? visibility.variables : member.isPublic;

  function stopConfirming() {
    setConfirming(false);
    deletion.reset();
  }

  return (
    // The signature moment: each department's badges flip in like cards turned over on a board.
    <motion.li
      initial={{ opacity: 0, rotateY: 8 }}
      animate={{ opacity: 1, rotateY: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: Math.min(index * 0.05, 0.3) }}
      style={{ transformPerspective: 800 }}
    >
      <CrewBadge face={{ ...member, isPublic: shown }} layout="board">
        <div className="flex items-center justify-between gap-2 border-t border-line/60 px-4 py-3 sm:grid sm:gap-2.5 sm:pb-4">
          <Switch
            checked={shown}
            saving={visibility.isPending}
            label={`Show ${member.name} on the site`}
            stateText={shown ? 'On the site' : 'Hidden'}
            onChange={(isPublic) => visibility.mutate(isPublic)}
          />
          <div className="flex gap-2 sm:grid sm:grid-cols-2">
            <ButtonLink
              to={generatePath(PATHS.editMember, { id: member.id })}
              variant="quiet"
              size="small"
              className={ROW_ACTION}
              icon={<Pencil aria-hidden="true" className="size-4" />}
              aria-label={`Edit ${member.name}`}
            >
              <span className="max-sm:hidden">Edit</span>
            </ButtonLink>
            <Button
              variant="danger-quiet"
              size="small"
              className={ROW_ACTION}
              icon={<Trash aria-hidden="true" className="size-4" />}
              aria-label={`Delete ${member.name}`}
              onClick={() => setConfirming(true)}
            >
              <span className="max-sm:hidden">Delete</span>
            </Button>
          </div>
        </div>

        {visibility.isError && (
          <p role="alert" className="border-t border-line/60 px-4 py-3 text-sm font-medium text-danger-soft">
            {messageFor(visibility.error)} Try again.
          </p>
        )}
      </CrewBadge>

      {confirming && (
        <ConfirmDialog
          kind="delete"
          question={`Delete ${member.name}?`}
          confirmLabel="Delete"
          pendingLabel="Deleting…"
          pending={deletion.isPending}
          error={deletion.isError ? messageFor(deletion.error) : null}
          onConfirm={() => deletion.mutate(member, { onSuccess: stopConfirming })}
          onCancel={stopConfirming}
        />
      )}
    </motion.li>
  );
}
