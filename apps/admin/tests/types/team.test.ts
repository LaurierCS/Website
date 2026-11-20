import { groupByDepartment, type TeamMember } from '../../src/types/team';

function member(name: string, department: string | null): TeamMember {
  return {
    id: crypto.randomUUID(),
    name,
    role: null,
    department,
    isPublic: true,
    pictureUrl: null,
    githubUrl: null,
    linkedinUrl: null,
  };
}

describe('groupByDepartment', () => {
  it('lists the known departments in their usual order, keeping each group in the order given', () => {
    const groups = groupByDepartment([
      member('Ana', 'Marketing'),
      member('Ben', 'Academics'),
      member('Cy', 'Marketing'),
      member('Di', 'Engineering'),
    ]);

    expect(groups.map((group) => [group.department, group.members.map((m) => m.name)])).toEqual([
      ['Marketing', ['Ana', 'Cy']],
      ['Academics', ['Ben']],
      ['Engineering', ['Di']],
    ]);
  });

  it('keeps other spellings as their own groups after the known ones, then members with no department', () => {
    const groups = groupByDepartment([
      member('Ana', null),
      member('Ben', 'Sponsorship'),
      member('Cy', 'Events'),
      member('Di', '  '),
      member('Ed', 'Design'),
    ]);

    expect(groups.map((group) => [group.department, group.members.map((m) => m.name)])).toEqual([
      ['Events', ['Cy']],
      ['Design', ['Ed']],
      ['Sponsorship', ['Ben']],
      [null, ['Ana', 'Di']],
    ]);
  });

  it('has no groups when there is nobody', () => {
    expect(groupByDepartment([])).toEqual([]);
  });
});
