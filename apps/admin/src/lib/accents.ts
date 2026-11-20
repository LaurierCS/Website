/**
 * Which of the five LCS accents something gets. The rotating accent is part of the brand, so it is picked here
 * and nowhere else: by position for things in a row (department headings), and from a name for a person, so
 * they keep the same colour on every visit.
 */

export const ACCENTS = ['pink', 'yellow', 'blue', 'sky', 'orange'] as const;
export type Accent = (typeof ACCENTS)[number];

/** The accent for the item at `index` in a row, going round the five in order. */
export function accentAt(index: number): Accent {
  return ACCENTS[index % ACCENTS.length] ?? 'pink';
}

/** The accent for a name. The same name always gets the same accent. */
export function accentFor(name: string): Accent {
  let total = 0;
  for (const character of name) total += character.codePointAt(0) ?? 0;
  return accentAt(total);
}
