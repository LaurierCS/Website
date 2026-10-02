import { useState, useEffect } from 'react';

export const PatternBackground = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        // Extend into iOS safe areas so the background covers behind the
        // iOS 26 Safari bottom tab bar. viewport-fit=cover + inset-0 still
        // leaves a gap at the bottom; paddding/negative bottom covers it.
        top: 0,
        left: 0,
        right: 0,
        // Push below the safe-area inset so the bg color bleeds under the tab bar
        bottom: 'calc(-1 * env(safe-area-inset-bottom, 0px))',
        background: `linear-gradient(135deg, #0e263d 0%, #0c2238 100%)`,
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-50%',
          backgroundImage: `url(/assets/patterns/Icon_Pattern.svg)`,
          backgroundRepeat: 'repeat',
          backgroundSize: isMobile ? '600px' : '800px',
          opacity: 0.02,
          transform: 'rotate(-15deg)',
          transformOrigin: 'center',
          willChange: 'auto',
        }}
      />
    </div>
  );
};
