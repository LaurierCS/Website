/**
 * How the hero's numbers are written, shared by the page (the final number) and the count-up (every number on
 * the way there), so both always look the same: "4,000+", never "4000+".
 */

const NUMBER = new Intl.NumberFormat('en-CA');

/** A count with thousands separators and its suffix, like "4,000+". */
export function formatCount(value: number, suffix: string): string {
  return `${NUMBER.format(value)}${suffix}`;
}
