/**
 * The event form's job sheet at the LCS Print Shop: a sign with one line on what saving does, a tag saying
 * whether the event is on the site, and the fields below as `children`.
 */
import type { ReactNode } from 'react';
import { Tag, type TagTone } from '../ui/Tag';

type PrintShopSheetProps = {
  /** One line under the sign, e.g. what saving does. */
  intro: string;
  status: { label: string; tone: TagTone };
  children: ReactNode;
};

export function PrintShopSheet({ intro, status, children }: PrintShopSheetProps) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-slate">
      <div className="flex items-start justify-between gap-3 border-b border-line bg-titlebar px-5 py-4.5 sm:px-8 sm:py-5.5">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-widest text-yellow uppercase sm:text-3xl">LCS Print Shop</p>
          <p className="mt-1 text-sm font-medium">{intro}</p>
        </div>
        <Tag tone={status.tone}>{status.label}</Tag>
      </div>
      <div className="px-5 pt-5 pb-6 sm:px-8 sm:pt-6 sm:pb-8">{children}</div>
    </div>
  );
}
