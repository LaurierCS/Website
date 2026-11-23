/**
 * What changed between two versions of a text, word by word, so a one-word fix in a long description is easy to
 * spot. Uses jsdiff (the `diff` package) rather than a homemade diff.
 */
import { diffWords } from 'diff';

/** One run of text: the same in both versions, only in the new one, or only in the old one. */
export type TextPart = Readonly<{ kind: 'same' | 'added' | 'removed'; text: string }>;

/** Both versions as one run of parts in reading order, with removed words just before what replaced them. */
export function diffText(before: string, after: string): readonly TextPart[] {
  return diffWords(before, after).map((change) => ({
    kind: change.added ? 'added' : change.removed ? 'removed' : 'same',
    text: change.value,
  }));
}
