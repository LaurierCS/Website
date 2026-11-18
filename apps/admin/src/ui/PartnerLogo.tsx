/**
 * A partner's logo (Discord, Notion) from Simple Icons, drawn in the current text colour. Decorative: the
 * button or link next to it names the partner.
 */
import type { SimpleIcon } from 'simple-icons';

export function PartnerLogo({ icon, className = '' }: { icon: SimpleIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`size-6 shrink-0 fill-current ${className}`}>
      <path d={icon.path} />
    </svg>
  );
}
