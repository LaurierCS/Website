/**
 * A form's sheet under a shop sign, like the event form's "LCS Print Shop" or the team form's "LCS Crew Office":
 * the sign in an accent colour, one line on what saving does, a tag saying where the thing stands, and the fields
 * below as `children`.
 */
import type { ReactNode } from 'react';
import type { Accent } from '../../lib/ui/accents';
import { ACCENT_TEXT } from './accent-styles';
import { Tag, type TagTone } from './Tag';

type SignedSheetProps = {
  /** The shop's name on the sign, e.g. "LCS Print Shop". */
  sign: string;
  accent: Accent;
  /** One line under the sign, e.g. what saving does. */
  intro: string;
  status: { label: string; tone: TagTone };
  children: ReactNode;
};

export function SignedSheet({ sign, accent, intro, status, children }: SignedSheetProps) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-slate">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line bg-titlebar px-5 py-4.5 sm:px-8 sm:py-5.5">
        <div>
          <p className={`font-display text-2xl font-extrabold tracking-widest uppercase sm:text-3xl ${ACCENT_TEXT[accent]}`}>{sign}</p>
          <p className="mt-1 text-sm font-medium">{intro}</p>
        </div>
        <Tag tone={status.tone}>{status.label}</Tag>
      </div>
      <div className="px-5 pt-5 pb-6 sm:px-8 sm:pt-6 sm:pb-8">{children}</div>
    </div>
  );
}
