/**
 * The print order for a CSV import: a till receipt from the LCS Print Shop with the file's name on it. What it
 * lists (the rows, or the problems) and its buttons go in `children`. A `stamp` lands on it when the order comes
 * back, like "Sent back".
 */
import type { ReactNode } from 'react';
import { OrderRule } from './OrderRule';
import { Stamp } from './Stamp';

type PrintOrderProps = {
  fileName: string;
  stamp?: string;
  children: ReactNode;
};

export function PrintOrder({ fileName, stamp, children }: PrintOrderProps) {
  return (
    <section aria-label="Print order" className="relative grid gap-3.5 rounded-t-md bg-receipt px-6 pt-6 pb-7 text-ink shadow-(--shadow-cutout)">
      <header className="text-center font-display">
        <p className="text-xl font-extrabold tracking-wider uppercase">LCS Print Shop</p>
        <p className="text-xs font-bold tracking-widest text-ink-2 uppercase">Print order</p>
      </header>
      <OrderRule />
      <p className="font-display text-base font-extrabold break-all">{fileName}</p>
      {stamp && (
        <div className="absolute top-20 right-3">
          <Stamp text={stamp} tone="denied" />
        </div>
      )}
      {children}
    </section>
  );
}
