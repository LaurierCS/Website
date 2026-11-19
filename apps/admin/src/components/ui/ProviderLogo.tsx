/**
 * A sign-in provider's logo (Discord, Notion) from Simple Icons, drawn in the current text colour. Decorative:
 * the button next to it names the provider.
 */
import { type SimpleIcon, siDiscord, siNotion } from 'simple-icons';
import type { SignInProvider } from '../../types/auth';

const ICONS: Readonly<Record<SignInProvider, SimpleIcon>> = { discord: siDiscord, notion: siNotion };

export function ProviderLogo({ provider }: { provider: SignInProvider }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 shrink-0 fill-current">
      <path d={ICONS[provider].path} />
    </svg>
  );
}
