/**
 * The words and links on the home page's "Missed it? It's all here." and what the clubroom laptop shows on each
 * of its tabs. Marketing and the execs change these, so they live here rather than in the markup.
 *
 * The recording and the starter code are real (the channel's newest upload, with its thumbnail, and the Build a
 * Portfolio repo). The practice question is a placeholder until the review team has one to share.
 */
import type { ImageMetadata } from 'astro';
import cp312Midterm2Review from '../assets/recordings/cp312-midterm-2-review.jpg';
import type { IsoDate } from '../lib/dates';

/** The kinds of thing the laptop shows, in the order its tabs go. */
export const RESOURCE_KINDS = ['recording', 'practice', 'starter'] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];

/** A recording on the club's YouTube channel, with its thumbnail (kept in `assets/recordings/`). */
export type Recording = Readonly<{ title: string; videoId: string; published: IsoDate; thumbnail: ImageMetadata }>;

/** A practice question with its worked solution, from a review session. */
export type PracticeQuestion = Readonly<{
  course: string;
  title: string;
  question: string;
  code: string;
  solution: string;
  href: string;
}>;

/** A starter project on the club's GitHub. `fillIn` is the file you make your own, and the note stuck on it. */
export type StarterRepo = Readonly<{
  owner: string;
  name: string;
  description: string;
  language: string;
  files: readonly string[];
  fillIn: Readonly<{ file: string; note: string }>;
  href: string;
  exampleHref: string;
}>;

export const RESOURCES = {
  label: 'Resources',
  title: "Missed it? It's all here.",
  summary:
    'Recordings of every review, the practice questions with solutions, and starter code like a free portfolio site you can make your own.',
  /** Where each kind lives in full, and the line that names it beside the laptop. */
  kinds: {
    recording: {
      tab: 'Recording',
      label: 'Review and talk recordings',
      href: 'https://www.youtube.com/@LaurierComputingSociety/videos',
    },
    practice: {
      tab: 'Practice',
      label: 'Practice questions and solutions',
      href: 'https://github.com/LaurierCS/ReviewSessions',
    },
    starter: { tab: 'GitHub', label: 'Starter code on GitHub', href: 'https://github.com/LaurierCS' },
  },
  recording: {
    title: 'CP312 Midterm 2 Review',
    videoId: 'nEOWZuVW7ag',
    published: '2026-11-19',
    thumbnail: cp312Midterm2Review,
  },
  practice: {
    course: 'CP312',
    title: 'CP312 review: practice questions',
    question: 'Q3. How long does merge sort take on n items, and why?',
    code: 'mergeSort(a):\n  split a in half\n  mergeSort(left); mergeSort(right)\n  merge(left, right)',
    solution:
      'O(n log n). Halving gives log n levels, and merging all the halves on one level touches each item once.',
    href: 'https://github.com/LaurierCS/ReviewSessions',
  },
  starter: {
    owner: 'LaurierCS',
    name: 'Build-a-portfolio',
    description: 'A portfolio site for students. Fill in one file with your details, and publish it for free.',
    language: 'TypeScript',
    files: ['src/data.ts', 'index.html', 'README.md'],
    fillIn: { file: 'src/data.ts', note: 'Your details go here' },
    href: 'https://github.com/LaurierCS/Build-a-portfolio',
    exampleHref: 'https://built-portfolio-422g.vercel.app/',
  },
} as const satisfies {
  label: string;
  title: string;
  summary: string;
  kinds: Readonly<Record<ResourceKind, Readonly<{ tab: string; label: string; href: string }>>>;
  recording: Recording;
  practice: PracticeQuestion;
  starter: StarterRepo;
};
