import { countOf, entriesOf, importSummary } from '../../../src/components/ui/import-view';
import type { ReadyImport } from '../../../src/lib/csv/csv-import';

const EVENTS = { one: 'event', many: 'events' };

/** A ready import with this many new and updated rows; only the counts and row numbers matter here. */
function plan(added: readonly number[], changed: readonly number[]): ReadyImport<{ id: string }, object> {
  return {
    status: 'ready',
    added: added.map((rowNumber) => ({ rowNumber, fields: {} })),
    changed: changed.map((rowNumber) => ({ rowNumber, before: { id: 'a' }, after: { id: 'a' }, fields: {}, cells: [] })),
    unchanged: 0,
  };
}

describe('what an import says about itself', () => {
  it('counts one and many', () => {
    expect(countOf(1, EVENTS)).toBe('1 event');
    expect(countOf(3, EVENTS)).toBe('3 events');
  });

  it('sums up what it adds and updates, leaving out a kind it has none of', () => {
    expect(importSummary(plan([2, 3], [4]), EVENTS)).toBe('2 new events and 1 updated event');
    expect(importSummary(plan([2], []), EVENTS)).toBe('1 new event');
    expect(importSummary(plan([], [2, 5]), EVENTS)).toBe('2 updated events');
  });

  it('lists new and updated items in the order of their rows in the file', () => {
    const entries = entriesOf(plan([4, 2], [3]));

    expect(entries.map((entry) => [entry.rowNumber, entry.kind])).toEqual([
      [2, 'new'],
      [3, 'updated'],
      [4, 'new'],
    ]);
  });
});
