import { csvFile, EVENTS_CSV, TEAM_CSV } from '../../src/lib/csv-formats';
import type { TeamMember } from '../../src/types/team';

import { sampleEvent } from '../fixtures/events';

const HACK_NIGHT = sampleEvent({
  id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f',
  title: 'Hack Night',
  date: '2026-11-20',
  pictureUrl: 'https://lcs.supabase.co/storage/v1/object/public/event-media/hack.png',
});

const SAM: TeamMember = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  role: 'VP Engineering',
  department: 'Engineering',
  isPublic: false,
  photoPath: null,
  pictureUrl: null,
  githubUrl: 'https://github.com/samrivera',
  linkedinUrl: null,
};

/** A row's cells as the lookup `fromRow` reads them. */
function cellsOf<Column extends string>(row: Readonly<Record<Column, string>>): (column: Column) => string {
  return (column) => row[column];
}

/** The file's lines, without the UTF-8 mark at the start. */
function lines(text: string): string[] {
  return text.slice(1).split('\r\n');
}

describe('CSV files for each table', () => {
  it('names the file for the table and the day', () => {
    expect(csvFile(EVENTS_CSV, [HACK_NIGHT], '2026-11-22').name).toBe('lcs-events-2026-11-22.csv');
    expect(csvFile(TEAM_CSV, [SAM], '2026-11-22').name).toBe('lcs-team-2026-11-22.csv');
  });

  it('writes events with the database column names, empty for no value, and no picture', () => {
    expect(lines(csvFile(EVENTS_CSV, [HACK_NIGHT], '2026-11-22').text)).toEqual([
      'id,title,date,time,location,description',
      '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f,Hack Night,2026-11-20,,,',
    ]);
  });

  it('writes the team with hidden members included and is_public as true or false', () => {
    expect(lines(csvFile(TEAM_CSV, [SAM], '2026-11-22').text)).toEqual([
      'id,name,role,department,is_public,github_url,linkedin_url',
      '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f,Sam Rivera,VP Engineering,Engineering,false,https://github.com/samrivera,',
    ]);
  });
});

describe('reading an event row back', () => {
  const row = { ...EVENTS_CSV.toRow(HACK_NIGHT), id: '' };

  it('gives the fields to save, trimmed, with empty cells as no value', () => {
    const result = EVENTS_CSV.fromRow(cellsOf({ ...row, title: '  Hack Night  ', time: '7:30 pm', location: 'BA201' }), null);

    expect(result).toEqual({
      ok: true,
      fields: expect.objectContaining({
        title: 'Hack Night',
        date: '2026-11-20',
        startTime: '19:30:00',
        location: 'BA201',
        description: null,
      }),
    });
  });

  it('refuses what the event form refuses, in words for a spreadsheet', () => {
    const result = EVENTS_CSV.fromRow(cellsOf({ ...row, title: ' ', date: '11/20/2026', time: 'evening' }), null);

    expect(result).toEqual({
      ok: false,
      problems: ['Give the event a title.', 'Write the date as year-month-day, like 2026-11-20.', 'Write the time like 7:30PM, or leave it empty.'],
    });
  });

  it('keeps a saved start and end time while the time cell is unchanged', () => {
    const saved = { ...HACK_NIGHT, startTime: '17:30:00', endTime: '19:00:00' };

    expect(EVENTS_CSV.fromRow(cellsOf({ ...EVENTS_CSV.toRow(saved), title: 'Hack Night 2' }), saved)).toMatchObject({
      ok: true,
      fields: { title: 'Hack Night 2', startTime: '17:30:00', endTime: '19:00:00' },
    });
    expect(EVENTS_CSV.fromRow(cellsOf({ ...row, time: 'TBD' }), null)).toEqual({ ok: false, problems: ['Write the time like 7:30PM, or leave it empty.'] });
  });
});

describe('reading a team row back', () => {
  const row = { ...TEAM_CSV.toRow(SAM), id: '' };

  it('gives the fields to save, reading TRUE and FALSE the way Excel writes them', () => {
    expect(TEAM_CSV.fromRow(cellsOf({ ...row, is_public: 'TRUE', role: ' ' }), null)).toEqual({
      ok: true,
      fields: {
        name: 'Sam Rivera',
        role: null,
        department: 'Engineering',
        githubUrl: 'https://github.com/samrivera',
        linkedinUrl: null,
        isPublic: true,
      },
    });
  });

  it('refuses what the team form refuses, listing the departments it accepts', () => {
    const result = TEAM_CSV.fromRow(cellsOf({ ...row, name: '', department: 'Engineers', github_url: 'github.com/sam', is_public: 'yes' }), null);

    expect(result).toEqual({
      ok: false,
      problems: [
        'Give their name.',
        'Use one of the departments: Admin, Finance, Marketing, Outreach, Events, Academics, Engineering.',
        "That isn't a GitHub link. Paste the whole address, like https://github.com/their-name.",
        'Write is_public as true or false.',
      ],
    });
  });
});
