/**
 * A crew badge: a band with the lanyard slot in the middle, their photo (or initial), name, role and profile
 * links, and whatever goes under them as `children` (the Team board's switch and buttons). A member on the site
 * gets a pink band; a hidden one gets a slate band with "Hidden" and an eye-off icon and a dimmed face, so it
 * never relies on colour alone.
 */
import { EyeOff } from 'lucide-react';
import type { ReactNode } from 'react';
import { accentFor } from '../../lib/accents';
import type { BadgeFace } from '../../types/team';
import { ACCENT_FILLS } from '../ui/accent-styles';
import { ProfileIcon, type ProfileSite } from '../ui/ProfileIcon';

const SITE_NAMES: Readonly<Record<ProfileSite, string>> = { github: 'GitHub', linkedin: 'LinkedIn' };

/**
 * `board`: on the Team board, where a phone shows a compact card with a side stripe so a whole department fits on
 * screen. `badge`: always the full badge, like the one hanging on its lanyard beside the team form.
 */
const LAYOUTS = {
  board: {
    stripe: 'sm:hidden',
    band: 'hidden sm:grid',
    body: 'grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-4 pr-4 pl-5 sm:grid-cols-1 sm:justify-items-center sm:gap-1.5 sm:px-5 sm:pt-5 sm:text-center',
    portrait: 'size-14 text-2xl sm:size-21 sm:text-4xl',
    name: 'sm:mt-1.5',
    hiddenLabel: 'sm:hidden',
    links: 'sm:mt-2',
    noLinks: 'hidden sm:flex',
  },
  badge: {
    stripe: 'hidden',
    band: 'grid',
    body: 'justify-items-center gap-1.5 px-5 pt-5 pb-4 text-center',
    portrait: 'size-21 text-4xl',
    name: 'mt-1.5',
    hiddenLabel: 'hidden',
    links: 'mt-2',
    noLinks: 'flex',
  },
} as const satisfies Record<string, Record<string, string>>;

type CrewBadgeProps = {
  face: BadgeFace;
  layout: keyof typeof LAYOUTS;
  children?: ReactNode;
};

export function CrewBadge({ face, layout, children }: CrewBadgeProps) {
  const look = LAYOUTS[layout];
  const shown = face.isPublic;
  const profiles = (
    [
      ['github', face.githubUrl],
      ['linkedin', face.linkedinUrl],
    ] as const
  ).flatMap(([site, url]) => (url ? [{ site, url }] : []));

  return (
    <div className="relative overflow-hidden rounded-card bg-card shadow-(--shadow-cutout)">
      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${shown ? 'bg-pink' : 'bg-slate'} ${look.stripe}`} />
      {/* Equal-width ends keep the slot in the exact middle, under the lanyard, whatever the words either side. */}
      <div
        aria-hidden="true"
        className={`h-11 grid-cols-[1fr_auto_1fr] items-center px-4 font-display text-xs font-bold tracking-widest uppercase ${
          shown ? 'bg-pink text-ink' : 'bg-slate text-text-2'
        } ${look.band}`}
      >
        <span>{shown ? 'Crew' : 'Hidden'}</span>
        <span className="h-2.5 w-11 rounded-full bg-deep" />
        <span className="justify-self-end">{shown ? 'LCS' : <EyeOff className="size-4" />}</span>
      </div>

      <div className={`grid ${look.body}`}>
        <Portrait face={face} size={look.portrait} />
        <div className={`min-w-0 ${look.name}`}>
          <h3 className={`truncate font-display text-xl font-bold ${shown ? 'text-white' : 'text-text-2'}`}>{face.name}</h3>
          <p className="truncate text-sm text-text-2">{face.role ?? 'No role yet'}</p>
          {!shown && (
            <p
              className={`mt-1 inline-flex items-center gap-1 rounded-tag bg-deep px-1.5 py-0.5 font-display text-xs font-bold tracking-widest text-text-2 uppercase ${look.hiddenLabel}`}
            >
              <EyeOff aria-hidden="true" className="size-3" />
              Hidden
            </p>
          )}
        </div>
        <div className={`flex gap-2 ${look.links}`}>
          {profiles.map(({ site, url }) => (
            <a
              key={site}
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${face.name} on ${SITE_NAMES[site]}`}
              className="grid size-11 place-items-center rounded-xl border border-line bg-slate text-text-2 transition-colors duration-150 hover:border-sky hover:text-sky"
            >
              <ProfileIcon site={site} />
            </a>
          ))}
          {profiles.length === 0 && <p className={`h-11 items-center text-xs text-text-2 ${look.noLinks}`}>No links added</p>}
        </div>
      </div>

      {children}
    </div>
  );
}

/** Their photo, or the first letter of their name on their own accent colour when they have none. */
function Portrait({ face, size }: { face: BadgeFace; size: string }) {
  const frame = `shrink-0 rounded-full border-3 border-paper ${size} ${face.isPublic ? '' : 'opacity-50'}`;
  if (face.pictureUrl) {
    return <img src={face.pictureUrl} alt="" loading="lazy" className={`${frame} object-cover`} />;
  }
  return (
    <div aria-hidden="true" className={`${frame} grid place-items-center font-display font-extrabold ${ACCENT_FILLS[accentFor(face.name)]}`}>
      {face.name.charAt(0).toUpperCase()}
    </div>
  );
}
