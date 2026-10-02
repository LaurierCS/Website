import { useEffect, useMemo, useState } from 'react';
import {
  HACKATHON_CATEGORY_AWARDS,
  HACKATHON_COUNTDOWN_TARGET,
  HACKATHON_EVENT,
  HACKATHON_LINKS,
  HACKATHON_PRIZES,
  HACKATHON_TOTAL_PRIZE_POOL,
} from '../components/hackathon/hackathonData';
import { HeroSection } from '../components/hackathon/HeroSection';
import { PrizesIdeasSection } from '../components/hackathon/PrizesIdeasSection';
import SeoHead from '../components/seo/SeoHead';
import '../components/styles/fadeSlideUpAnimation.css';
import '../components/styles/hackathonLanding.css';
import RevealOnScroll from '../components/universal/RevealOnScroll';
import { PatternBackground } from '../components/universal/PatternBackground';
import { getHackathonEventJsonLd } from '../seo/hackathonJsonLd';
import { HACKATHON_DESCRIPTION, HACKATHON_PATH, HACKATHON_TITLE } from '../seo/site';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
}

const accentPalette = ['#FF9FC4', '#FF9770', '#FFD670', '#268AF9', '#B1E0FF'];

function getCountdownTime(targetDateString: string): CountdownTime {
  const now = new Date().getTime();
  const targetTime = new Date(targetDateString).getTime();
  const difference = targetTime - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isStarted: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isStarted: false,
  };
}

export default function HackToTheFuturePage() {
  const [countdown, setCountdown] = useState<CountdownTime>(() =>
    getCountdownTime(HACKATHON_COUNTDOWN_TARGET),
  );
  const eventJsonLd = useMemo(() => getHackathonEventJsonLd(), []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdownTime(HACKATHON_COUNTDOWN_TARGET));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);


  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SeoHead
        title={HACKATHON_TITLE}
        description={HACKATHON_DESCRIPTION}
        canonicalPath={HACKATHON_PATH}
        jsonLd={eventJsonLd}
      />
      <PatternBackground />

      <div className="hack-glow-orb hack-glow-orb-one" />
      <div className="hack-glow-orb hack-glow-orb-two" />

      <main className="relative z-10 px-3 sm:px-4 md:px-8 pb-14 md:pb-16">
        <RevealOnScroll visibleClassName="fadeSlideUpFromBottom" rootMargin="30px" once={true}>
          <HeroSection
            title={HACKATHON_EVENT.title}
            host={HACKATHON_EVENT.host}
            dateRange={HACKATHON_EVENT.dateRange}
            duration={HACKATHON_EVENT.duration}
            subtitle={HACKATHON_EVENT.subtitle}
            countdown={countdown}
            links={HACKATHON_LINKS}
          />
        </RevealOnScroll>

        <RevealOnScroll visibleClassName="fadeSlideUpFast" rootMargin="20px" once={true}>
          <PrizesIdeasSection
            totalPrizePool={HACKATHON_TOTAL_PRIZE_POOL}
            prizes={HACKATHON_PRIZES}
            categoryAwards={HACKATHON_CATEGORY_AWARDS}
            accentPalette={accentPalette}
          />
        </RevealOnScroll>
      </main>
    </div>
  );
}
