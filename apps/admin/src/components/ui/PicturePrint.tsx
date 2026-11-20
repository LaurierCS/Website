/**
 * A picture shown as a taped photo print. With `settle`, it is laid down as it appears, so a newly chosen
 * picture visibly lands in the form. With reduced motion it only fades in.
 */
import { motion } from 'motion/react';

type PicturePrintProps = {
  url: string;
  alt: string;
  settle: boolean;
};

export function PicturePrint({ url, alt, settle }: PicturePrintProps) {
  return (
    <motion.div
      // A new key per picture, so choosing another one settles again.
      key={url}
      initial={settle ? { opacity: 0, y: -24, scale: 1.06 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      className="relative w-fit rounded-sm bg-paper px-2.5 pt-2.5 pb-7 shadow-(--shadow-print)"
    >
      <span aria-hidden="true" className="absolute -top-2 left-1/2 h-5 w-18 -translate-x-1/2 bg-yellow/90" />
      <img src={url} alt={alt} className="h-47 w-37.5 object-cover" />
    </motion.div>
  );
}
