/**
 * The words and numbers on the home page's hero. Marketing changes these often, so they live here rather than in
 * the markup. The next event is written in by hand until the events table feeds the page.
 */

/** One of the hero's numbers: what it counts up to, what follows it ("+"), and the accent it is printed in. */
export type HeroStat = Readonly<{
  count: number;
  suffix: string;
  label: string;
  accent: 'pink' | 'orange' | 'yellow';
}>;

/** The mascots who take turns posting in the about window's group chat, crowded around the clubhouse laptop. */
export const TYPISTS = [
  { id: 'doug', name: 'Doug' },
  { id: 'coco', name: 'Coco' },
  { id: 'krill', name: 'Krill' },
] as const;
export type Typist = (typeof TYPISTS)[number]['id'];

/** One message in the about window's group chat: what it says, and who posts it. Up to about 90 characters. */
export type AboutLine = Readonly<{ by: Typist; text: string }>;

/** The event the hero's "Next up" card points to. */
export type NextEvent = Readonly<{
  title: string;
  month: string;
  day: string;
  /** Weekday, time and room, as people read them on a poster. */
  details: string;
  href: string;
}>;

export const HERO = {
  label: 'Welcome to',
  /** The club's name, one line of scrapbook letters per word. */
  nameLines: ['Laurier', 'Computing', 'Society'],
  about: {
    /**
     * The whole description in one go: what screen readers and search engines get, since the chat keeps changing.
     */
    summary:
      "The Laurier Computing Society (LCS) is Wilfrid Laurier University's official computer science club, the Laurier CS club for WLU students. We support students through academic help, career-building events, hackathons, and a strong tech-focused community.",
    /** The chat's messages, posted one at a time in this order, and which mascot posts each. */
    lines: [
      { by: 'doug', text: "Wilfrid Laurier's official computer science club, run by students." },
      { by: 'coco', text: 'Midterm reviews for some of the toughest CS courses.' },
      { by: 'krill', text: 'Meet the Professionals: people from tech come in and answer your questions.' },
      { by: 'doug', text: 'Hackathons and workshops where you build something real.' },
      { by: 'coco', text: 'Missed a review? The recording is up on YouTube.' },
      { by: 'krill', text: 'A Discord full of students who code together, all year.' },
    ],
  },
  stats: [
    { count: 20, suffix: '+', label: 'Events a year', accent: 'pink' },
    { count: 44, suffix: '+', label: 'Execs', accent: 'orange' },
    { count: 4000, suffix: '+', label: 'Students reached', accent: 'yellow' },
  ],
  actions: {
    primary: { label: "See what's on", href: '#events' },
    secondary: { label: 'Meet the team', href: '#team' },
  },
  nextEvent: {
    title: 'Meet the Professionals',
    month: 'Nov',
    day: '12',
    details: 'Thu 7:00PM · N1001',
    href: '#events',
  },
} as const satisfies {
  label: string;
  nameLines: readonly string[];
  about: Readonly<{ summary: string; lines: readonly AboutLine[] }>;
  stats: readonly HeroStat[];
  actions: Readonly<Record<'primary' | 'secondary', Readonly<{ label: string; href: string }>>>;
  nextEvent: NextEvent;
};
