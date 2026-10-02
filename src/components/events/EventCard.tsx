/**
 * Ticket-shaped event card: date sticker, image, title, and clamped copy.
 * Accent cycles from the site candy palette via CSS custom properties.
 */

import type { CSSProperties } from 'react';
import { getEventDateParts, getTitleInitial } from './eventDate';
import '../styles/eventTicket.css';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  picture_url: string | null;
}

interface EventCardProps {
  event: Event;
  index: number;
}

const ACCENT_COLORS = [
  { border: '#FF9FC4', shadow: 'rgba(255,159,196,0.35)', ink: '#2C3844' },
  { border: '#FF9770', shadow: 'rgba(255,151,112,0.35)', ink: '#2C3844' },
  { border: '#FFD670', shadow: 'rgba(255,214,112,0.35)', ink: '#2C3844' },
  { border: '#268AF9', shadow: 'rgba(38,138,249,0.35)', ink: '#ffffff' },
];

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export function EventCard({ event, index }: EventCardProps) {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const dateParts = getEventDateParts(event.date);
  const ticketStyle = {
    '--event-accent': accent.border,
    '--event-accent-shadow': accent.shadow,
    '--event-ink': accent.ink,
  } as CSSProperties;

  return (
    <article className="event-ticket" style={ticketStyle}>
      <time dateTime={event.date} className="event-date-sticker">
        <span className="event-date-month">{dateParts.month}</span>
        <span className="event-date-day">{dateParts.day}</span>
        <span className="event-date-weekday">{dateParts.weekday}</span>
      </time>

      <div className="event-ticket-image">
        {event.picture_url ? (
          <img src={event.picture_url} alt="" />
        ) : (
          <div className="event-ticket-fallback" aria-hidden="true">
            {getTitleInitial(event.title)}
          </div>
        )}
      </div>

      <div className="event-ticket-body">
        <h3 className="event-ticket-title">{event.title}</h3>
        <div className="event-ticket-meta">
          <span>
            <ClockIcon />
            {event.time}
          </span>
          <span>
            <PinIcon />
            {event.location}
          </span>
        </div>
        <p className="event-ticket-desc">{event.description}</p>
      </div>
    </article>
  );
}

export default EventCard;
