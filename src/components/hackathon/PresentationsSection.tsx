import type { PresentationRoom } from './hackathonData';

interface PresentationsSectionProps {
  presentations: PresentationRoom[];
  accentPalette: string[];
}

export function PresentationsSection({
  presentations,
  accentPalette,
}: PresentationsSectionProps) {
  return (
    <section id="presentations" className="max-w-6xl mx-auto mt-10 md:mt-14">
      <div className="mb-8">
        <h2 className="text-white text-3xl md:text-4xl font-black leading-tight" style={{ fontFamily: 'var(--font-dosis)' }}>
          Presentation Schedule
        </h2>
        <p className="text-white/75 text-base mt-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
          Sunday, March 29 • 2:00 - 6:00 PM EST
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {presentations.map((room, roomIndex) => (
          <div
            key={room.roomNumber}
            className="hack-card-stagger rounded-3xl border border-white/15 bg-[linear-gradient(140deg,rgba(255,255,255,0.08),rgba(15,30,54,0.55))] backdrop-blur-md p-6 md:p-8 h-full"
          >
            <div className="mb-6">
              <div
                className="inline-block rounded-lg px-3 py-1 mb-3"
                style={{
                  background: `linear-gradient(135deg, ${accentPalette[roomIndex]}, ${accentPalette[(roomIndex + 1) % accentPalette.length]})`,
                }}
              >
                <p className="text-white text-xs font-bold uppercase tracking-[0.2em]">Room</p>
              </div>
              <h3 className="text-white text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-dosis)' }}>
                {room.roomNumber}
              </h3>
              <p className="text-white/75 text-sm mt-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                {room.presentations.length} presentations
              </p>
            </div>

            <div className="space-y-3 max-h-150 overflow-y-auto custom-scrollbar">
              {room.presentations.map((presentation, index) => (
                <div
                  key={`${room.roomNumber}-${index}`}
                  className="relative rounded-xl border border-white/15 bg-white/5 p-3 hack-hover-card flex items-center gap-3"
                  style={{
                    borderLeft: `3px solid ${accentPalette[index % accentPalette.length]}`,
                  }}
                >
                  <div className="shrink-0 text-xs font-bold text-white/70 min-w-17.5">
                    {presentation.timeSlot}
                  </div>
                  <div className="text-white text-sm font-semibold" style={{ fontFamily: 'var(--font-dosis)' }}>
                    {presentation.projectName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </section>
  );
}
