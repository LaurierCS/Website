/**
 * Full-screen loading moment: the LCS icon hops like it is waiting its turn, instead of a grey spinner.
 */
import { motion } from 'motion/react';
import { ICON_WHITE } from '../../assets/brand';

export function Loader({ label }: { label: string }) {
  return (
    <div role="status" className="grid min-h-dvh place-items-center content-center gap-6">
      <motion.img
        src={ICON_WHITE}
        alt=""
        className="size-16"
        animate={{ y: [0, -18, 0], scaleY: [1, 1.06, 0.9, 1], rotate: [0, -6, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <p className="font-display text-lg font-semibold tracking-wide text-text-2">{label}</p>
    </div>
  );
}
