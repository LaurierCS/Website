import type { LinkConfig } from './hackathonData';
import { CTAButton } from './CTAButton';

interface FinalCtaSectionProps {
  links: {
    signup: LinkConfig;
    discord: LinkConfig;
    devpost: LinkConfig;
  };
}

export function FinalCtaSection({ links }: FinalCtaSectionProps) {
  return (
    <section className="max-w-6xl mx-auto mt-10 md:mt-14">
      <div className="rounded-3xl border border-(--color-accent-yellow)/45 bg-[linear-gradient(120deg,rgba(255,214,112,0.2),rgba(17,43,70,0.6))] px-4 sm:px-6 md:px-10 py-7 md:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <p className="text-white/80 uppercase tracking-[0.17em] text-xs">Ready to ship?</p>
          <h2 className="text-white text-3xl md:text-4xl font-extrabold mt-2" style={{ fontFamily: 'var(--font-dosis)' }}>
            Build your team. Build your project. Build your future.
          </h2>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 shrink-0">
          <CTAButton link={links.signup} isPrimary={true} />
          <CTAButton link={links.discord} />
          <CTAButton link={links.devpost} />
        </div>
      </div>
    </section>
  );
}
