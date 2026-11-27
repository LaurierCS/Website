/**
 * The words on the home page's Meet the Professionals spotlight, and its speakers. Marketing changes these, so
 * they live here rather than in the markup. The speakers come from the speakers sheet (`speakers.csv`), with
 * their photos in `assets/speakers/`.
 */
import { SPEAKER_IMAGES } from '../assets/speakers';
import { readSpeakers } from '../lib/speakers';
import speakersSheet from './speakers.csv?raw';

export const MTP = {
  label: 'Our flagship event',
  title: 'Meet the Professionals',
  summary:
    'People who work in tech come in, tell students what the job is really like, answer every question, and stay to talk after.',
  /** The edition the speakers are from, as the print's caption and the speaker count say it. */
  edition: 'Fall 2026',
  room: 'LH3094',
  pitch: {
    /** The heading, a line each, so it never breaks somewhere awkward on a phone. */
    title: ['Work in tech?', 'Speak at the next one.'],
    text: 'Twenty minutes about your job and a Q&A with students who want to do it. We handle the room, the snacks and the posters.',
    action: { label: 'Apply to speak', href: 'https://forms.gle/BpvTx7gEzU4M7vwT7' },
  },
} as const;

export const SPEAKERS = readSpeakers(speakersSheet, SPEAKER_IMAGES);
