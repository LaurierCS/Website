/**
 * How each table is written to a CSV file and read back from one: its file name, its columns, the cells for one
 * row, and one row's cells checked and turned back into what is saved. The columns are the database's own names.
 * Reading uses the same schemas as the forms, so a file can't save anything the form would refuse. A new table
 * is one more format here.
 */
import type { z } from 'zod';
import type { Event, EventFields } from '../types/event';
import { DEPARTMENTS, type MemberFields, type TeamMember } from '../types/team';
import { toCsv } from './csv';
import { formatEventWhen, toPickerTime } from './dates';
import { EventFormSchema, toEventFields } from './event-form';
import { MemberFormSchema, toMemberFields } from './member-form';

/** One row read back: the fields to save, or what is wrong with it, in words an exec can act on. */
export type RowResult<Fields> =
  | Readonly<{ ok: true; fields: Fields }>
  | Readonly<{ ok: false; problems: readonly string[] }>;

export type CsvFormat<Column extends string, Item, Fields> = Readonly<{
  /** The start of the file name; the day is added, e.g. "lcs-events-2026-11-22.csv". */
  fileName: string;
  columns: readonly Column[];
  /** One item as text cells, one per column. Empty text means no value. */
  toRow: (item: Item) => Readonly<Record<Column, string>>;
  /**
   * One row checked by the form's rules and turned into the fields that are saved. `cell` reads the row's text
   * in a column; `saved` is the item the row's id points at, or null for a new row.
   */
  fromRow: (cell: (column: Column) => string, saved: Item | null) => RowResult<Fields>;
}>;

export type CsvFile = Readonly<{ name: string; text: string }>;

/** Keeps each format's column names as exact types, so `toRow` must fill in every column. */
function csvFormat<const Column extends string, Item, Fields>(format: CsvFormat<Column, Item, Fields>): CsvFormat<Column, Item, Fields> {
  return format;
}

const TIME_PROBLEM = 'Write the time like 7:30PM, or leave it empty.';

export const EVENTS_CSV = csvFormat({
  fileName: 'lcs-events',
  columns: ['id', 'title', 'date', 'time', 'location', 'description'],
  toRow: (event: Event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time: formatEventWhen(event.startTime, event.endTime) ?? '',
    location: event.location ?? '',
    description: event.description ?? '',
  }),
  fromRow: (cell, saved): RowResult<EventFields> => {
    // A saved time is kept while its cell is unchanged, even one the form's picker can't show (say, "TBD"), the
    // same as the edit form keeps it.
    const savedTime = saved ? formatEventWhen(saved.startTime, saved.endTime) : null;
    const keptTime = saved !== null && cell('time') === (savedTime ?? '');
    const time = cell('time').trim();
    const pickerTime = keptTime || time === '' ? '' : toPickerTime(time);
    const parsed = EventFormSchema.safeParse({
      title: cell('title'),
      date: cell('date').trim(),
      time: pickerTime ?? '',
      location: cell('location'),
      description: cell('description'),
    });
    const problems = [
      ...(parsed.success ? [] : problemsIn(parsed.error, { date: 'Write the date as year-month-day, like 2026-11-20.' })),
      ...(pickerTime === null ? [TIME_PROBLEM] : []),
    ];
    if (!parsed.success || problems.length > 0) return { ok: false, problems };
    const fields = toEventFields(parsed.data);
    return { ok: true, fields: keptTime ? { ...fields, startTime: saved!.startTime, endTime: saved!.endTime } : fields };
  },
});

export const TEAM_CSV = csvFormat({
  fileName: 'lcs-team',
  columns: ['id', 'name', 'role', 'department', 'is_public', 'github_url', 'linkedin_url'],
  toRow: (member: TeamMember) => ({
    id: member.id,
    name: member.name,
    role: member.role ?? '',
    department: member.department,
    is_public: member.isPublic ? 'true' : 'false',
    github_url: member.githubUrl ?? '',
    linkedin_url: member.linkedinUrl ?? '',
  }),
  fromRow: (cell): RowResult<MemberFields> => {
    // Excel turns true and false into TRUE and FALSE when it saves, so any case is read.
    const shown = cell('is_public').trim().toLowerCase();
    const isPublic = shown === 'true' ? true : shown === 'false' ? false : null;
    const parsed = MemberFormSchema.safeParse({
      name: cell('name'),
      role: cell('role'),
      department: cell('department').trim(),
      githubUrl: cell('github_url'),
      linkedinUrl: cell('linkedin_url'),
      isPublic: isPublic ?? false,
    });
    const problems = [
      ...(parsed.success ? [] : problemsIn(parsed.error, { department: `Use one of the departments: ${DEPARTMENTS.join(', ')}.` })),
      ...(isPublic === null ? ['Write is_public as true or false.'] : []),
    ];
    if (!parsed.success || problems.length > 0) return { ok: false, problems };
    return { ok: true, fields: toMemberFields(parsed.data) };
  },
});

/**
 * The form schema's messages for a row. Some fields get words that fit a spreadsheet instead (`wording`), since
 * "Pick the day" makes sense next to a date picker but not in a CSV cell.
 */
function problemsIn(error: z.ZodError, wording: Readonly<Record<string, string>>): string[] {
  return error.issues.map((issue) => wording[String(issue.path[0])] ?? issue.message);
}

/** The CSV file for a list of items, named for `today` (YYYY-MM-DD, the club's day). */
export function csvFile<Column extends string, Item>(format: CsvFormat<Column, Item, unknown>, items: readonly Item[], today: string): CsvFile {
  const rows = items.map((item) => {
    const row = format.toRow(item);
    return format.columns.map((column) => row[column]);
  });
  return { name: `${format.fileName}-${today}.csv`, text: toCsv(format.columns, rows) };
}
