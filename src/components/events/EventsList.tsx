/**
 * Events list: scrapbook title stays outside the scroller.
 * Tickets live in a capped panel once more than two events exist.
 */

import { useState } from 'react';
import { supabase } from '../../services/supabase';
import { useCache } from '../../hooks/useCache';
import { EventCard, type Event } from './EventCard';
import { EventsScrollPanel } from './EventsScrollPanel';
import RevealOnScroll from '../universal/RevealOnScroll';
import ScrapbookText from '../universal/ScrapbookText';
import '../styles/fadeSlideUpAnimation.css';

type SortOrder = 'upcoming' | 'past';

export function EventsList() {
  const [filter, setFilter] = useState<SortOrder>('upcoming');

  const [events, loading, error] = useCache<Event[]>(
    'events_cache',
    async () => {
      const { data, error: sbError } = await supabase
        .from('events')
        .select('id, title, description, date, time, location, picture_url')
        .order('date', { ascending: true });

      if (sbError) throw sbError;
      return (data as Event[]) ?? [];
    }
  );

  const today = new Date().toISOString().split('T')[0];
  const eventsArray = events ?? [];

  // Upcoming: soonest first. Past: most recently held first.
  const filteredEvents = eventsArray
    .filter((e) => (filter === 'upcoming' ? e.date >= today : e.date < today))
    .sort((a, b) =>
      filter === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
    );

  const upcomingCount = eventsArray.filter((e) => e.date >= today).length;
  const pastCount = eventsArray.filter((e) => e.date < today).length;
  const panelLabel = filter === 'upcoming' ? 'Upcoming events' : 'Past events';

  return (
    <section id="events" className="w-full flex flex-col items-center justify-center px-4 pt-48 pb-16">
      <div className="w-full max-w-6xl mx-auto">
        <RevealOnScroll
          visibleClassName="fadeSlideUpFromBottom"
          className="mb-10"
          rootMargin="50px"
          once={true}
        >
          <ScrapbookText
            text="UPCOMING EVENTS"
            letterSize={112}
            mobileLetterSize={56}
            className="text-left"
          />
        </RevealOnScroll>

        <RevealOnScroll
          visibleClassName="fadeSlideUpFast"
          rootMargin="30px"
          once={true}
          className="mb-8"
        >
          <div className="flex gap-3 flex-wrap" role="tablist" aria-label="Event time filter">
            {(['upcoming', 'past'] as SortOrder[]).map((tab) => {
              const count = tab === 'upcoming' ? upcomingCount : pastCount;
              const isActive = filter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(tab)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full font-montserrat text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFD670]"
                  style={{
                    background: isActive ? '#FFD670' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#2C3844' : 'rgba(255,255,255,0.72)',
                    border: isActive ? '1.5px solid #FFD670' : '1.5px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isActive ? 'rgba(44,56,68,0.3)' : 'rgba(255,255,255,0.08)',
                      color: isActive ? '#2C3844' : 'rgba(255,255,255,0.65)',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </RevealOnScroll>

        {loading && (
          <div className="flex justify-center items-center min-h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-[#FFD670]" />
              <p className="mt-4 text-white/70 font-montserrat text-sm">Loading events…</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div
            className="rounded-[14px] p-5 font-montserrat text-sm text-center"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#FECACA',
            }}
          >
            Failed to load events. Please try again later.
          </div>
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <EventsScrollPanel itemCount={filteredEvents.length} label={panelLabel}>
            {filteredEvents.map((event, idx) => (
              <EventCard key={event.id} event={event} index={idx} />
            ))}
          </EventsScrollPanel>
        )}

        {!loading && !error && filteredEvents.length === 0 && (
          <RevealOnScroll visibleClassName="fadeSlideUpFast" rootMargin="20px" once={true}>
            <div
              className="text-center py-16 rounded-[14px] px-6"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,214,112,0.35)',
              }}
            >
              <p className="font-dosis font-bold text-white text-xl mb-2">
                No {filter} events right now
              </p>
              <p className="font-montserrat text-white/70 text-sm">
                {filter === 'upcoming'
                  ? "Check back soon — we've got exciting things planned!"
                  : "Past events will appear here once they've wrapped up."}
              </p>
            </div>
          </RevealOnScroll>
        )}
      </div>
    </section>
  );
}

export default EventsList;
