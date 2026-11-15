/**
 * ScrapbookText Component
 * Universal component for displaying text in scrapbook style using letter assets
 * Supports letters: A, C, D, E, F, G, H, I, K, L, M, N, O, P, R, S, T, U, V, W
 * 
 * Scroll-reveal animations: Letters start hidden (opacity: 0) and animate in once on appearance,
 * settling permanently without flickering, disappearing, or replaying on re-renders.
 */

import React, { useMemo, useState, useEffect } from 'react';
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
  letterIndex: number;
  isVisible: boolean;
}

const ScrapbookLetter: React.FC<ScrapbookLetterProps> = React.memo(({
  letter,
  rotation,
  offsetY,
  scale,
  zIndex,
  size,
  letterClassName,
  letterIndex,
  isVisible,
}) => {
  const [isSettled, setIsSettled] = useState(false);
  const assetPath = letterAssets[letter];
  const staggerDelay = letterIndex * 60; // 60ms stagger between letters

  // Safety fallback to settle animation even if onAnimationEnd doesn't fire
  useEffect(() => {
    if (isVisible && !isSettled) {
      const timer = setTimeout(() => {
        setIsSettled(true);
      }, staggerDelay + 750);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isSettled, staggerDelay]);

  // Entrance animation logic:
  // - Settled: 'none' (stays permanent at opacity 1)
  // - Visible & not settled: play 'scrapbookLetterAppear' with forwards fill-mode
  // - Not yet visible: 'none' (kept at opacity 0 to prevent flash before animation)
  const animationStyle = isSettled
    ? 'none'
    : isVisible
      ? `scrapbookLetterAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${staggerDelay}ms forwards`
      : 'none';

  const opacityStyle = isSettled ? 1 : isVisible ? undefined : 0;

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
        onAnimationEnd={() => setIsSettled(true)}
        style={{
          animation: animationStyle,
          opacity: opacityStyle,
        }}
      >
        <img
          src={assetPath}
          alt={letter}
          loading="eager"
          decoding="async"
          className={`object-contain drop-shadow-lg hover:drop-shadow-xl transition-shadow ${letterClassName || ''}`}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      </div>
    </div>
  );
});

ScrapbookLetter.displayName = 'ScrapbookLetter';

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
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Observer for scroll-reveal animation (once: true retains visibility permanently)
  const { ref, isVisible: isObserverVisible } = useIntersectionObserver({
    rootMargin: '60px',
    threshold: 0.05,
    once: true,
  });

  const isVisible = playAnimationOnMount || isObserverVisible;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive letter size with sm breakpoint
  const responsiveLetterSize = (() => {
    if (windowWidth < 640) {
      return mobileLetterSize ?? Math.round(letterSize * 0.45);
    }
    if (windowWidth < 768) {
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

  // Generate random transforms once per component instance
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
              const transform = transforms[currentLetterIdx] ?? { rotation: 0, offsetY: 0, scale: 1 };
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
                  isVisible={isVisible}
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
