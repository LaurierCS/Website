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
 * 
 * @example
 * const { ref, isVisible } = useIntersectionObserver();
 * return (
 *   <div ref={ref} className={isVisible ? 'fadeSlideUpFromBottom' : ''}>
 *     Content here
 *   </div>
 * );
 */
export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
    const { rootMargin = '0px', threshold = 0.1, once = false } = options;
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    /**
     * True when the element was already in the viewport the moment the observer
     * was first attached (i.e. it was visible on page load without any user
     * scroll). Consumers can use this to skip entrance animations for content
     * that Safari / iOS 26 already rendered below the fold before the JS runs.
     */
    const [skipAnimation, setSkipAnimation] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        let isInitial = true;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // ── iOS 26 / Safari bottom-bar fix ──────────────────────────────────
                // On the first observer callback, detect if element was already in view
                // on mount. Safari iOS shows content behind the tab bar so elements that
                // appear "off-screen" in traditional terms may already be visible.
                if (isInitial) {
                    isInitial = false;
                    if (entry.isIntersecting) {
                        // Element was in view on mount
                        setIsVisible(true);
                        setSkipAnimation(true);
                        if (once) {
                            observer.unobserve(currentRef);
                        }
                        return;
                    }
                }
                // ────────────────────────────────────────────────────────────────────

                // Handle scroll-triggered visibility
                if (entry.isIntersecting) {
                    setSkipAnimation(false);
                    setIsVisible(true);
                    // Disconnect after first intersection if 'once' is true
                    if (once && currentRef) {
                        observer.unobserve(currentRef);
                    }
                } else if (!once) {
                    // If not in 'once' mode, allow animation to replay when scrolling back
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
    }, [rootMargin, threshold, once]);

    return { ref, isVisible, skipAnimation };
}
