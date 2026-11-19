/**
 * A word spelled in the LCS scrapbook letters. Each letter drops onto the page like a cut-out being pasted
 * down, at its own slight angle, and wobbles when you hover it.
 */
import { motion } from 'motion/react';
import { SCRAPBOOK_LETTERS } from '../../assets/brand';

// Fixed angles instead of Math.random(), so a word looks the same on every render and in every test.
const TILTS = [-7, 5, -3, 8, -5, 4, -8, 6];

type ScrapbookWordProps = {
  /** Upper-case letters that all have scrapbook images; anything else falls back to plain text. */
  word: string;
  className?: string;
};

export function ScrapbookWord({ word, className = '' }: ScrapbookWordProps) {
  const letters = [...word.toUpperCase()];
  const urls = letters.map((letter) => SCRAPBOOK_LETTERS.get(letter));

  if (urls.some((url) => url === undefined)) {
    return <span className={`font-display font-extrabold uppercase ${className}`}>{word}</span>;
  }

  return (
    <span role="img" aria-label={word} className={`inline-flex items-end ${className}`}>
      {letters.map((letter, index) => {
        const tilt = TILTS[index % TILTS.length] ?? 0;
        return (
          <motion.img
            key={`${letter}-${index}`}
            src={urls[index]}
            alt=""
            draggable={false}
            className="-mx-[0.04em] h-[1em] w-auto select-none drop-shadow-(--shadow-cutout)"
            initial={{ y: '-120%', rotate: tilt * 3, opacity: 0 }}
            animate={{ y: 0, rotate: tilt, opacity: 1 }}
            whileHover={{ rotate: [tilt, -tilt, tilt], y: -6, transition: { duration: 0.4 } }}
            transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.15 + index * 0.06 }}
          />
        );
      })}
    </span>
  );
}
