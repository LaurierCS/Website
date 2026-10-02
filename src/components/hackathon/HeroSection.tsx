import { Link } from 'react-router-dom';
import type { LinkConfig } from './hackathonData';
import { CTAButton } from './CTAButton';
import { CountdownStat } from './CountdownStat';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
}

interface HeroSectionProps {
  title: string;
  host: string;
  dateRange: string;
  duration: string;
  subtitle: string;
  countdown: CountdownTime;
  links: {
    signup: LinkConfig;
    discord: LinkConfig;
    devpost: LinkConfig;
  };
}

export function HeroSection({
  title,
  host,
  dateRange,
  duration,
  subtitle,
  countdown,
  links,
}: HeroSectionProps) {
  return (
    <section className="max-w-6xl mx-auto pt-6 md:pt-10">
      <div className="fadeSlideUpFast rounded-3xl border border-white/20 bg-black/20 backdrop-blur-xl px-4 md:px-8 py-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src="/assets/logos/LCS_Icon_White_SVG.svg"
            alt="Laurier Computing Society"
            className="h-9 w-9 md:h-12 md:w-12"
          />
          <div>
            <p className="text-white text-lg md:text-xl font-bold" style={{ fontFamily: 'var(--font-dosis)' }}>
              {title}
            </p>
            <p className="text-white/75 text-sm" style={{ fontFamily: 'var(--font-montserrat)' }}>
              Hosted by {host}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-xs sm:text-sm uppercase tracking-[0.17em] text-white/75">{dateRange}</p>
          <Link
            to="/"
            className="rounded-xl border border-white/30 text-white px-4 py-2 text-sm hover:bg-white/10 transition-colors"
            style={{ fontFamily: 'var(--font-dosis)' }}
          >
            Back to LCS Site
          </Link>
        </div>
      </div>

      <div className="fadeSlideUpFromBottom rounded-4xl border border-white/15 bg-linear-to-br from-[#133151]/90 via-[#0E2A46]/80 to-[#0b1f37]/80 px-4 sm:px-6 md:px-10 py-8 md:py-12 shadow-[0_30px_120px_rgba(3,8,18,0.55)] relative overflow-hidden">
        <div className="absolute inset-0 hack-hero-grid" />
        <div className="relative z-10 grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          <div>
            <p className="inline-block rounded-full border border-white/35 bg-white/10 px-4 py-1 text-xs md:text-sm uppercase tracking-[0.2em] text-white/85 mb-4">
              {duration}
            </p>
            <h1
              className="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[0.95]"
              style={{ fontFamily: 'var(--font-dosis)' }}
            >
              Welcome to {title}
            </h1>
            <p
              className="mt-4 text-white/85 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {subtitle}. Bring your own ideas, your own tools, and your own approach.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
              <CTAButton link={links.devpost} isPrimary={true} />
              <CTAButton link={links.discord} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-black/25 backdrop-blur-md p-5 md:p-7">
            <p className="text-white uppercase tracking-[0.2em] text-xs md:text-sm">Time Until Submissions Close</p>

            {countdown.isStarted ? (
              <p className="text-(--color-accent-yellow) text-3xl md:text-4xl font-extrabold mt-4 leading-tight" style={{ fontFamily: 'var(--font-dosis)' }}>
                Submissions Are Closed
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <CountdownStat label="Days" value={countdown.days} />
                <CountdownStat label="Hours" value={countdown.hours} />
                <CountdownStat label="Minutes" value={countdown.minutes} />
                <CountdownStat label="Seconds" value={countdown.seconds} />
              </div>
            )}

            <p className="text-white/80 text-xs sm:text-sm mt-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
              Sunday, March 29 at 1:30 PM (ET)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
