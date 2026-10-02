import { useCallback, useEffect, useRef, useState } from 'react';

const BOTTOM_THRESHOLD_PX = 8;

/**
 * Tracks whether a scroll container overflows and whether the user is at the bottom.
 * Re-measures when itemCount changes so tab switches drop stale fade chrome.
 */
export function usePanelOverflow(itemCount: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [atBottom, setAtBottom] = useState(true);

  const measure = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const hasOverflow = element.scrollHeight > element.clientHeight + 1;
    const remaining = element.scrollHeight - element.scrollTop - element.clientHeight;
    setOverflows(hasOverflow);
    setAtBottom(!hasOverflow || remaining < BOTTOM_THRESHOLD_PX);
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.addEventListener('scroll', measure, { passive: true });

    return () => {
      observer.disconnect();
      element.removeEventListener('scroll', measure);
    };
  }, [itemCount, measure]);

  return { ref, overflows, atBottom };
}
