import { csvFile, EVENTS_CSV, TEAM_CSV } from '../../src/lib/csv-formats';
import type { Event } from '../../src/types/event';
import type { TeamMember } from '../../src/types/team';

const HACK_NIGHT: Event = {
  id: '1c7a0d3f-8b52-4e6c-9f4d-3a2b1c0d9e8f',
  title: 'Hack Night',
  description: null,
  date: '2026-11-20',
  time: null,
  location: null,
  pictureUrl: 'https://lcs.supabase.co/storage/v1/object/public/events-images/hack.png',
};

const SAM: TeamMember = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  role: 'VP Engineering',
  department: 'Engineering',
  isPublic: false,
  pictureUrl: null,
  githubUrl: 'https://github.com/samrivera',
  linkedinUrl: null,
};

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
