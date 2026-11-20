/** Who is signed in, and the way out. Lives in the admin's top bar. */
import { useCurrentAdmin } from '../../context/AuthContext';
import { useSignOut } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { SignOutIcon } from '../ui/SignOutIcon';

export function AccountMenu() {
  const { account } = useCurrentAdmin();
  const signOut = useSignOut();

  return (
    <div className="flex items-center gap-3">
      {account.avatarUrl && (
        <img src={account.avatarUrl} alt="" className="size-10 rounded-full border-[3px] border-yellow object-cover" />
      )}
      <span className="hidden font-display text-lg font-bold header:inline">
        <span className="sr-only">Signed in as </span>
        {account.name}
      </span>
      {/* Below the `header` breakpoint the button is just the icon, so it never wraps; the hidden text still names it. */}
      <Button
        variant="quiet"
        size="small"
        icon={<SignOutIcon />}
        title="Sign out"
        onClick={() => signOut.mutate()}
        disabled={signOut.isPending}
      >
        <span className="sr-only header:not-sr-only">{signOut.isPending ? 'Signing out…' : 'Sign out'}</span>
      </Button>
      {signOut.isError && (
        <p role="alert" className="text-sm font-medium text-orange">
          Sign-out didn't work. Try again.
        </p>
      )}
    </div>
  );
}
