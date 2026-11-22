/**
 * How each table is written to a CSV file: its file name, its columns and the cells for one row. The columns are
 * the database's own names, so a file can be read back in by the import. A new table is one more format here.
 */
import type { Event } from '../types/event';
import type { TeamMember } from '../types/team';
import { toCsv } from './csv';

type CsvFormat<Column extends string, Item> = Readonly<{
  /** The start of the file name; the day is added, e.g. "lcs-events-2026-11-22.csv". */
  fileName: string;
  columns: readonly Column[];
  /** One item as text cells, one per column. Empty text means no value. */
  toRow: (item: Item) => Readonly<Record<Column, string>>;
}>;

export type CsvFile = Readonly<{ name: string; text: string }>;

/** Keeps each format's column names as exact types, so `toRow` must fill in every column. */
function csvFormat<const Column extends string, Item>(format: CsvFormat<Column, Item>): CsvFormat<Column, Item> {
  return format;
}

export const EVENTS_CSV = csvFormat({
  fileName: 'lcs-events',
  columns: ['id', 'title', 'date', 'time', 'location', 'description'],
  toRow: (event: Event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.time ?? '',
    location: event.location ?? '',
    description: event.description ?? '',
  }),
});

export const TEAM_CSV = csvFormat({
  fileName: 'lcs-team',
  columns: ['id', 'name', 'role', 'department', 'is_public', 'github_url', 'linkedin_url'],
  toRow: (member: TeamMember) => ({
    id: member.id,
    name: member.name,
    role: member.role ?? '',
    department: member.department ?? '',
    is_public: member.isPublic ? 'true' : 'false',
    github_url: member.githubUrl ?? '',
    linkedin_url: member.linkedinUrl ?? '',
  }),
});

/** The CSV file for a list of items, named for `today` (YYYY-MM-DD, the club's day). */
export function csvFile<Column extends string, Item>(format: CsvFormat<Column, Item>, items: readonly Item[], today: string): CsvFile {
  const rows = items.map((item) => {
    const row = format.toRow(item);
    return format.columns.map((column) => row[column]);
  });
  return { name: `${format.fileName}-${today}.csv`, text: toCsv(format.columns, rows) };
}
