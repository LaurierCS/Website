/**
 * A text as it will be after a change, with what changed marked word by word: words that stay are quiet, words
 * taken out are struck through, words put in are highlighted.
 */
import { diffText } from '../../lib/text-diff';

export function TextDiff({ before, after }: { before: string; after: string }) {
  return diffText(before, after).map((part, index) => {
    switch (part.kind) {
      case 'same':
        return <span key={index}>{part.text}</span>;
      case 'removed':
        return (
          <del key={index} className="text-muted">
            {part.text}
          </del>
        );
      case 'added':
        return (
          <ins key={index} className="rounded-sm bg-yellow px-1 font-bold text-ink no-underline">
            {part.text}
          </ins>
        );
    }
  });
}
