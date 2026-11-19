/**
 * What the backstage pass says in each login state. These only render: the login page picks the panel and
 * passes the actions in.
 */
import { motion } from 'motion/react';
import { type Account, firstName, PROVIDERS, SIGN_IN_PROVIDERS, type SignInProvider } from '../../types/auth';
import { Button } from '../ui/Button';
import { ProviderLogo } from '../ui/ProviderLogo';

function Title({ children }: { children: string }) {
  return <h2 className="text-3xl font-extrabold text-ink">{children}</h2>;
}

function Body({ children }: { children: string }) {
  return <p className="mt-3 text-base leading-relaxed text-ink-2">{children}</p>;
}

function Problem({ children }: { children: string }) {
  return (
    <p role="alert" className="mt-4 rounded-xl bg-orange/25 px-4 py-2.5 text-sm font-medium text-orange-ink">
      {children}
    </p>
  );
}

type SignedOutPanelProps = {
  onSignIn: (provider: SignInProvider) => void;
  /** The provider the browser is on its way to, once a button is pressed. */
  signingInWith: SignInProvider | undefined;
  signInFailed: boolean;
  /** Tells the pass the visitor is reaching for a button, so the mascot can perk up. */
  onReach: (reaching: boolean) => void;
};

export function SignedOutPanel({ onSignIn, signingInWith, signInFailed, onReach }: SignedOutPanelProps) {
  return (
    <>
      <Title>Execs only beyond this point.</Title>
      <Body>Sign in with Discord or Notion. Anyone in the LCS Discord server or the LCS Notion workspace can come in.</Body>
      <div className="mt-6 grid gap-4">
        {SIGN_IN_PROVIDERS.map((provider) => {
          const { label } = PROVIDERS[provider];
          return (
            <Button
              key={provider}
              variant={provider}
              icon={<ProviderLogo provider={provider} />}
              className="w-full"
              onClick={() => onSignIn(provider)}
              disabled={signingInWith !== undefined}
              aria-busy={signingInWith === provider}
              onHoverStart={() => onReach(true)}
              onHoverEnd={() => onReach(false)}
              onFocus={() => onReach(true)}
              onBlur={() => onReach(false)}
            >
              {signingInWith === provider ? `Opening ${label}…` : `Continue with ${label}`}
            </Button>
          );
        })}
      </div>
      {signInFailed && <Problem>That sign-in didn't open. Try again in a moment.</Problem>}
    </>
  );
}

export function CheckingPanel() {
  return (
    <div role="status">
      <Title>Checking your pass…</Title>
      <Body>Looking you up in the LCS community.</Body>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
        <motion.div
          className="h-full w-1/3 rounded-full bg-blue"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

type NotMemberPanelProps = {
  account: Account;
  onCheckAgain: () => void;
  onSignOut: () => void;
  busy: boolean;
  actionFailed: boolean;
};

export function NotMemberPanel({ account, onCheckAgain, onSignOut, busy, actionFailed }: NotMemberPanelProps) {
  return (
    <>
      <Title>{`Hey ${firstName(account)}, you're not on the list (yet).`}</Title>
      <Body>{`You're not in ${PROVIDERS[account.provider].community} yet. Think that's wrong? Ask a VP of Eng.`}</Body>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" onClick={onCheckAgain} disabled={busy}>
          Check again
        </Button>
        <Button variant="ghost" onClick={onSignOut} disabled={busy}>
          Sign out
        </Button>
      </div>
      {actionFailed && <Problem>That didn't work. Try once more in a moment.</Problem>}
    </>
  );
}

type ExpiredPanelProps = {
  account: Account;
  onRenew: () => void;
  onSignOut: () => void;
  busy: boolean;
  actionFailed: boolean;
};

/** A member whose 7-day pass ran out. Nothing says they left LCS, so this asks them to renew, not to join. */
export function ExpiredPanel({ account, onRenew, onSignOut, busy, actionFailed }: ExpiredPanelProps) {
  const { label } = PROVIDERS[account.provider];
  return (
    <>
      <Title>{`Your pass ran out, ${firstName(account)}.`}</Title>
      <Body>{`Passes last 7 days. Sign in with ${label} again and we'll check you're still in ${PROVIDERS[account.provider].community}.`}</Body>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant={account.provider} icon={<ProviderLogo provider={account.provider} />} onClick={onRenew} disabled={busy}>
          {`Renew with ${label}`}
        </Button>
        <Button variant="ghost" onClick={onSignOut} disabled={busy}>
          Sign out
        </Button>
      </div>
      {actionFailed && <Problem>That didn't work. Try once more in a moment.</Problem>}
    </>
  );
}

type JammedPanelProps = {
  /** What went wrong, already safe to show. */
  message: string;
  onRetry: () => void;
  /** Starting over clears a session that may be the cause, e.g. one signed in without the right permissions. */
  onSignOut: () => void;
  signingOut: boolean;
};

export function JammedPanel({ message, onRetry, onSignOut, signingOut }: JammedPanelProps) {
  return (
    <>
      <div role="alert">
        <Title>The door's jammed.</Title>
        <Body>{`${message} Wait a minute and try again. If it keeps happening, sign out and sign back in.`}</Body>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="primary" onClick={onRetry} disabled={signingOut}>
          Try again
        </Button>
        <Button variant="ghost" onClick={onSignOut} disabled={signingOut}>
          {signingOut ? 'Signing out…' : 'Sign out'}
        </Button>
      </div>
    </>
  );
}

export function GrantedPanel({ account }: { account: Account }) {
  return (
    <div role="status">
      <Title>{`Welcome back, ${firstName(account)}.`}</Title>
      <Body>Your pass checks out. Taking you in…</Body>
    </div>
  );
}
