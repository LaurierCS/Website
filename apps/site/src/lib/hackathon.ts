/** Winners and the project list from the March 2026 recap. Not a database table. */

export const HACKATHON = {
  title: 'Hack to the Future',
  dates: 'March 27–29, 2026',
  devpost: 'https://hack-to-the-future-wlu.devpost.com/',
  gallery: 'https://hack-to-the-future-wlu.devpost.com/project-gallery',
  stats: [
    { value: '48h', label: 'of building' },
    { value: '42', label: 'projects presented' },
    { value: '$700', label: 'prize pool' },
    { value: '6', label: 'prizes awarded' },
  ],
} as const;

export const PODIUM = [
  {
    place: '2nd',
    rank: '2ND PLACE',
    name: 'HavenNow',
    amount: '$150 CAD',
    blurb: 'Strong technical execution and clear user value.',
    url: 'https://hack-to-the-future-wlu.devpost.com/submissions/983144-havennow',
    className: 'p2',
  },
  {
    place: '1st',
    rank: '1ST PLACE',
    name: 'Archie',
    amount: '$300 CAD',
    blurb: 'Best overall project for execution, creativity and impact.',
    url: 'https://hack-to-the-future-wlu.devpost.com/submissions/981753-archie',
    className: 'p1',
  },
  {
    place: '3rd',
    rank: '3RD PLACE',
    name: 'Deep Drive',
    amount: '$100 CAD',
    blurb: 'Solid implementation and a thoughtful approach.',
    url: 'https://hack-to-the-future-wlu.devpost.com/submissions/983163-deepdrive',
    className: 'p3',
  },
] as const;

export const CATEGORY_AWARDS = [
  {
    cat: 'BEST DESIGN / UI',
    name: 'Pitch Ready',
    blurb: 'Most polished and user-friendly interface.',
    url: 'https://hack-to-the-future-wlu.devpost.com/submissions/981100-pitchready',
  },
  {
    cat: 'BEST CREATIVE PRESENTATION',
    name: 'Any%',
    blurb: 'Most engaging pitch and demo storytelling.',
    url: 'https://hack-to-the-future-wlu.devpost.com/submissions/981319-any',
  },
  {
    cat: 'MOST LIKELY TO BECOME A STARTUP',
    name: 'Astro',
    blurb: 'Strongest business potential and scalability.',
    url: 'https://hack-to-the-future-wlu.devpost.com/submissions/981721-astro',
  },
] as const;

const LH1011 = [
  'Budget Hawk', 'QuantPilot', 'KW-Network', 'Studently', 'StudHub', 'StudyBuddy', 'StudySync',
  'CityAnalysis', 'campusmind', 'HabitMaster Pro', 'HavenNow', 'Maple Rader', 'SafeRoute',
  'DeadVault', 'DeepDrive', 'ShowUp.ai', 'Genetiq', 'NexusPoint', 'Recall', 'rezapp', 'TermLease',
];

const N2085 = [
  'milo', 'MitraApp', 'PitchReady', 'ClimatePro', 'Any%', 'UniVerse', 'FinIt', 'UniWallet',
  'FocusFlow', 'GoldenTalks', 'HomeRoom', 'OpenDoors', 'Openspot', 'Optima', 'Archie',
  'FinCopilot', 'DriveWise Pro', 'Fridge Foodie', 'FridgeChef', 'Astro', 'FillthatCrib',
];

const WINNERS = new Set(['Archie', 'HavenNow', 'DeepDrive', 'PitchReady', 'Any%', 'Astro']);

export const PROJECTS = [...LH1011, ...N2085]
  .sort((a, b) => a.localeCompare(b))
  .map((name) => ({ name, winner: WINNERS.has(name) }));
