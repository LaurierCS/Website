/**
 * RevealOnScroll Wrapper Component
 * 
 * Wraps animated content and only applies animation classes when scrolled into view.
 * Works seamlessly with existing animation classes like fadeSlideUpFromBottom, 
 * scrapbookLetterAppear, mascotAppear, etc.
 * 
 * @example
 * <RevealOnScroll>
 *   <h1 className="fadeSlideUpFromBottom">Heading</h1>
 * </RevealOnScroll>
 */

import React, { type ReactNode } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface RevealOnScrollProps {
  /**
   * The content to reveal on scroll
   */
  children: ReactNode;
  
  /**
   * CSS class(es) to apply when element is visible
   * Can include animation classes like 'fadeSlideUpFromBottom'
   */
  visibleClassName?: string;
  
  /**
   * CSS class to apply when element is not visible (for paused state)
   */
  hiddenClassName?: string;
  
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  
  /**
   * How close to viewport edge should animation trigger (default: '0px')
   * Examples: '100px' triggers 100px before entering, '-50px' triggers 50px after entering
   */
  rootMargin?: string;
  
  /**
   * Visibility threshold (0-1, default: 0.1)
   * 0 = any part visible, 1 = entire element visible
   */
  threshold?: number | number[];
  
  /**
   * If true, animation plays only once on first scroll into view (default: true)
   */
  once?: boolean;
  
  /**
   * Wrapper element type (default: 'div')
   */
  as?: React.ElementType;
}

/**
 * RevealOnScroll Component
 * Utility wrapper for scroll-reveal animations
 */
export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  visibleClassName = '',
  className = '',
  rootMargin = '0px',
  threshold = 0.1,
  once = true,
  as: Component = 'div',
}) => {
  const { ref, isVisible, skipAnimation } = useIntersectionObserver({
    rootMargin,
    threshold,
    once,
  });

  // When the element was already in view on mount (skipAnimation=true) we
  // render it fully visible without any animation class so the user never
  // sees a flash or an unwanted entrance animation.
  const animationClass = isVisible && !skipAnimation ? visibleClassName : '';

  // Determine inline style:
  //  • skipAnimation  → fully visible, no transform
  //  • not yet visible → hidden at animation start position
  //  • animating in   → let the CSS class handle it (no inline style needed)
  const preAnimationStyle: React.CSSProperties | undefined = (() => {
    if (skipAnimation) return { opacity: 1, transform: 'none' };
    if (!isVisible && visibleClassName) return { opacity: 0, transform: 'translateY(20px)' };
    return undefined;
  })();

  const combinedClassName = `${className} ${animationClass}`.trim();

  return (
    <Component ref={ref} className={combinedClassName} style={preAnimationStyle}>
      {children}
    </Component>
  );
};

export default RevealOnScroll;
