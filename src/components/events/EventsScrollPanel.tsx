import type { ReactNode } from 'react';
import { usePanelOverflow } from '../../hooks/usePanelOverflow';
import '../styles/eventsPanel.css';

const SCROLL_AFTER_COUNT = 2;

interface EventsScrollPanelProps {
  children: ReactNode;
  itemCount: number;
  label: string;
}

/**
 * Caps the list at two tickets plus a peek. Chrome (fade, scrollbar, focus)
 * only appears when the stack actually overflows.
 */
export function EventsScrollPanel({ children, itemCount, label }: EventsScrollPanelProps) {
  const capScroll = itemCount > SCROLL_AFTER_COUNT;
  const { ref, overflows } = usePanelOverflow(itemCount);
  const showFade = capScroll && overflows;

  return (
    <div className="events-scroll-shell">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={capScroll ? 0 : undefined}
        className={capScroll ? 'events-scroll-stack events-scroll-panel' : 'events-scroll-stack'}
      >
        {children}
      </div>
      {showFade && (
        <>
          <div className="events-scroll-fade events-scroll-fade-top" aria-hidden="true" />
          <div className="events-scroll-fade events-scroll-fade-bottom" aria-hidden="true" />
        </>
      )}
    </div>
  );
}

export default EventsScrollPanel;
