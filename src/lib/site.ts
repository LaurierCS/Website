/** Club facts the hero counts up to. Change them here, nowhere else. */
export const STATS = [
  { value: 20, suffix: '+', label: 'events a year', accent: 'pink', count: true },
  { value: 44, suffix: '+', label: 'exec members', accent: 'yellow', count: true },
  { value: 4000, suffix: '+', label: 'students', accent: 'light', count: true },
  { value: 2012, suffix: '', label: 'founded as PHI Society', accent: 'orange', count: false },
] as const;

export const ACCENTS = ['#FF9FC4', '#FF9770', '#FFD670', '#268AF9', '#B1E0FF'] as const;

export const SOCIALS = [
  { name: 'Instagram', url: 'https://www.instagram.com/laurier.cs/' },
  { name: 'Discord', url: 'https://discord.com/invite/lauriercs' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/lauriercs/posts/?feedView=all' },
  { name: 'GitHub', url: 'https://github.com/LaurierCS' },
  { name: 'YouTube', url: 'https://www.youtube.com/channel/UCx5kLv_MO-yhjIIqcCLEMFA' },
] as const;

export const NAV = [
  { href: '/#about', label: 'About' },
  { href: '/#events', label: 'Events' },
  { href: '/#host', label: 'What We Host' },
  { href: '/#videos', label: 'Videos' },
  { href: '/#team', label: 'Team' },
  { href: '/hack-to-the-future', label: 'Hackathon' },
] as const;

export const DISCORD_URL = 'https://discord.gg/lauriercs';
export const EMAIL = 'communications@lauriercs.org';
export const ROOM = 'Room N2085';
export const YOUTUBE_URL = SOCIALS.find((item) => item.name === 'YouTube')?.url ?? DISCORD_URL;
