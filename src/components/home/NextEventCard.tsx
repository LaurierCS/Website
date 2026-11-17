/**
 * NextEventCard - Shows upcoming event with live countdown
 */
import React, { useState, useEffect } from 'react';
import type { Event } from '@/lib/supabase';

interface NextEventCardProps {
  event: Event | null;
}

export const NextEventCard: React.FC<NextEventCardProps> = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!event) return;

    const updateCountdown = () => {
      const now = new Date();
      const eventDate = new Date(`${event.date}T${event.time || '00:00:00'}`);
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Happening now!');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h away`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${mins}m away`);
      } else {
        setTimeLeft(`${mins}m away`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [event]);

  if (!event) {
    return (
      <section class="py-20 relative z-10">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="bg-gradient-to-br from-lcs-dark to-lcs-darker rounded-lg p-8 border border-gray-600 text-center">
            <p class="text-gray-400">No upcoming events scheduled</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section class="py-20 relative z-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold font-dosis text-white mb-8">Next Event</h2>
        <div class="bg-gradient-to-br from-lcs-dark to-lcs-darker rounded-lg p-8 border-2 border-lcs-pink hover:border-lcs-orange transition-colors">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-2xl sm:text-3xl font-bold text-lcs-pink mb-4">{event.title}</h3>
              <p class="text-lcs-light-blue text-lg mb-2">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {event.time && <p class="text-gray-300 mb-2">{event.time}</p>}
              {event.location && <p class="text-gray-300 mb-4">{event.location}</p>}
              {event.description && (
                <p class="text-gray-300 leading-relaxed line-clamp-3 mb-4">{event.description}</p>
              )}
              <a
                href={`/events/${event.id}`}
                class="inline-block px-6 py-2 bg-lcs-pink text-white font-semibold rounded hover:bg-lcs-orange transition-colors"
              >
                Learn More
              </a>
            </div>
            <div class="flex items-center justify-center bg-black/20 rounded-lg p-6 text-center">
              <div>
                <p class="text-gray-400 text-sm mb-2">Time Until Event</p>
                <p class="text-3xl sm:text-4xl font-bold text-lcs-yellow">{timeLeft}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NextEventCard;
