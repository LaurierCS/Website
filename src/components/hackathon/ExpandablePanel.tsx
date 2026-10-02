import { useState, type ReactNode } from 'react';

interface ExpandablePanelProps {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function ExpandablePanel({ title, subtitle, defaultOpen = false, children }: ExpandablePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="hack-accordion rounded-2xl border border-white/15 bg-white/6 backdrop-blur-md overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full px-4 sm:px-5 py-4 text-left flex items-center justify-between gap-3"
        aria-expanded={open}
      >
        <div>
          <p className="text-base sm:text-lg text-white font-semibold" style={{ fontFamily: 'var(--font-dosis)' }}>
            {title}
          </p>
          {subtitle && (
            <p className="text-xs sm:text-sm text-white/65 mt-1" style={{ fontFamily: 'var(--font-montserrat)' }}>
              {subtitle}
            </p>
          )}
        </div>
        <span className={`text-xl text-white/80 shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} aria-hidden="true">
          +
        </span>
      </button>

      <div className={`hack-panel-grid ${open ? 'hack-panel-grid-open' : ''}`}>
        <div className="hack-panel-content px-4 sm:px-5 pb-5">
          {children}
        </div>
      </div>
    </div>
  );
}
