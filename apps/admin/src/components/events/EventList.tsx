/**
 * The events as tickets, in the order given. When the list appears the tickets deal in one after another:
 * 40ms apart and never more than 360ms in all, so a long list doesn't keep anyone waiting.
 */
import { motion } from 'motion/react';
import type { EventWithStatus } from '../../types/event';
import { EventRow } from './EventRow';

export function EventList({ tickets }: { tickets: readonly EventWithStatus[] }) {
  return (
    <ul className="grid gap-4">
      {tickets.map(({ event, status }, index) => (
        <motion.li
          key={event.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 30, delay: Math.min(index * 0.04, 0.36) }}
        >
          <EventRow event={event} status={status} />
        </motion.li>
      ))}
    </ul>
  );
}
