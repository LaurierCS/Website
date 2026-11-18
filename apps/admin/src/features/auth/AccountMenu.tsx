/**
 * Who is signed in, and the way out. Lives in the admin's top bar.
 */
import { useCurrentAdmin } from '../../app/current-admin';
import { Button } from '../../ui/Button';
import { useSignOut } from './use-access';

export function AccountMenu() {
  const { account } = useCurrentAdmin();
  const signOut = useSignOut();

  return (
    <div className="flex items-center gap-3">
      {account.avatarUrl && (
        <img src={account.avatarUrl} alt="" className="size-10 rounded-full border-[3px] border-yellow object-cover" />
      )}
      <span className="hidden font-display text-lg font-bold sm:inline">{account.name}</span>
      <Button variant="quiet" className="px-4 py-2 text-base" onClick={() => signOut.mutate()} disabled={signOut.isPending}>
        {signOut.isPending ? 'Signing out…' : 'Sign out'}
      </Button>
      {signOut.isError && (
        <p role="alert" className="text-sm font-medium text-orange">
          Sign-out didn't work. Try again.
        </p>
      )}
    </div>
  );
}
