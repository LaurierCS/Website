/**
 * The words in the footer at the bottom of every page. The engineering team's name links to the club's GitHub,
 * where the site's code lives.
 */
import { socialLink } from '../lib/site';

export const FOOTER = {
  /** "Made with ♥ by" and the team, the heart drawn between them. */
  madeWith: 'Made with',
  madeBy: 'by the',
  team: { label: 'LCS Engineering Team', href: socialLink('github').href },
  /** The copyright line, with the year the site was built. */
  copyright: (year: string) => `© ${year} Laurier Computing Society. All rights reserved.`,
} as const;
