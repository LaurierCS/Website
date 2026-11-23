/**
 * The icon for each of the club's accounts, and the colour it turns when you point at it. The icons draw in
 * `currentColor`, so the link around them sets the colour.
 */
import discord from '../../assets/icons/discord.svg';
import github from '../../assets/icons/github.svg';
import instagram from '../../assets/icons/instagram.svg';
import linkedin from '../../assets/icons/linkedin.svg';
import youtube from '../../assets/icons/youtube.svg';
import type { SocialName } from '../../lib/site';

export const SOCIAL_ICONS = { instagram, discord, linkedin, github, youtube } as const satisfies Record<
  SocialName,
  unknown
>;

/** Each network's own colour on hover and keyboard focus. GitHub stays white: its brand colour is near-black. */
export const SOCIAL_HOVER_TEXT: Readonly<Record<SocialName, string>> = {
  instagram: 'hover:text-instagram focus-visible:text-instagram',
  discord: 'hover:text-discord focus-visible:text-discord',
  linkedin: 'hover:text-linkedin focus-visible:text-linkedin',
  github: 'hover:text-white focus-visible:text-white',
  youtube: 'hover:text-youtube focus-visible:text-youtube',
};
