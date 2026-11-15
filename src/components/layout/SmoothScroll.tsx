import React, { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { SmoothScrollContext } from '../../hooks/useSmoothScroll';
import 'lenis/dist/lenis.css';

interface SmoothScrollProps {
  children: React.ReactNode;
  /** Whether to render the slim glowing progress indicator bar at the top */
  showIndicator?: boolean;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({
  children,
  showIndicator = true,
}) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const rafHandleRef = useRef<number | null>(null);
  const location = useLocation();

  // Motion scroll progress hooks
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Instantiate Lenis smooth scrolling engine matching NickShahbaz physics
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Set instance asynchronously
    queueMicrotask(() => {
      setLenisInstance(lenis);
    });

    // Synchronize requestAnimationFrame loop
    const raf = (time: number) => {
      lenis.raf(time);
      rafHandleRef.current = requestAnimationFrame(raf);
    };

    rafHandleRef.current = requestAnimationFrame(raf);

    // Sync scroll events to window with reentrancy lock to prevent recursive loops
    let isDispatching = false;
    lenis.on('scroll', () => {
      if (isDispatching) return;
      isDispatching = true;
      try {
        window.dispatchEvent(new Event('scroll'));
      } catch {
        // Prevent unhandled errors from breaking animation loop
      } finally {
        isDispatching = false;
      }
    });

    return () => {
      if (rafHandleRef.current !== null) {
        cancelAnimationFrame(rafHandleRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
      queueMicrotask(() => {
        setLenisInstance(null);
      });
    };
  }, []);

  const scrollTo = useCallback(
    (
      target: number | string | HTMLElement,
      options?: { offset?: number; immediate?: boolean; duration?: number }
    ) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, options);
      } else {
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
        } else if (typeof target === 'string') {
          const el = document.querySelector(target);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0);
            window.scrollTo({ top, behavior: options?.immediate ? 'auto' : 'smooth' });
          }
        } else if (target instanceof HTMLElement) {
          const top = target.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0);
          window.scrollTo({ top, behavior: options?.immediate ? 'auto' : 'smooth' });
        }
      }
    },
    []
  );

  // Scroll to top on route change (unless navigating to a specific hash)
  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        scrollTo(location.hash, { offset: -80 });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      scrollTo(0, { immediate: true });
    }
  }, [location.pathname, location.hash, scrollTo]);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo }}>
      {showIndicator && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF9FC4] via-[#FFD670] to-[#268AF9] origin-left z-[60] pointer-events-none shadow-[0_0_12px_rgba(255,214,112,0.8)]"
          style={{ scaleX }}
          aria-hidden="true"
        />
      )}
      <div className="smooth-scroll-wrapper w-full min-h-screen">
        {children}
      </div>
    </SmoothScrollContext.Provider>
  );
};
