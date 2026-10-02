/**
 * Stats Component
 * Displays key club statistics with animated count-up effects
 * Now with scroll-reveal - animations trigger when scrolled into view!
 */

import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

/**
 * Individual stat item configuration
 */
interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

/**
 * Stats data configuration
 */
const STAT_ACCENTS = ['#FF9FC4', '#FF9770', '#FFD670'] as const;

const statsData: StatItem[] = [
  {
    value: 20,
    suffix: '+',
    label: 'Events in a Year',
  },
  {
    value: 44,
    suffix: '+',
    label: 'Executive Members',
  },
  {
    value: 4000,
    suffix: '+',
    label: 'Students',
  },
];

/**
 * Simple Counter Component
 * Animates a number from 0 to the target value
 */
interface SimpleCounterProps {
  value: number;
  shouldStart: boolean;
  duration?: number;
}

const SimpleCounter: React.FC<SimpleCounterProps> = ({ value, shouldStart, duration = 2.5 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Only animate if shouldStart is true
    if (!shouldStart) {
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + (duration * 1000);

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (endTime - startTime), 1);
      
      // Easing function (easeOutExpo)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * value);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Start the animation asynchronously via requestAnimationFrame
    const frameId = requestAnimationFrame(animate);
    
    // Cleanup: cancel animation frame if effect is cleaned up
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [shouldStart, value, duration]);

  return <>{displayValue.toLocaleString()}</>;
};

/**
 * Stats Component
 * Renders animated statistics in a responsive grid layout
 */
export const Stats = () => {
  const [startAnimation, setStartAnimation] = useState(false);

  // Detect when Stats component scrolls into view
  const { ref, isVisible } = useIntersectionObserver({
    rootMargin: '50px',
    threshold: 0.1,
    once: true,
  });

  // Trigger animation when component is visible
  useEffect(() => {
    if (isVisible) {
      // Small delay for smoother visual experience
      const timer = setTimeout(() => {
        setStartAnimation(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div ref={ref} className="w-full max-w-6xl mx-auto px-4 py-8 md:py-16">
      {/* Stats Grid - stacked vertically on mobile, 3 columns on md+ */}
      <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-center md:items-start">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center text-center w-full"
          >

            {/* Number Container - Animated count-up */}
            <div className="mb-2 md:mb-2">
              <span
                className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                style={{
                  fontFamily: 'var(--font-dosis)',
                  color: STAT_ACCENTS[index],
                }}
              >
                {/* Simple Counter Animation */}
                <SimpleCounter value={stat.value} shouldStart={startAnimation} duration={2.5} />
                {/* + sign */}
                <span className="ml-1">
                  {stat.suffix}
                </span>
              </span>
            </div>

            {/* Label Text - Regular weight Dosis font */}
            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 tracking-wide"
              style={{
                fontFamily: 'var(--font-dosis)',
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
