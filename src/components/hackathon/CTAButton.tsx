import type { LinkConfig } from './hackathonData';

interface CTAButtonProps {
  link: LinkConfig;
  isPrimary?: boolean;
}

export function CTAButton({ link, isPrimary }: CTAButtonProps) {
  const baseClasses = `hack-cta inline-flex items-center justify-center rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold border transition-all duration-400 ${
    isPrimary
      ? 'bg-(--color-accent-yellow) text-slate-900 border-(--color-accent-yellow)'
      : 'bg-white/10 text-white border-white/35 backdrop-blur-md'
  }`;

  if (!link.enabled) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={true}
          className={`${baseClasses} cursor-not-allowed opacity-70`}
          style={{ fontFamily: 'var(--font-dosis)' }}
        >
          {link.disabledLabel ?? `${link.label} (Coming Soon)`}
        </button>
        {link.helperText && (
          <p className="text-xs text-white/70 max-w-52" style={{ fontFamily: 'var(--font-montserrat)' }}>
            {link.helperText}
          </p>
        )}
      </div>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
      className={baseClasses}
      style={{ fontFamily: 'var(--font-dosis)' }}
    >
      {link.label}
    </a>
  );
}
