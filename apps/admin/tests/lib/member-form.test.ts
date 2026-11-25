import {
  badgePreview,
  changedMemberFields,
  EMPTY_MEMBER_FORM,
  formValuesFor,
  MemberFormSchema,
  type MemberFormValues,
  toMemberFields,
} from '../../src/lib/member-form';
import type { TeamMember } from '../../src/types/team';

const SAM: TeamMember = {
  id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
  name: 'Sam Rivera',
  role: 'VP Engineering',
  department: 'Engineering',
  isPublic: true,
  photoPath: null,
  pictureUrl: null,
  githubUrl: 'https://github.com/samrivera',
  linkedinUrl: null,
};

const FILLED: MemberFormValues = { ...EMPTY_MEMBER_FORM, name: 'Sam Rivera', department: 'Engineering' };

/** The message for `field` when the form is checked with `values`, or undefined when it passes. */
function problemWith(values: MemberFormValues, field: keyof MemberFormValues): string | undefined {
  const result = MemberFormSchema.safeParse(values);
  return result.success ? undefined : result.error.issues.find((issue) => issue.path[0] === field)?.message;
}

describe('the team form', () => {
  it('starts empty, on the site, with no department picked', () => {
    expect(EMPTY_MEMBER_FORM).toMatchObject({ department: '', isPublic: true });
  });

  it.each(['', '   '])("won't take %j as a name", (name) => {
    expect(problemWith({ ...FILLED, name }, 'name')).toBe('Give their name.');
  });

  it.each(['', 'Engineerng', 'engineering'])('only takes one of the seven departments, not %j', (department) => {
    expect(problemWith({ ...FILLED, department }, 'department')).toBe('Pick their department.');
  });

  it.each([
    'https://github.com/samrivera',
    'https://www.github.com/samrivera',
  ])('takes the GitHub link %s', (githubUrl) => {
    expect(problemWith({ ...FILLED, githubUrl }, 'githubUrl')).toBeUndefined();
  });

  it.each([
    'github.com/samrivera',
    'http://github.com/samrivera',
    'https://gitlab.com/samrivera',
    'https://github.com.evil.example/samrivera',
    'https://www.linkedin.com/in/samrivera',
  ])('turns away %s as a GitHub link', (githubUrl) => {
    expect(problemWith({ ...FILLED, githubUrl }, 'githubUrl')).toMatch(/isn't a GitHub link/);
  });

  it.each([
    'https://linkedin.com/in/samrivera',
    'https://www.linkedin.com/in/samrivera',
    'https://ca.linkedin.com/in/samrivera',
  ])('takes the LinkedIn link %s', (linkedinUrl) => {
    expect(problemWith({ ...FILLED, linkedinUrl }, 'linkedinUrl')).toBeUndefined();
  });

  it.each(['linkedin.com/in/samrivera', 'https://linkedin.com.evil.example/in/samrivera'])(
    'turns away %s as a LinkedIn link',
    (linkedinUrl) => {
      expect(problemWith({ ...FILLED, linkedinUrl }, 'linkedinUrl')).toMatch(/isn't a LinkedIn link/);
    },
  );

  it('saves empty role and links as no value, never as a broken link', () => {
    const checked = MemberFormSchema.parse({ ...FILLED, name: ' Sam Rivera ', role: '  ', githubUrl: '  ' });

    expect(toMemberFields(checked)).toEqual({
      name: 'Sam Rivera',
      role: null,
      department: 'Engineering',
      githubUrl: null,
      linkedinUrl: null,
      isPublic: true,
    });
  });

  it('fills in from a saved member', () => {
    expect(formValuesFor(SAM)).toEqual({
      name: 'Sam Rivera',
      role: 'VP Engineering',
      department: 'Engineering',
      githubUrl: 'https://github.com/samrivera',
      linkedinUrl: '',
      isPublic: true,
    });
  });

  it('asks for a department again when the saved one is not one of the seven', () => {
    const misspelled = { ...SAM, department: 'Engineerng' } as unknown as TeamMember;
    expect(formValuesFor(misspelled).department).toBe('');
  });

  it('keeps only the fields that were changed', () => {
    const checked = MemberFormSchema.parse({ ...formValuesFor(SAM), role: 'Software Engineer' });

    expect(changedMemberFields(checked, { role: true })).toEqual({ role: 'Software Engineer' });
    expect(changedMemberFields(checked, {})).toEqual({});
  });
});

describe('the badge preview beside the team form', () => {
  it('stands in "Their name" and no role until they are typed', () => {
    expect(badgePreview(EMPTY_MEMBER_FORM, null)).toEqual({
      name: 'Their name',
      role: null,
      pictureUrl: null,
      githubUrl: null,
      linkedinUrl: null,
      isPublic: true,
    });
  });

  it('shows what is typed, trimmed, with the chosen photo', () => {
    const preview = badgePreview({ ...FILLED, name: ' Ava Lee ', role: ' VP of Events ' }, 'blob:photo');

    expect(preview).toMatchObject({ name: 'Ava Lee', role: 'VP of Events', pictureUrl: 'blob:photo' });
  });

  it('shows a link only once it is a whole GitHub or LinkedIn link', () => {
    const halfTyped = badgePreview({ ...FILLED, githubUrl: 'https://github', linkedinUrl: 'https://gitlab.com/ava' }, null);
    const whole = badgePreview(
      { ...FILLED, githubUrl: ' https://github.com/ava ', linkedinUrl: 'https://www.linkedin.com/in/ava' },
      null,
    );

    expect(halfTyped).toMatchObject({ githubUrl: null, linkedinUrl: null });
    expect(whole).toMatchObject({ githubUrl: 'https://github.com/ava', linkedinUrl: 'https://www.linkedin.com/in/ava' });
  });

  it('takes the hidden look when the switch is off', () => {
    expect(badgePreview({ ...FILLED, isPublic: false }, null).isPublic).toBe(false);
  });
});
