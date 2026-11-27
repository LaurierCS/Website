/**
 * The stills shown to the left of the rolling team credits: photos from events and behind the scenes, the way a
 * film's end credits cut to shots from the set. Each group of names gets the next one, in turn. Only the
 * placeholder for now; a real photo is a file in `assets/` plus an entry here (later, event photos from the admin).
 */
import type { ImageMetadata } from 'astro';
import placeholder from '../assets/speakers/event-placeholder.png';

/**
 * One still: the picture, what's in it for screen readers (empty for the placeholder, which shows nothing), and
 * an optional line under it, like something someone said that night.
 */
export type CreditStill = Readonly<{ image: ImageMetadata; alt: string; caption?: string }>;

export const CREDIT_STILLS: readonly CreditStill[] = [{ image: placeholder, alt: '' }];
