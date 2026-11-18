/**
 * How each sign-in provider looks, and where "part of LCS" means on it. When execs keep only one provider,
 * removing the other is deleting its entry here and in `SIGN_IN_PROVIDERS`.
 */
import { type SimpleIcon, siDiscord, siNotion } from 'simple-icons';
import type { SignInProvider } from '../domain/access';
import type { ButtonVariant } from './Button';

type ProviderLook = Readonly<{
  label: string;
  icon: SimpleIcon;
  button: ButtonVariant;
  /** Where the visitor must belong, for messages like "we couldn't find you in ...". */
  community: string;
}>;

export const PROVIDERS: Readonly<Record<SignInProvider, ProviderLook>> = {
  discord: { label: 'Discord', icon: siDiscord, button: 'discord', community: 'the LCS Discord server' },
  notion: { label: 'Notion', icon: siNotion, button: 'notion', community: 'the LCS Notion workspace' },
};
