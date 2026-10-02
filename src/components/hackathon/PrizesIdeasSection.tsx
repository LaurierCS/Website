import type { PrizeItem } from './hackathonData';

interface PrizesIdeasSectionProps {
  totalPrizePool: string;
  prizes: PrizeItem[];
  categoryAwards: PrizeItem[];
  accentPalette: string[];
}

export function PrizesIdeasSection({
  totalPrizePool,
  prizes,
  categoryAwards,
  accentPalette,
}: PrizesIdeasSectionProps) {
  const hasWinners = prizes.some((p) => p.winnerProject);
  const colors = ['from-amber-500/20 to-amber-500/5', 'from-slate-400/20 to-slate-400/5', 'from-orange-600/20 to-orange-600/5'];

  return (
    <section id="prizes" className="max-w-6xl mx-auto mt-10 md:mt-14">
      <div className="rounded-3xl border border-white/15 bg-white/6 backdrop-blur-md p-4 sm:p-6 md:p-7 h-full">
        <h2 className="text-white text-3xl md:text-4xl font-bold" style={{ fontFamily: 'var(--font-dosis)' }}>
          {hasWinners ? 'Winners' : 'Prizes and Awards'}
        </h2>
        <p className="mt-2 text-white/75" style={{ fontFamily: 'var(--font-montserrat)' }}>
          {hasWinners ? 'Congratulations to our hackathon winners!' : `Total prize pool: ${totalPrizePool}`}
        </p>

        {/* Prize / Winner Cards */}
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {prizes.map((prize, index) => (
            <div
              key={prize.placement}
              className={`rounded-2xl border border-white/15 from-gradient-180 p-6 hack-hover-card overflow-hidden relative group transition-all duration-300 ${
                hasWinners ? `bg-gradient-to-b ${colors[index]} border-white/20` : 'bg-black/25'
              }`}
              style={{
                boxShadow: `0 12px 32px color-mix(in srgb, ${accentPalette[index % 3]} ${hasWinners ? '30%' : '20%'}, transparent)`,
              }}
            >
              {/* Placement Badge */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs sm:text-sm uppercase tracking-[0.16em] text-white/65 font-semibold">
                  {prize.placement}
                </p>
                {index === 0 && <span className="text-2xl">🏆</span>}
                {index === 1 && <span className="text-2xl">🥈</span>}
                {index === 2 && <span className="text-2xl">🥉</span>}
              </div>

              {hasWinners && prize.winnerProject ? (
                <>
                  {/* Winner Display */}
                  <p className="text-xl md:text-2xl text-white font-extrabold mb-3" style={{ fontFamily: 'var(--font-dosis)' }}>
                    {prize.winnerProject}
                  </p>
                  <p className="text-white/70 text-sm mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {prize.description}
                  </p>
                  {prize.devpostUrl && (
                    <a
                      href={prize.devpostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors duration-200"
                    >
                      View on Devpost
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </>
              ) : (
                <>
                  {/* Prize Display */}
                  <p className="text-3xl text-white font-extrabold mb-3" style={{ fontFamily: 'var(--font-dosis)' }}>
                    {prize.amount}
                  </p>
                  <p className="text-white/75 text-sm" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {prize.description}
                  </p>
                  {/* Placeholder for Winner */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-white/50 mb-2">Winner Project</p>
                    <p className="text-white/40 text-sm italic">[Project name pending]</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Category Awards */}
        {categoryAwards.length > 0 && (
          <>
            <h3 className="text-white text-xl font-bold mt-10" style={{ fontFamily: 'var(--font-dosis)' }}>
              {hasWinners ? 'Category Winners' : 'Category Awards'}
            </h3>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {categoryAwards.map((award) => (
                <div
                  key={award.placement}
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 px-4 py-4 hack-hover-card transition-all duration-200 group"
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-white font-semibold" style={{ fontFamily: 'var(--font-dosis)' }}>
                      {award.placement}
                    </p>
                    {hasWinners && award.winnerProject ? (
                      <>
                        <p className="text-white/80 font-medium">{award.winnerProject}</p>
                        {award.devpostUrl && (
                          <a
                            href={award.devpostUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm underline inline-flex w-fit gap-1"
                          >
                            View on Devpost
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-white/70 text-sm">{award.description}</p>
                        <p className="text-xs text-white/40 italic mt-1">[Project pending]</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
