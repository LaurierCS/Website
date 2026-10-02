import type { ChallengeOption, HighlightItem } from './hackathonData';

interface ChallengeHighlightsSectionProps {
  title: string;
  description: string;
  challengeOptions: ChallengeOption[];
  highlights: HighlightItem[];
  accentPalette: string[];
}

export function ChallengeHighlightsSection({
  title,
  description,
  challengeOptions,
  highlights,
  accentPalette,
}: ChallengeHighlightsSectionProps) {
  return (
    <section id="challenge-options" className="max-w-6xl mx-auto mt-10 md:mt-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* LEFT CARD: Challenge Options */}
        <div className="hack-card-stagger rounded-3xl border border-white/15 bg-[linear-gradient(140deg,rgba(255,255,255,0.08),rgba(15,30,54,0.55))] backdrop-blur-md p-6 md:p-8 h-full">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-white/75 mb-2">The Challenge</p>
            <h2 className="text-white text-3xl md:text-4xl font-black leading-tight" style={{ fontFamily: 'var(--font-dosis)' }}>
              {title}
            </h2>
          </div>
          <p className="text-white/85 text-base leading-relaxed mb-6" style={{ fontFamily: 'var(--font-montserrat)' }}>
            {description}
          </p>

          <div className="space-y-4">
            {challengeOptions.map((option, index) => (
              <div
                key={option.title}
                className="relative rounded-2xl border border-white/20 bg-white/5 p-5 hack-hover-card overflow-hidden"
                style={{
                  borderLeft: `4px solid ${accentPalette[index]}`,
                  boxShadow: `0 16px 40px color-mix(in srgb, ${accentPalette[index]} 16%, transparent)`,
                }}
              >
                <h3 className="text-white text-base sm:text-lg md:text-xl font-bold" style={{ fontFamily: 'var(--font-dosis)' }}>
                  {option.title}
                </h3>
                <p className="text-white/80 leading-relaxed text-sm mt-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARD: Highlights */}
        <div className="hack-card-stagger rounded-3xl border border-white/15 bg-[linear-gradient(140deg,rgba(255,255,255,0.08),rgba(15,30,54,0.55))] backdrop-blur-md p-6 md:p-8 h-full">
          <div className="mb-6">
            <h2 className="text-white text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-dosis)' }}>
              Why Participate
            </h2>
            <p className="text-white/75 text-sm mt-2" style={{ fontFamily: 'var(--font-montserrat)' }}>
              Six reasons to build with us
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className={`rounded-xl border border-white/15 bg-white/4 p-4 hack-hover-card group ${index === 4 ? 'sm:col-span-2 sm:max-w-xs sm:mx-auto' : ''}`}
                style={{
                  boxShadow: `0 12px 32px color-mix(in srgb, ${accentPalette[index % accentPalette.length]} 14%, transparent)`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${accentPalette[index % accentPalette.length]}, ${accentPalette[(index + 1) % accentPalette.length]})`,
                  }}
                >
                  {index + 1}
                </div>
                <h3 className="text-white text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-dosis)' }}>
                  {item.title}
                </h3>
                <p className="text-white/75 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-montserrat)' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
