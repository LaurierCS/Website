/**
 * StatsSection - Count-up stats on scroll
 * Stats: 20 events/year, 44 execs, 4000 students
 */
import React, { useState, useEffect, useRef } from 'react';

interface StatProps {
  value: number;
  label: string;
}

const StatCounter: React.FC<StatProps> = ({ value, label }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let start = 0;
        const increment = value / 30;
        const interval = setInterval(() => {
          start += increment;
          if (start >= value) {
            setCount(value);
            clearInterval(interval);
          } else {
            setCount(Math.floor(start));
          }
        }, 30);
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} class="text-center">
      <div class="text-5xl sm:text-6xl font-bold text-lcs-pink mb-2">{count}+</div>
      <p class="text-gray-300 text-lg">{label}</p>
    </div>
  );
};

const stats = [
  { value: 20, label: 'Events Per Year' },
  { value: 44, label: 'Executive Members' },
  { value: 4000, label: 'Students Reached' },
];

export const StatsSection: React.FC = () => {
  return (
    <section class="py-20 relative z-10">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl sm:text-4xl font-bold font-dosis text-white text-center mb-12">
          By the Numbers
        </h2>
        <div class="grid md:grid-cols-3 gap-12">
          {stats.map((stat) => (
            <StatCounter key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
