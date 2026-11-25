import { diffText } from '../../../src/lib/ui/text-diff';

describe('what changed in a text', () => {
  it('marks the words taken out and the words put in, and keeps the rest as it was', () => {
    const parts = diffText('Pizza after in the Hub.', 'Snacks and drinks after in the Hub.');

    expect(parts.filter((part) => part.kind === 'removed').map((part) => part.text.trim())).toEqual(['Pizza']);
    expect(parts.filter((part) => part.kind === 'added').map((part) => part.text.trim())).toEqual(['Snacks and drinks']);
    expect(parts.map((part) => (part.kind === 'removed' ? '' : part.text)).join('')).toBe('Snacks and drinks after in the Hub.');
  });

  it('is all one unchanged part when nothing changed', () => {
    expect(diffText('Bring a laptop.', 'Bring a laptop.')).toEqual([{ kind: 'same', text: 'Bring a laptop.' }]);
  });

  it('is all added when there was no text before', () => {
    expect(diffText('', 'Bring a laptop.')).toEqual([{ kind: 'added', text: 'Bring a laptop.' }]);
  });
});
