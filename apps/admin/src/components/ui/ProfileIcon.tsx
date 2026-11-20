/**
 * A GitHub or LinkedIn mark for a link to someone's profile, drawn in the current text colour. Decorative: the
 * link it sits in is named. GitHub's mark comes from Simple Icons; LinkedIn asked Simple Icons to remove theirs,
 * so it is drawn here as a plain "in" in a rounded square.
 */
import { siGithub } from 'simple-icons';

export type ProfileSite = 'github' | 'linkedin';

export function ProfileIcon({ site }: { site: ProfileSite }) {
  if (site === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 shrink-0 fill-current">
        <path d={siGithub.path} />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 shrink-0 fill-none stroke-current"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 11v6M8 7.5v.01M12 17v-6m0 3a3 3 0 0 1 6 0v3" />
    </svg>
  );
}
