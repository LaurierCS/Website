import { DEPARTMENTS, groupByDepartment, type Department, type TeamMember } from '../../src/types/team';

function member(name: string, department: Department): TeamMember {
  return {
    id: crypto.randomUUID(),
    name,
    role: null,
    department,
    isPublic: true,
    photoPath: null,
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

  it('skips empty departments', () => {
    expect(groupByDepartment([member('Cy', 'Events')])).toEqual([{ department: 'Events', members: [expect.objectContaining({ name: 'Cy' })] }]);
    expect(groupByDepartment([])).toEqual([]);
    expect(DEPARTMENTS.length).toBeGreaterThan(0);
  });
});