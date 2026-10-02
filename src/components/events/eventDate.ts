export interface EventDateParts {
  month: string;
  day: string;
  weekday: string;
}

/**
 * Splits an ISO calendar date in local time so UTC offset cannot shift the day.
 */
export function getEventDateParts(iso: string): EventDateParts {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: String(date.getDate()),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
  };
}

/** First letter of a title for image-less tickets. */
export function getTitleInitial(title: string): string {
  return title.trim().charAt(0).toUpperCase() || '?';
}
