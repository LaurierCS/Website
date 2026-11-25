import { csvFile, EVENTS_CSV, TEAM_CSV } from '../../../src/lib/csv/csv-formats';
import { planImport, planImportFile, rowsToSave } from '../../../src/lib/csv/csv-import';
import type { TeamMember } from '../../../src/types/team';
import { sampleEvent } from '../../fixtures/events';

const HACK_NIGHT = sampleEvent({
  id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f',
  title: 'Hack Night',
  date: '2026-11-20',
  startTime: '19:30:00',
  location: 'BA201',
  pictureUrl: 'https://lcs.supabase.co/storage/v1/object/public/event-media/hack.png',
});

const SOCIAL = sampleEvent({
  id: '9d8c7b6a-5f4e-4d3c-8b2a-1f0e9d8c7b6a',
  title: 'Winter Social',
  date: '2026-12-04',
  description: 'Hot chocolate.',
});

const HEADER = 'id,title,date,time,location,description';

/** A file as an exec would save it: a header, then one line per row. */
function file(...lines: string[]): string {
  return [HEADER, ...lines].join('\r\n');
}

describe('planning an import', () => {
  it('treats an exported file read straight back as no changes', () => {
    const exported = csvFile(EVENTS_CSV, [HACK_NIGHT, SOCIAL], '2026-11-22').text;

    expect(planImport(EVENTS_CSV, exported, [HACK_NIGHT, SOCIAL])).toEqual({ status: 'ready', added: [], changed: [], unchanged: 2 });
  });

  it('adds rows with no id, and changes rows with a known id, showing each changed cell', () => {
    const text = file(
      `${HACK_NIGHT.id},Hack Night,2026-11-21,8PM,BA201,`,
      ',CP312 Review,2026-12-01,,N2085,Bring notes.',
      `${SOCIAL.id},Winter Social,2026-12-04,,,Hot chocolate.`,
    );

    const plan = planImport(EVENTS_CSV, text, [HACK_NIGHT, SOCIAL]);

    expect(plan).toEqual({
      status: 'ready',
      added: [
        {
          rowNumber: 3,
          fields: expect.objectContaining({ title: 'CP312 Review', date: '2026-12-01', location: 'N2085', description: 'Bring notes.' }),
        },
      ],
      changed: [
        {
          rowNumber: 2,
          before: HACK_NIGHT,
          after: { ...HACK_NIGHT, date: '2026-11-21', startTime: '20:00:00' },
          fields: expect.objectContaining({ title: 'Hack Night', date: '2026-11-21', startTime: '20:00:00', location: 'BA201' }),
          cells: [
            { column: 'date', before: '2026-11-20', after: '2026-11-21' },
            { column: 'time', before: '7:30PM', after: '8:00PM' },
          ],
        },
      ],
      unchanged: 1,
    });
  });

  it('leaves saved items that are missing from the file alone', () => {
    const plan = planImport(EVENTS_CSV, file(`${SOCIAL.id},Winter Social,2026-12-04,,,Hot chocolate.`), [HACK_NIGHT, SOCIAL]);

    expect(plan).toEqual({ status: 'ready', added: [], changed: [], unchanged: 1 });
  });

  it('reads columns in any order', () => {
    const text = ['title,id,date,time,location,description', 'Hack Night,,2026-11-20,,,'].join('\r\n');

    expect(planImport(EVENTS_CSV, text, [])).toMatchObject({ status: 'ready', added: [{ rowNumber: 2, fields: { title: 'Hack Night' } }] });
  });

  it('refuses an id nothing saved has, and the same id twice', () => {
    const text = file(
      '00000000-0000-0000-0000-000000000000,Gone,2026-11-20,,,',
      `${HACK_NIGHT.id},Hack Night,2026-11-20,7:30PM,BA201,`,
      `${HACK_NIGHT.id},Hack Night again,2026-11-20,7:30PM,BA201,`,
    );

    expect(planImport(EVENTS_CSV, text, [HACK_NIGHT])).toEqual({
      status: 'problems',
      problems: [
        { rowNumber: 2, message: 'Nothing saved has this id. Leave the id empty to add it as new.' },
        { rowNumber: 4, message: 'Row 3 has the same id. Each saved item can only be in the file once.' },
      ],
    });
  });

  it("lists every row's problems, and imports nothing while there are any", () => {
    const text = file(',,2026-11-20,,,', ',CP312 Review,2026-12-01,,,', ',Social,12/04/2026,soon,,');

    expect(planImport(EVENTS_CSV, text, [])).toEqual({
      status: 'problems',
      problems: [
        { rowNumber: 2, message: 'Give the event a title.' },
        { rowNumber: 4, message: 'Write the date as year-month-day, like 2026-11-20.' },
        { rowNumber: 4, message: 'Write the time like 7:30PM, or leave it empty.' },
      ],
    });
  });

  it('refuses a row with more cells than columns', () => {
    expect(planImport(EVENTS_CSV, file(',Hack Night,2026-11-20,,,,surprise'), [])).toEqual({
      status: 'problems',
      problems: [{ rowNumber: 2, message: 'This row has more cells than the file has columns.' }],
    });
  });

  it("checks the columns before any row, so the wrong table's file says so once", () => {
    const teamFile = csvFile(TEAM_CSV, [], '2026-11-22').text;

    expect(planImport(EVENTS_CSV, teamFile, [])).toEqual({
      status: 'problems',
      problems: [
        { rowNumber: null, message: 'The file is missing the columns: title, date, time, location, description. Start from an exported file.' },
        {
          rowNumber: null,
          message: "The file has columns the import doesn't use: name, role, department, is_public, github_url, linkedin_url. Remove them or start from an exported file.",
        },
      ],
    });
  });

  it('refuses a column that appears twice', () => {
    expect(planImport(EVENTS_CSV, `${HEADER},title\r\n,Hack Night,2026-11-20,,,,Again`, [])).toEqual({
      status: 'problems',
      problems: [{ rowNumber: null, message: 'The column title appears more than once.' }],
    });
  });

  it("says which row has a quote that doesn't close", () => {
    expect(planImport(EVENTS_CSV, file(',Hack Night,2026-11-20,,,', ',"Social,2026-12-04,,,'), [])).toEqual({
      status: 'problems',
      problems: [{ rowNumber: 3, message: 'A quote (") in this row is never closed, so the file can\'t be read.' }],
    });
  });

  it('plans a team import with the same rules as the team form', () => {
    const sam: TeamMember = {
      id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
      name: 'Sam Rivera',
      role: 'VP Engineering',
      department: 'Engineering',
      isPublic: false,
      photoPath: 'sam.jpg',
      pictureUrl: 'https://lcs.supabase.co/storage/v1/object/public/team-images/sam.jpg',
      githubUrl: null,
      linkedinUrl: null,
    };
    const text = [
      'id,name,role,department,is_public,github_url,linkedin_url',
      `${sam.id},Sam Rivera,VP Engineering,Engineering,TRUE,,`,
      ',Alex Chen,,Academics,FALSE,,',
    ].join('\r\n');

    expect(planImport(TEAM_CSV, text, [sam])).toMatchObject({
      status: 'ready',
      added: [{ rowNumber: 3, fields: { name: 'Alex Chen', department: 'Academics', isPublic: false } }],
      changed: [{ rowNumber: 2, after: { ...sam, isPublic: true }, cells: [{ column: 'is_public', before: 'false', after: 'true' }] }],
      unchanged: 0,
    });
  });
});

describe('planning an import from a chosen file', () => {
  it('reads the file and plans it', async () => {
    const chosen = new File([file(',CP312 Review,2026-12-01,,,')], 'events.csv', { type: 'text/csv' });

    expect(await planImportFile(EVENTS_CSV, chosen, [])).toMatchObject({ status: 'ready', added: [{ rowNumber: 2 }] });
  });

  it('refuses a file far too big to be a club list, without reading it', async () => {
    const huge = new File(['x'.repeat(1_000_001)], 'huge.csv', { type: 'text/csv' });

    expect(await planImportFile(EVENTS_CSV, huge, [])).toEqual({
      status: 'problems',
      problems: [{ rowNumber: null, message: 'This file is over 1 MB, which is far bigger than a club list. Check it is the right file.' }],
    });
  });
});

describe('the rows an import saves', () => {
  it('sends new rows as they are and changed rows with their id', () => {
    const plan = planImport(EVENTS_CSV, file(`${HACK_NIGHT.id},Hack Night,2026-11-21,7:30PM,BA201,`, ',CP312 Review,2026-12-01,,,'), [HACK_NIGHT]);
    if (plan.status !== 'ready') throw new Error('The file should have no problems.');

    expect(rowsToSave(plan)).toEqual({
      added: [expect.objectContaining({ title: 'CP312 Review', date: '2026-12-01' })],
      changed: [{ id: HACK_NIGHT.id, fields: expect.objectContaining({ title: 'Hack Night', date: '2026-11-21', startTime: '19:30:00', location: 'BA201' }) }],
    });
  });
});
