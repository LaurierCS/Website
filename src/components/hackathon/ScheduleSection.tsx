import type { TimelineDay } from './hackathonData';

interface ScheduleSectionProps {
  timeline: TimelineDay[];
  totalScheduleItems: number;
}

export function ScheduleSection({ timeline, totalScheduleItems }: ScheduleSectionProps) {
  return (
    <section id="schedule" className="max-w-6xl mx-auto mt-10 md:mt-14">
      <div className="rounded-3xl border border-white/15 bg-white/6 backdrop-blur-md p-4 sm:p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <h2 className="text-white text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-dosis)' }}>
            Full Schedule
          </h2>
          <p className="text-white/70 text-sm" style={{ fontFamily: 'var(--font-montserrat)' }}>
            {totalScheduleItems} key moments across 3 days
          </p>
        </div>

        <div className="mt-5 md:mt-7 space-y-4 md:space-y-6">
          {timeline.map((day, dayIndex) => (
            <div key={day.day} className="rounded-2xl border border-white/10 bg-black/20 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 md:mb-4">
                <h3 className="text-2xl text-white font-bold" style={{ fontFamily: 'var(--font-dosis)' }}>
                  {day.day}
                </h3>
                <span
                  className="rounded-full px-3 py-1 text-xs border border-white/25 text-white/75 w-fit"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {day.dateLabel}
                </span>
              </div>

              <div className="space-y-3">
                {day.items.map((item, itemIndex) => (
                  <div
                    key={`${day.day}-${item.time}-${item.title}`}
                    className="hack-timeline-item rounded-xl border border-white/10 bg-white/5 p-4 md:p-5"
                    style={{
                      animationDelay: `${(dayIndex * 0.12 + itemIndex * 0.08).toFixed(2)}s`,
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <p className="text-(--color-accent-light-blue) font-semibold text-xs sm:text-sm uppercase tracking-[0.08em]">
                        {item.time}
                      </p>
                      <p className="text-white text-base sm:text-lg font-semibold" style={{ fontFamily: 'var(--font-dosis)' }}>
                        {item.title}
                      </p>
                    </div>
                    {item.details && (
                      <p className="mt-2 text-white/75 text-sm md:text-base leading-relaxed" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        {item.details}
                      </p>
                    )}
                    {item.signupLink && (
                      <div className="mt-3">
                        <a
                          href={item.signupLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
                          style={{ fontFamily: 'var(--font-montserrat)' }}
                        >
                          Sign Up
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
