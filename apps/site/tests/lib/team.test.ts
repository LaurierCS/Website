import { describe, expect, it } from 'vitest';
import {
  creditGroups,
  crews,
  initials,
  mainLink,
  seniority,
  toTeamMember,
  type TeamMember,
} from '../../src/lib/team';

const ID = '7d2c1f8e-4b6a-4c3e-9f1d-2a5b8c7e6d40';
const row = (fields: Record<string, unknown> = {}) => ({
  id: ID,
  name: 'Sam Lee',
  role: 'Software Engineer',
  department: 'Engineering',
  picture_url: 'https://example.supabase.co/storage/v1/object/public/team-images/sam.jpg',
  linkedin_url: null,
  github_url: 'https://github.com/samlee',
  ...fields,
});

const member = (name: string, department: string | null): TeamMember => ({
  id: name,
  name,
  role: null,
  department,
  pictureUrl: null,
  linkedinUrl: null,
  githubUrl: null,
});

describe('toTeamMember', () => {
  it('reads a team table row', () => {
    expect(toTeamMember(row())).toEqual({
      id: ID,
      name: 'Sam Lee',
      role: 'Software Engineer',
      department: 'Engineering',
      pictureUrl: 'https://example.supabase.co/storage/v1/object/public/team-images/sam.jpg',
      linkedinUrl: null,
      githubUrl: 'https://github.com/samlee',
    });
  });

  it('drops a broken link and blank text, but keeps the person', () => {
    expect(toTeamMember(row({ linkedin_url: 'not a link', role: '  ' }))).toMatchObject({
      linkedinUrl: null,
      role: null,
    });
  });

  it.each([
    ['no name', { name: '' }],
    ['a bad id', { id: 'nope' }],
  ])('is null for a row with %s', (_case, fields) => {
    expect(toTeamMember(row(fields))).toBeNull();
  });
});

describe('crews', () => {
  it('puts the known departments first in credit order, then other spellings, then people with none', () => {
    const team = [
      member('Ana', 'Engineering'),
      member('Bo', null),
      member('Cy', 'Admin'),
      member('Di', 'Hackathon'),
      member('Ed', 'Engineering'),
    ];
    expect(crews(team).map((crew) => [crew.department, crew.members.map((person) => person.name)])).toEqual([
      ['Admin', ['Cy']],
      ['Engineering', ['Ana', 'Ed']],
      ['Hackathon', ['Di']],
      [null, ['Bo']],
    ]);
  });
});

describe('seniority', () => {
  it.each([
    ['Co-President', 0],
    ['EVP External', 1],
    ['VP of Engineering', 2],
    ['Director of Marketing', 3],
    ['Software Engineer', 4],
    [null, 4],
  ])('ranks %s as %i', (role, rank) => {
    expect(seniority(role)).toBe(rank);
  });
});

describe('crews, within a department', () => {
  it('puts the most senior first, keeping name order among equals', () => {
    const withRole = (name: string, role: string): TeamMember => ({ ...member(name, 'Events'), role });
    const team = [
      withRole('Ana', 'Director of Events'),
      withRole('Bo', 'VP of Events'),
      withRole('Cy', 'Coordinator'),
      withRole('Di', 'Director of Events'),
      withRole('Ed', 'VP of Events'),
    ];
    expect(crews(team)[0]?.members.map((person) => person.name)).toEqual(['Bo', 'Ed', 'Ana', 'Di', 'Cy']);
  });
});

describe('creditGroups', () => {
  const sizes = (people: number) => {
    const team = Array.from({ length: people }, (_, at) => member(`P${at}`, 'Outreach'));
    return creditGroups(crews(team), 5).map((group) => group.members.length);
  };

  it.each([
    [1, [1]],
    [2, [2]],
    [3, [3]],
    [5, [5]],
    [6, [3, 3]],
    [7, [4, 3]],
    [10, [5, 5]],
    [11, [4, 4, 3]],
    [16, [4, 4, 4, 4]],
  ])('shares %i people out as evenly as it can, at most five a group: %j', (people, expected) => {
    expect(sizes(people)).toEqual(expected);
  });

  it('keeps every group of three or more people between three and five', () => {
    for (let people = 3; people <= 40; people++) {
      for (const size of sizes(people)) {
        expect(size).toBeGreaterThanOrEqual(3);
        expect(size).toBeLessThanOrEqual(5);
      }
    }
  });

  it('keeps departments in credit order and where each group starts in its department', () => {
    const team = [
      ...['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((name) => member(name, 'Outreach')),
      member('H', 'Events'),
    ];
    const groups = creditGroups(crews(team), 5);
    expect(groups.map(({ crew, start, members }) => [crew, start, members.length])).toEqual([
      [0, 0, 1],
      [1, 0, 4],
      [1, 4, 3],
    ]);
  });
});

describe('mainLink', () => {
  const linkedin = 'https://www.linkedin.com/in/sam/';
  const github = 'https://github.com/sam';
  it.each([
    [
      'LinkedIn when there is one',
      { linkedinUrl: linkedin, githubUrl: github },
      { href: linkedin, site: 'LinkedIn' },
    ],
    [
      'GitHub when there is no LinkedIn',
      { linkedinUrl: null, githubUrl: github },
      { href: github, site: 'GitHub' },
    ],
    ['nothing when there is neither', { linkedinUrl: null, githubUrl: null }, null],
  ])('is %s', (_case, links, expected) => {
    expect(mainLink({ ...member('Sam', 'Admin'), ...links })).toEqual(expected);
  });
});

describe('initials', () => {
  it.each([
    ['Sam Lee', 'SL'],
    ['Jacob Freij Camacho', 'JC'],
    ['Cher', 'C'],
  ])('writes %s as %s', (name, written) => {
    expect(initials(name)).toBe(written);
  });
});
