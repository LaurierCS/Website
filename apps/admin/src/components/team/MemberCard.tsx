/**
 * One team member: photo (or their initial), name, role, profile links, a switch that shows or hides them on the
 * public site and saves straight away, and links to edit or delete them.
 */
import { Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { generatePath } from 'react-router';
import { useDeleteMember, useSetMemberPublic } from '../../hooks/useTeam';
import { messageFor } from '../../lib/errors';
import { PATHS } from '../../paths';
import type { TeamMember } from '../../types/team';
import { Button } from '../ui/Button';
import { ButtonLink } from '../ui/ButtonLink';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ProfileIcon, type ProfileSite } from '../ui/ProfileIcon';

const SITE_NAMES: Readonly<Record<ProfileSite, string>> = { github: 'GitHub', linkedin: 'LinkedIn' };

export function MemberCard({ member }: { member: TeamMember }) {
  const [confirming, setConfirming] = useState(false);
  const visibility = useSetMemberPublic(member);
  const deletion = useDeleteMember();
  // While the switch is saving, show where it is going rather than where it was.
  const shown = visibility.isPending ? visibility.variables : member.isPublic;
  const profiles: readonly [ProfileSite, string | null][] = [
    ['github', member.githubUrl],
    ['linkedin', member.linkedinUrl],
  ];

  function stopConfirming() {
    setConfirming(false);
    deletion.reset();
  }

  return (
    <li className="grid gap-4 rounded-card bg-card p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
      <div className="flex min-w-0 items-center gap-4 sm:contents">
        <Portrait member={member} />
        <div className="min-w-0">
          <h3 className="truncate font-display text-xl font-bold">{member.name}</h3>
          {member.role && <p className="text-text-2">{member.role}</p>}
          <div className="mt-1 flex gap-3">
            {profiles.map(([site, url]) =>
              url ? (
                <a
                  key={site}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.name} on ${SITE_NAMES[site]}`}
                  className="inline-flex size-11 items-center justify-center rounded-full text-text-2 hover:text-sky"
                >
                  <ProfileIcon site={site} />
                </a>
              ) : null,
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={shown}
          aria-label={`Show ${member.name} on the site`}
          disabled={visibility.isPending}
          onClick={() => visibility.mutate(!member.isPublic)}
          className="inline-flex min-h-11 items-center gap-3 rounded-full px-2 font-display font-bold text-text-2 disabled:opacity-60"
        >
          <span aria-hidden="true" className={`flex h-7 w-12 items-center rounded-full p-1 ${shown ? 'bg-sky' : 'bg-line'}`}>
            <span className={`size-5 rounded-full bg-white ${shown ? 'translate-x-5' : ''}`} />
          </span>
          {/* A fixed width, so switching between the two words doesn't shift the buttons next to it. */}
          <span className="w-24 text-left">{shown ? 'On the site' : 'Hidden'}</span>
        </button>
        <ButtonLink
          to={generatePath(PATHS.editMember, { id: member.id })}
          variant="quiet"
          size="small"
          icon={<Pencil aria-hidden="true" className="size-4" />}
          aria-label={`Edit ${member.name}`}
        >
          Edit
        </ButtonLink>
        <Button
          variant="danger-quiet"
          size="small"
          icon={<Trash aria-hidden="true" className="size-4" />}
          aria-label={`Delete ${member.name}`}
          onClick={() => setConfirming(true)}
        >
          Delete
        </Button>
      </div>

      {visibility.isError && (
        <p role="alert" className="font-medium text-orange sm:col-span-3">
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
    </li>
  );
}

/** The member's photo, or the first letter of their name when they have none. */
function Portrait({ member }: { member: TeamMember }) {
  if (member.pictureUrl) {
    return <img src={member.pictureUrl} alt="" loading="lazy" className="size-16 shrink-0 rounded-full object-cover" />;
  }
  return (
    <div
      aria-hidden="true"
      className="grid size-16 shrink-0 place-items-center rounded-full bg-deep font-display text-2xl font-bold text-text-2"
    >
      {member.name.charAt(0).toUpperCase()}
    </div>
  );
}
