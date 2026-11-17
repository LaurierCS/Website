/**
 * ScrapbookText - Renders text using scrapbook letter assets
 * Supported letters: A C D E F G H I K L M N O P R S T U V W
 * Falls back to normal text for unsupported characters
 */
import React, { useMemo, useState, useEffect } from 'react';

interface ScrapbookTextProps {
  text: string;
  letterSize?: number;
  className?: string;
}

const SUPPORTED_LETTERS = [
  'A',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
];

const letterAssets: Record<string, string> = {
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
 * Generate random transforms for scrapbook effect
 */
const generateRandomTransforms = (count: number) => {
  return Array.from({ length: count }, () => ({
    rotation: Math.random() * 6 - 3,
    offsetY: Math.random() * 2 - 1,
    scale: Math.random() * 0.04 + 0.98,
  }));
};

/**
 * ScrapbookLetter - Individual letter with scrapbook styling
 */
interface ScrapbookLetterProps {
  letter: string;
  size: number;
  rotation: number;
  offsetY: number;
  scale: number;
}

const ScrapbookLetter: React.FC<ScrapbookLetterProps> = ({
  letter,
  size,
  rotation,
  offsetY,
  scale,
}) => {
  if (!SUPPORTED_LETTERS.includes(letter.toUpperCase())) {
    // Unsupported letter: return as text
    return <span style={{ fontSize: `${size}px`, fontWeight: '700' }}>{letter}</span>;
  }

  const asset = letterAssets[letter.toUpperCase()];
  return (
    <img
      src={asset}
      alt={letter}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg) translateY(${offsetY}px) scale(${scale})`,
        display: 'inline-block',
        marginRight: `${-size * 0.45}px`,
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
      }}
      className="transition-shadow hover:drop-shadow-lg"
    />
  );
};

/**
 * ScrapbookText - Main component
 */
export const ScrapbookText: React.FC<ScrapbookTextProps> = ({
  text,
  letterSize = 112,
  className = '',
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive sizing
  const responsiveSize = useMemo(() => {
    if (windowWidth < 640) return Math.round(letterSize * 0.45);
    if (windowWidth < 768) return Math.round(letterSize * 0.65);
    return letterSize;
  }, [windowWidth, letterSize]);

  const uppercaseText = text.toUpperCase();
  const totalLetters = uppercaseText.replace(/ /g, '').length;

  const transforms = useMemo(() => {
    return generateRandomTransforms(totalLetters);
  }, [totalLetters]);

  const words = uppercaseText.split(' ');
  let letterIndex = 0;

  return (
    <div className={`flex items-center justify-center flex-wrap gap-y-1 ${className}`}>
      {words.map((word, wordIdx) => (
        <React.Fragment key={`word-${wordIdx}`}>
          {wordIdx > 0 && <div style={{ width: `${responsiveSize * 0.36}px` }} />}
          <div className="flex items-center" style={{ flexShrink: 0 }}>
            {word.split('').map((char, charIdx) => {
              const currentLetterIdx = letterIndex;
              letterIndex++;
              const transform = transforms[currentLetterIdx] || { rotation: 0, offsetY: 0, scale: 1 };

              return (
                <ScrapbookLetter
                  key={`${char}-${wordIdx}-${charIdx}`}
                  letter={char}
                  size={responsiveSize}
                  rotation={transform.rotation}
                  offsetY={transform.offsetY}
                  scale={transform.scale}
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
