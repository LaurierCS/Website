/**
 * Mascots Component
 * Displays the three mascot characters (Coco, Doug, Krill) in an overlapping arrangement
 * Similar to ScrapbookText but with mascot SVGs instead of letters
 * 
 * Now supports scroll-reveal animations - mascots animate when scrolled into view!
 */

import React, { useMemo } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import '../styles/scrapbookAnimations.css';

interface MascotsProps {
  mascotSize?: number; // Size in pixels for desktop, default 200
  mobileMascotSize?: number; // Size in pixels for mobile, default is mascotSize * 0.5
  className?: string;
  showOverlap?: boolean; // Whether to show overlap effect, default true
  mascotNames?: (typeof mascots[number]['name'])[]; // Specific mascots to display, default all
}

// Mascot data
const mascots = [
  { name: 'Coco', path: '/assets/mascots/Coco.svg' },
  { name: 'Doug', path: '/assets/mascots/Doug.svg' },
  { name: 'Krill', path: '/assets/mascots/Krill.svg' },
] as const;

/**
 * Generates subtle random transforms for mascot effect
 */
const generateRandomTransforms = () => {
  return Array.from({ length: 3 }, () => ({
    rotation: Math.random() * 8 - 4, // Random between -4 and 4 degrees
    offsetY: Math.random() * 4 - 2, // Random between -2 and 2 pixels
    scale: Math.random() * 0.08 + 0.96, // Random between 0.96 and 1.04
  }));
};

/**
 * Individual Mascot Component
 */
interface MascotItemProps {
  name: string;
  path: string;
  rotation: number;
  offsetY: number;
  scale: number;
  zIndex: number;
  size: number;
  overlapAmount: number;
  mascotIndex: number;
  isVisible?: boolean; // Whether element is visible in viewport
}

const MascotItem: React.FC<MascotItemProps> = ({
  name,
  path,
  rotation,
  offsetY,
  scale,
  zIndex,
  size,
  overlapAmount,
  mascotIndex,
  isVisible = true,
}) => {
  const staggerDelay = mascotIndex * 120; // 120ms stagger between mascots

  return (
    <div
      className="relative shrink-0"
      style={{
        transform: `rotate(${rotation}deg) translateY(${offsetY}px) scale(${scale})`,
        transition: 'transform 0.2s ease-out',
        marginRight: `-${overlapAmount}px`,
        zIndex,
        animation: isVisible ? `mascotAppear 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${staggerDelay}ms both` : 'none',
      }}
    >
      <img
        src={path}
        alt={name}
        className="object-contain drop-shadow-lg hover:drop-shadow-xl transition-shadow"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};

/**
 * Mascots Component
 * Main component for rendering mascots in an overlapping arrangement
 */
export const Mascots: React.FC<MascotsProps> = ({
  mascotSize = 200,
  mobileMascotSize,
  className = '',
  showOverlap = true,
  mascotNames,
}) => {
  // Track window width for responsive sizing
  const [isMobile, setIsMobile] = React.useState(false);

  // Observer for scroll-reveal animation
  const { ref, isVisible } = useIntersectionObserver({
    rootMargin: '50px',
    threshold: 0.1,
    once: true,
  });

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate responsive mascot size
  const responsiveMascotSize = isMobile 
    ? (mobileMascotSize ?? mascotSize * 0.6) 
    : mascotSize;

  // Filter mascots based on mascotNames prop
  const displayedMascots = mascotNames 
    ? mascots.filter(m => mascotNames.includes(m.name))
    : mascots;

  // Calculate overlap amount (more pronounced overlap)
  const overlapAmount = showOverlap ? responsiveMascotSize * 0.38 : 0;

  // Generate random transforms once per component instance
  const transforms = useMemo(() => {
    return generateRandomTransforms();
  }, []);

  return (
    <div ref={ref} className={`flex items-center justify-center ${className}`}>
      {displayedMascots.map((mascot, index) => (
        <MascotItem
          key={mascot.name}
          name={mascot.name}
          path={mascot.path}
          rotation={transforms[index].rotation}
          mascotIndex={index}
          offsetY={transforms[index].offsetY}
          scale={transforms[index].scale}
          zIndex={index + 1}
          size={responsiveMascotSize}
          overlapAmount={overlapAmount}
          isVisible={isVisible}
        />
      ))}
    </div>
  );
};

export default Mascots;
