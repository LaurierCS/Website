import { toCsv } from '../../src/lib/csv';

const UTF8_MARK = '﻿';

describe('writing a CSV file', () => {
  it('starts with the mark Excel needs for accents, then a header row', () => {
    const text = toCsv(['name', 'role'], [['Zoë Martín', 'President']]);

    expect(text.startsWith(UTF8_MARK)).toBe(true);
    expect(text.slice(1)).toBe('name,role\r\nZoë Martín,President');
  });

  it('quotes cells with commas, quotes or line breaks so they stay one cell', () => {
    const text = toCsv(['title', 'description'], [['Hack Night, round 2', 'Bring a "laptop"\nand snacks']]);

    expect(text.slice(1)).toBe('title,description\r\n"Hack Night, round 2","Bring a ""laptop""\nand snacks"');
  });

  it.each(['=HYPERLINK("http://example.com")', '+1', '-2', '@SUM(A1)'])(
    'escapes %s so a spreadsheet shows it as text instead of running it',
    (cell) => {
      const text = toCsv(['title'], [[cell]]);

      expect(text).not.toContain(`\r\n${cell}`);
      expect(text).toContain(`'${cell.replace(/"/g, '""')}`);
    },
  );

  it('writes empty cells as empty, and just the header when there are no rows', () => {
    expect(toCsv(['id', 'time'], [['abc', '']]).slice(1)).toBe('id,time\r\nabc,');
    // With no rows, Papa Parse ends the header line with a line break; the file is still just the header.
    expect(toCsv(['id', 'time'], []).slice(1).trimEnd()).toBe('id,time');
  });
});
