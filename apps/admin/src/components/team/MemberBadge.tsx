/**
 * One team member as a crew badge on a lanyard: a band with the lanyard slot, their photo (or initial), name,
 * role and profile links, then a switch that shows or hides them on the site and saves straight away, Edit and
 * Delete. A hidden member gets a slate band with "Hidden" and an eye-off icon, a dimmed face and "Hidden" by the
 * switch, so it never relies on colour alone. On a phone the badge becomes a compact card with a side stripe.
 */
import { EyeOff, Pencil, Trash } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { generatePath } from 'react-router';
import { useDeleteMember, useSetMemberPublic } from '../../hooks/useTeam';
import { accentFor } from '../../lib/accents';
import { messageFor } from '../../lib/errors';
import { PATHS } from '../../paths';
import type { TeamMember } from '../../types/team';
import { ACCENT_FILLS } from '../ui/accent-styles';
import { Button } from '../ui/Button';
import { ButtonLink } from '../ui/ButtonLink';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ProfileIcon, type ProfileSite } from '../ui/ProfileIcon';
import { Switch } from '../ui/Switch';

const SITE_NAMES: Readonly<Record<ProfileSite, string>> = { github: 'GitHub', linkedin: 'LinkedIn' };

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
  const profiles = (
    [
      ['github', member.githubUrl],
      ['linkedin', member.linkedinUrl],
    ] as const
  ).flatMap(([site, url]) => (url ? [{ site, url }] : []));

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
      className="relative overflow-hidden rounded-card bg-card shadow-(--shadow-cutout)"
    >
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 sm:hidden ${shown ? 'bg-blue' : 'bg-slate'}`} />
      <div
        aria-hidden="true"
        className={`hidden h-11 items-center justify-between px-4 font-display text-xs font-bold tracking-widest uppercase sm:flex ${
          shown ? 'bg-blue text-ink' : 'bg-slate text-text-2'
        }`}
      >
        <span>{shown ? 'Crew' : 'Hidden'}</span>
        <span className="h-2.5 w-11 rounded-full bg-deep" />
        {shown ? <span>LCS</span> : <EyeOff className="size-4" />}
      </div>

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-4 pr-4 pl-5 sm:grid-cols-1 sm:justify-items-center sm:gap-1.5 sm:px-5 sm:pt-5 sm:text-center">
        <Portrait member={member} dimmed={!shown} />
        <div className="min-w-0 sm:mt-1.5">
          <h3 className={`truncate font-display text-xl font-bold ${shown ? 'text-white' : 'text-text-2'}`}>{member.name}</h3>
          <p className="truncate text-sm text-text-2">{member.role ?? 'No role yet'}</p>
          {!shown && (
            <p className="mt-1 inline-flex items-center gap-1 rounded-tag bg-deep px-1.5 py-0.5 font-display text-xs font-bold tracking-widest text-text-2 uppercase sm:hidden">
              <EyeOff aria-hidden="true" className="size-3" />
              Hidden
            </p>
          )}
        </div>
        <div className="flex gap-2 sm:mt-2">
          {profiles.map(({ site, url }) => (
            <a
              key={site}
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} on ${SITE_NAMES[site]}`}
              className="grid size-11 place-items-center rounded-xl border border-line bg-slate text-text-2 transition-colors duration-150 hover:border-sky hover:text-sky"
            >
              <ProfileIcon site={site} />
            </a>
          ))}
          {profiles.length === 0 && <p className="hidden h-11 items-center text-xs text-text-2 sm:flex">No links added</p>}
        </div>
      </div>

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

/** The member's photo, or the first letter of their name on their own accent colour when they have none. */
function Portrait({ member, dimmed }: { member: TeamMember; dimmed: boolean }) {
  const frame = `size-14 shrink-0 rounded-full border-3 border-paper sm:size-21 ${dimmed ? 'opacity-50' : ''}`;
  if (member.pictureUrl) {
    return <img src={member.pictureUrl} alt="" loading="lazy" className={`${frame} object-cover`} />;
  }
  return (
    <div aria-hidden="true" className={`${frame} grid place-items-center font-display text-2xl font-extrabold sm:text-4xl ${ACCENT_FILLS[accentFor(member.name)]}`}>
      {member.name.charAt(0).toUpperCase()}
    </div>
  );
}
