import { readCsv, toCsv } from '../../src/lib/csv';

const UTF8_MARK = '\uFEFF';

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

describe('reading a CSV file', () => {
  it('reads back exactly what was written, formulas, accents and line breaks included', () => {
    const rows = [
      ['=HYPERLINK("http://example.com")', 'Zoë Martín'],
      ['-2', 'Bring a "laptop"\nand snacks, please'],
    ];

    expect(readCsv(toCsv(['title', 'description'], rows))).toEqual({
      status: 'read',
      header: ['title', 'description'],
      rows: [
        { number: 2, cells: rows[0] },
        { number: 3, cells: rows[1] },
      ],
    });
  });

  it('numbers rows the way a spreadsheet does, skipping blank rows without renumbering', () => {
    const text = 'id,title\r\n,Hack Night\r\n,,\r\n"","Multi\nline"\r\n,Social\r\n';

    const read = readCsv(text);

    expect(read).toEqual({
      status: 'read',
      header: ['id', 'title'],
      rows: [
        { number: 2, cells: ['', 'Hack Night'] },
        { number: 4, cells: ['', 'Multi\nline'] },
        { number: 5, cells: ['', 'Social'] },
      ],
    });
  });

  it('keeps an apostrophe someone typed in front of ordinary text', () => {
    const read = readCsv("title\r\n'90s Night\r\n");

    expect(read).toEqual({ status: 'read', header: ['title'], rows: [{ number: 2, cells: ["'90s Night"] }] });
  });

  it('trims spaces around column names, as spreadsheets sometimes add them', () => {
    expect(readCsv(' id , title \r\n1,Hack Night')).toMatchObject({ header: ['id', 'title'] });
  });

  it('says which row has a quote that never closes, instead of guessing', () => {
    expect(readCsv('id,title\r\n,Hack Night\r\n,"Social\r\n,Review\r\n')).toEqual({ status: 'unreadable', rowNumber: 3 });
  });

  it('reads an empty file as no columns and no rows', () => {
    expect(readCsv('')).toEqual({ status: 'read', header: [], rows: [] });
  });
});
