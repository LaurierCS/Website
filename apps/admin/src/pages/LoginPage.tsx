/**
 * The admin's front door. One backstage pass shows whatever the login is doing: two ways in (Discord, Notion),
 * the check, "not on the list", a failed check, or an "Access granted" stamp straight through to the dashboard.
 */
import { motion } from 'motion/react';
import { type ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';
import { DOODLES } from '../assets/brand';
import { BackstagePass } from '../components/auth/BackstagePass';
import { CheckingPanel, GrantedPanel, JammedPanel, NotMemberPanel, SignedOutPanel } from '../components/auth/LoginPanels';
import { Stamp } from '../components/auth/Stamp';
import { useAccess, useSignIn, useSignOut } from '../hooks/useAuth';
import { useMinimumWait } from '../hooks/useMinimumWait';
import { messageFor } from '../lib/errors';
import { PATHS } from '../paths';

// A signed-in visitor's check often finishes in a blink; holding it briefly lets them see the pass being
// checked. Someone signed out has nothing to check, so they get the sign-in buttons straight away.
const CHECKING_MIN_MS = 500;

export function LoginPage() {
  const access = useAccess();
  const signIn = useSignIn();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [reaching, setReaching] = useState(false);
  const checkedLongEnough = useMinimumWait(CHECKING_MIN_MS);

  function renderPass(): ReactNode {
    const signedOut = access.isSuccess && access.data.kind === 'signed_out';
    if (access.isPending || (!checkedLongEnough && !signedOut)) {
      return (
        <BackstagePass mascot="krill" mascotUp={false}>
          <CheckingPanel />
        </BackstagePass>
      );
    }

    if (access.isError) {
      return (
        <BackstagePass mascot="coco" mascotUp={false}>
          <JammedPanel
            message={messageFor(access.error)}
            onRetry={() => void access.refetch()}
            onSignOut={() => signOut.mutate()}
            signingOut={signOut.isPending}
          />
        </BackstagePass>
      );
    }

    switch (access.data.kind) {
      case 'signed_out':
        return (
          <BackstagePass mascot="krill" mascotUp={reaching || signIn.isPending}>
            <SignedOutPanel
              onSignIn={(provider) => signIn.mutate(provider)}
              signingInWith={signIn.isPending ? signIn.variables : undefined}
              signInFailed={signIn.isError}
              onReach={setReaching}
            />
          </BackstagePass>
        );
      case 'not_member': {
        const { account } = access.data;
        return (
          <BackstagePass mascot="doug" mascotUp={false} stamp={<Stamp text="Not on the list" tone="denied" />}>
            <NotMemberPanel
              account={account}
              onCheckAgain={() => signIn.mutate(account.provider)}
              onSignOut={() => signOut.mutate()}
              busy={signIn.isPending || signOut.isPending}
              actionFailed={signIn.isError || signOut.isError}
            />
          </BackstagePass>
        );
      }
      case 'admin':
        return (
          <BackstagePass
            mascot="krill"
            mascotUp
            stamp={<Stamp text="Access granted" tone="granted" onStamped={() => navigate(PATHS.home, { replace: true })} />}
          >
            <GrantedPanel account={access.data.account} />
          </BackstagePass>
        );
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pb-12 pt-[18vh] sm:pt-[14vh]">
      <Doodles />
      {renderPass()}
      <p className="mt-10 max-w-sm text-center text-base font-light leading-relaxed text-text-2">
        Backstage at the Laurier Computing Society. Everything on{' '}
        <a href="https://lauriercs.org" className="font-semibold text-pink underline-offset-4 hover:underline">
          lauriercs.org
        </a>{' '}
        gets updated from here.
      </p>
    </main>
  );
}

/** Brand doodles drifting around the pass, so the page feels like a scrapbook rather than a form. */
function Doodles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.img
        src={DOODLES.asterisk}
        alt=""
        className="absolute left-[8%] top-[22%] w-14 sm:w-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      />
      <motion.img
        src={DOODLES.bracket}
        alt=""
        className="absolute bottom-[14%] right-[9%] w-12 rotate-12 sm:w-16"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.img
        src={DOODLES.asterisk}
        alt=""
        className="absolute bottom-[26%] left-[14%] hidden w-8 opacity-70 md:block"
        animate={{ rotate: -360 }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
