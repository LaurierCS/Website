interface CountdownStatProps {
  label: string;
  value: number;
}

export function CountdownStat({ label, value }: CountdownStatProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/8 backdrop-blur-md px-3 sm:px-4 py-3 text-center min-w-17 sm:min-w-20 hack-hover-card">
      <p className="text-2xl md:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: 'var(--font-dosis)' }}>
        {String(value).padStart(2, '0')}
      </p>
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">{label}</p>
    </div>
  );
}
