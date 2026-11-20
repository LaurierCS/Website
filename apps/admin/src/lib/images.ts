/**
 * Which pictures the admin accepts, checked once when a file is chosen. Only a `CheckedImage` can be uploaded,
 * so an unchecked file can't reach storage by mistake.
 */

// SVG is left out on purpose: it can carry script, which a public bucket would then serve.
const EXTENSIONS: ReadonlyMap<string, string> = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

const TYPE_NAMES = 'JPG, PNG, WebP or GIF';
const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;

/** For a file input's `accept`, so the picker offers only these types. */
export const ACCEPTED_IMAGE_TYPES = [...EXTENSIONS.keys()].join(',');

/** The rules in words, for a hint under a picture field. */
export const IMAGE_RULES = `${TYPE_NAMES}, up to ${MAX_MB} MB.`;

export type CheckedImage = Readonly<{ file: File; extension: string }>;

export type ImageCheck = { kind: 'accepted'; image: CheckedImage } | { kind: 'rejected'; reason: string };

/** Whether a chosen file can be used as a picture, with the reason in plain words when it can't. */
export function checkImage(file: File): ImageCheck {
  const extension = EXTENSIONS.get(file.type);
  if (!extension) {
    return { kind: 'rejected', reason: `That file isn't a picture we can use. Choose a ${TYPE_NAMES}.` };
  }
  if (file.size > MAX_BYTES) {
    const sizeMb = (file.size / 1024 / 1024).toFixed(1);
    return { kind: 'rejected', reason: `That picture is ${sizeMb} MB. Pictures can be up to ${MAX_MB} MB.` };
  }
  return { kind: 'accepted', image: { file, extension } };
}

/** What saving does to a picture: leave it, put a new one in its place, or take it off. */
export type PictureChange = { kind: 'keep' } | { kind: 'replace'; image: CheckedImage } | { kind: 'remove' };
