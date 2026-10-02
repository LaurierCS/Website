/**
 * ScrapbookText Component
 * Universal component for displaying text in scrapbook style using letter assets
 * Supports letters: A, C, D, E, F, G, H, I, K, L, M, N, O, P, R, S, T, U, V, W
 * 
 * Now supports scroll-reveal animations - letters animate when scrolled into view!
 */

import React, { useMemo } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import '../styles/scrapbookAnimations.css';

interface ScrapbookTextProps {
  text: string;
  letterSize?: number; // Size in pixels for desktop, default 112 (w-28)
  mobileLetterSize?: number; // Size in pixels for mobile, default is letterSize * 0.5
  className?: string;
  letterClassName?: string;
  playAnimationOnMount?: boolean; // If true, animate even if element is already visible on page load
}

// Supported letters - only these have assets
const SUPPORTED_LETTERS = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W'] as const;
type SupportedLetter = typeof SUPPORTED_LETTERS[number];

// Map each letter to its asset path
const letterAssets: Record<SupportedLetter, string> = {
  A: '/assets/letters/A.webp',
  C: '/assets/letters/C.webp',
  D: '/assets/letters/D.webp',
  E: '/assets/letters/E.webp',
  F: '/assets/letters/F.webp',
  G: '/assets/letters/G.webp',
  H: '/assets/letters/H.webp',
  I: '/assets/letters/I.webp',
  K: '/assets/letters/K.webp',
  L: '/assets/letters/L.webp',
  M: '/assets/letters/M.webp',
  N: '/assets/letters/N.webp',
  O: '/assets/letters/O.webp',
  P: '/assets/letters/P.webp',
  R: '/assets/letters/R.webp',
  S: '/assets/letters/S.webp',
  T: '/assets/letters/T.webp',
  U: '/assets/letters/U.webp',
  V: '/assets/letters/V.webp',
  W: '/assets/letters/W.webp',
};

/**
 * Validates text contains only supported letters and spaces
 */
const validateText = (text: string): void => {
  const uppercaseText = text.toUpperCase();
  const invalidChars = uppercaseText
    .split('')
    .filter((char) => char !== ' ' && !SUPPORTED_LETTERS.includes(char as SupportedLetter));

  if (invalidChars.length > 0) {
    throw new Error(
      `ScrapbookText: Unsupported characters found: "${invalidChars.join(', ')}". ` +
      `Only these letters are supported: ${SUPPORTED_LETTERS.join(', ')}`
    );
  }
};

/**
 * Generates random transform values for scrapbook effect
 */
const generateRandomTransforms = (count: number) => {
  return Array.from({ length: count }, () => ({
    rotation: Math.random() * 6 - 3, // Random between -3 and 3 degrees
    offsetY: Math.random() * 2 - 1, // Random between -1 and 1 pixels
    scale: Math.random() * 0.04 + 0.98, // Random between 0.98 and 1.02
  }));
};

/**
 * ScrapbookLetter Component
 * Renders individual letter with scrapbook effect styling
 */
interface ScrapbookLetterProps {
  letter: SupportedLetter;
  rotation: number;
  offsetY: number;
  scale: number;
  zIndex: number;
  size: number;
  letterClassName?: string;
  isVisible?: boolean; // Whether element is visible in viewport
  skipAnimation?: boolean; // Skip entrance animation - element was already visible on mount
}

const ScrapbookLetter: React.FC<ScrapbookLetterProps & { letterIndex: number }> = ({
  letter,
  rotation,
  offsetY,
  scale,
  zIndex,
  size,
  letterClassName,
  letterIndex,
  isVisible = true,
  skipAnimation = false,
}) => {
  const assetPath = letterAssets[letter];
  const staggerDelay = letterIndex * 60; // 60ms stagger between letters

  // Determine animation value:
  //  • skipAnimation → already visible on mount, no animation
  //  • isVisible      → scrolled into view, play the entrance animation
  //  • otherwise      → hidden (waiting to scroll into view)
  const animationStyle = (() => {
    if (skipAnimation) return 'none';
    if (isVisible) return `scrapbookLetterAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${staggerDelay}ms both`;
    return 'none';
  })();

  return (
    <div
      className="relative"
      style={{
        transform: `rotate(${rotation}deg) translateY(${offsetY}px) scale(${scale})`,
        transition: 'transform 0.2s ease-out',
        marginRight: `${-size * 0.45}px`, // Dynamic overlap based on size
        zIndex,
      }}
    >
      <div
        style={{
          animation: animationStyle,
          // When skipping the animation render fully opaque immediately
          opacity: skipAnimation ? 1 : undefined,
        }}
      >
        <img
          src={assetPath}
          alt={letter}
          className={`object-contain drop-shadow-lg hover:drop-shadow-xl transition-shadow ${letterClassName || ''}`}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      </div>
    </div>
  );
};

/**
 * ScrapbookText Component
 * Main component for rendering scrapbook-style text
 */
export const ScrapbookText: React.FC<ScrapbookTextProps> = ({
  text,
  letterSize = 112,
  mobileLetterSize,
  className = '',
  letterClassName = '',
  playAnimationOnMount = false,
}) => {
  // Track window width for responsive sizing
  // Uses two breakpoints: sm (640px) and md (768px)
  const [windowWidth, setWindowWidth] = React.useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Observer for scroll-reveal animation
  const { ref, isVisible, skipAnimation } = useIntersectionObserver({
    rootMargin: '0px',
    threshold: 0.05,
    once: true,
  });

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive letter size with sm breakpoint
  const responsiveLetterSize = (() => {
    if (windowWidth < 640) {
      // Mobile: explicit mobileLetterSize or 45% of desktop
      return mobileLetterSize ?? Math.round(letterSize * 0.45);
    }
    if (windowWidth < 768) {
      // Tablet-small: 65% of desktop
      return Math.round(letterSize * 0.65);
    }
    return letterSize;
  })();

  // Validate text on mount
  useMemo(() => {
    validateText(text);
  }, [text]);

  const uppercaseText = text.toUpperCase();
  const totalLetters = uppercaseText.replace(/ /g, '').length;

  // Generate random transforms once per component instance (changes on reload)
  const transforms = useMemo(() => {
    return generateRandomTransforms(totalLetters);
  }, [totalLetters]);

  // Pre-calculate word groups with letter start indices
  const wordGroups = useMemo(() => {
    const words = uppercaseText.split(' ');
    const result: Array<{ word: string; start: number }> = [];
    let offset = 0;
    for (const word of words) {
      result.push({ word, start: offset });
      offset += word.length;
    }
    return result;
  }, [uppercaseText]);

  return (
    // Words can wrap to new lines, but letters within a word never break
    <div ref={ref} className={`flex items-center justify-center flex-wrap gap-y-1 p-4 ${className}`}>
      {wordGroups.map(({ word, start }, wordIndex) => (
        <React.Fragment key={`word-${wordIndex}`}>
          {/* Space between words */}
          {wordIndex > 0 && (
            <div style={{ width: `${responsiveLetterSize * 0.36}px`, flexShrink: 0 }} />
          )}
          {/* Letters within a word are never allowed to break to a new line */}
          <div className="flex items-center" style={{ flexShrink: 0 }}>
            {word.split('').map((char, charIndex) => {
              const currentLetterIdx = start + charIndex;
              const transform = transforms[currentLetterIdx];
              return (
                <ScrapbookLetter
                  key={`${char}-${wordIndex}-${charIndex}`}
                  letter={char as SupportedLetter}
                  rotation={transform.rotation}
                  offsetY={transform.offsetY}
                  letterIndex={currentLetterIdx}
                  zIndex={totalLetters - currentLetterIdx}
                  scale={transform.scale}
                  size={responsiveLetterSize}
                  letterClassName={letterClassName}
                  isVisible={playAnimationOnMount ? true : isVisible}
                  skipAnimation={playAnimationOnMount ? false : skipAnimation}
                />
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ScrapbookText;
