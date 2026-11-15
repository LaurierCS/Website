import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  /**
   * Margin around the target element to trigger the callback (default: '0px')
   * Example: '100px' would trigger when element is 100px away from viewport edge
   */
  rootMargin?: string;
  /**
   * Threshold of visibility required to trigger (0-1, default: 0.1)
   * 0 = any part visible, 1 = entire element visible
   */
  threshold?: number | number[];
  /**
   * If true, observer will disconnect after first intersection (default: false)
   * Useful if you only want animation to play once on scroll into view
   */
  once?: boolean;
}

/**
 * Custom hook to detect when an element enters the viewport
 * Perfect for scroll-reveal animations and lazy loading
 */
export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { rootMargin = '0px', threshold = 0.1, once = false } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    if (once && isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && currentRef) {
            observer.unobserve(currentRef);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [rootMargin, threshold, once, isVisible]);

  return { ref, isVisible, skipAnimation: false };
}
