/**
 * The team form's values and how they turn into what is saved. The name rule comes from `TeamMemberSchema` and
 * the departments from `DEPARTMENTS`, so the form, the Team list and the database rule can't disagree.
 */
import { z } from 'zod';
import { type BadgeFace, DEPARTMENTS, type MemberFields, type TeamMember, TeamMemberSchema } from '../../types/team';

const GITHUB = z.url({ protocol: /^https$/, hostname: /^(www\.)?github\.com$/ });
// LinkedIn uses country subdomains too, like ca.linkedin.com.
const LINKEDIN = z.url({ protocol: /^https$/, hostname: /^([a-z]{2,3}\.)?linkedin\.com$/ });

/** Empty, or a link `link` accepts. Empty means "no link", never a broken one. */
function optionalLink(link: z.ZodURL, message: string) {
  return z
    .string()
    .trim()
    .refine((value) => value === '' || link.safeParse(value).success, message);
}

export const MemberFormSchema = z.object({
  name: TeamMemberSchema.shape.name,
  role: z.string(),
  // The dropdown starts on "Pick a department…" (empty), which this refuses.
  department: z.string().pipe(z.enum(DEPARTMENTS, { error: 'Pick their department.' })),
  githubUrl: optionalLink(GITHUB, "That isn't a GitHub link. Paste the whole address, like https://github.com/their-name."),
  linkedinUrl: optionalLink(
    LINKEDIN,
    "That isn't a LinkedIn link. Paste the whole address, like https://www.linkedin.com/in/their-name.",
  ),
  isPublic: z.boolean(),
});
export type MemberFormValues = z.input<typeof MemberFormSchema>;
/** The form's values once they pass `MemberFormSchema`: the department is then one of the seven. */
export type CheckedMemberForm = z.output<typeof MemberFormSchema>;

/** Which fields the exec changed, as React Hook Form reports them. */
export type ChangedMemberFields = Partial<Readonly<Record<keyof MemberFormValues, boolean | undefined>>>;

/** An empty form for a new member: on the site unless the exec turns it off. */
export const EMPTY_MEMBER_FORM: MemberFormValues = {
  name: '',
  role: '',
  department: '',
  githubUrl: '',
  linkedinUrl: '',
  isPublic: true,
};

/**
 * The form filled in from a saved member. A department saved before the database required one of the seven
 * starts empty, so the exec picks a real one.
 */
export function formValuesFor(member: TeamMember): MemberFormValues {
  const known: readonly string[] = DEPARTMENTS;
  return {
    name: member.name,
    role: member.role ?? '',
    department: known.includes(member.department) ? member.department : '',
    githubUrl: member.githubUrl ?? '',
    linkedinUrl: member.linkedinUrl ?? '',
    isPublic: member.isPublic,
  };
}

/** The checked form as it is saved: trimmed, with empty role and links as no value. */
export function toMemberFields(values: CheckedMemberForm): MemberFields {
  return {
    name: values.name.trim(),
    role: values.role.trim() || null,
    department: values.department,
    githubUrl: values.githubUrl || null,
    linkedinUrl: values.linkedinUrl || null,
    isPublic: values.isPublic,
  };
}

/**
 * The crew badge for the form as it stands, so an exec sees how the member will look on the Team board while
 * typing. "Their name" stands in until a name is typed, and a link shows only once it is a whole, real link.
 */
export function badgePreview(values: MemberFormValues, shownPhoto: string | null): BadgeFace {
  return {
    name: values.name.trim() || 'Their name',
    role: values.role.trim() || null,
    pictureUrl: shownPhoto,
    githubUrl: linkOrNull(GITHUB, values.githubUrl),
    linkedinUrl: linkOrNull(LINKEDIN, values.linkedinUrl),
    isPublic: values.isPublic,
  };
}

function linkOrNull(link: z.ZodURL, value: string): string | null {
  const trimmed = value.trim();
  return link.safeParse(trimmed).success ? trimmed : null;
}

/** Only the fields the exec changed, so saving an edit leaves everything else exactly as it was. */
export function changedMemberFields(values: CheckedMemberForm, changed: ChangedMemberFields): Partial<MemberFields> {
  const fields = toMemberFields(values);
  return {
    ...(changed.name && { name: fields.name }),
    ...(changed.role && { role: fields.role }),
    ...(changed.department && { department: fields.department }),
    ...(changed.githubUrl && { githubUrl: fields.githubUrl }),
    ...(changed.linkedinUrl && { linkedinUrl: fields.linkedinUrl }),
    ...(changed.isPublic && { isPublic: fields.isPublic }),
  };
}
