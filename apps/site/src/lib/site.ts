/**
 * Where the site's links go: the sections of the home page and the club's accounts elsewhere. The header and the
 * phone menu both read these lists, so adding a page or an account is one entry here.
 */

/** A section of the home page, linked from the header. */
export type PageLink = Readonly<{ label: string; href: `#${string}` }>;

export const PAGE_LINKS: readonly PageLink[] = [
  { label: 'Events', href: '#events' },
  { label: 'What we host', href: '#what-we-host' },
  { label: 'Resources', href: '#resources' },
  { label: 'Team', href: '#team' },
];

/** The accounts we link to. Each one has an icon of the same name in `components/ui/social-icons.ts`. */
export const SOCIAL_NAMES = ['instagram', 'discord', 'linkedin', 'github', 'youtube'] as const;
export type SocialName = (typeof SOCIAL_NAMES)[number];

/** One of the club's accounts: what it is called, and what a screen reader says for its icon-only link. */
export type SocialLink = Readonly<{ name: SocialName; label: string; description: string; href: string }>;

export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    name: 'instagram',
    label: 'Instagram',
    description: 'LCS on Instagram',
    href: 'https://www.instagram.com/laurier.cs/',
  },
  {
    name: 'discord',
    label: 'Discord',
    description: 'Join the LCS Discord',
    href: 'https://discord.gg/lauriercs',
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    description: 'LCS on LinkedIn',
    href: 'https://www.linkedin.com/company/lauriercs',
  },
  {
    name: 'github',
    label: 'GitHub',
    description: 'LCS on GitHub',
    href: 'https://github.com/LaurierCS',
  },
  {
    name: 'youtube',
    label: 'YouTube',
    description: 'LCS on YouTube',
    href: 'https://www.youtube.com/@LaurierComputingSociety',
  },
];
