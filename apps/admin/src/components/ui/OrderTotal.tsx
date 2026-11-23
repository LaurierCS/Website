/** The total line at the foot of a print order, like "To print · 2 new · 2 updated". */
export function OrderTotal({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-3 font-display text-base font-extrabold uppercase">
      {label}
      <span className="normal-case">{value}</span>
    </p>
  );
}
