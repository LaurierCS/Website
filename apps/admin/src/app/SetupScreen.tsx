/**
 * Shown instead of the app when its configuration is missing or broken, so a fresh checkout explains itself
 * rather than rendering a blank page. The message names variables, never their values.
 */
import { MASCOTS } from '../ui/brand-assets';

export function SetupScreen({ problem }: { problem: string }) {
  return (
    <main className="mx-auto grid min-h-dvh max-w-2xl content-center gap-6 px-4 py-16">
      <img src={MASCOTS.doug} alt="" className="h-32 w-auto self-start justify-self-start -rotate-6" />
      <h1 className="text-5xl font-extrabold">The admin isn't set up yet.</h1>
      <p className="text-lg font-light text-text-2">
        It needs its Supabase settings before it can open the door. Copy{' '}
        <code className="rounded bg-card px-1.5 py-0.5 text-yellow">apps/admin/.env.example</code> to{' '}
        <code className="rounded bg-card px-1.5 py-0.5 text-yellow">apps/admin/.env</code>, fill in the values (ask a
        VP of Engineering), and restart the dev server.
      </p>
      <pre role="alert" className="overflow-x-auto rounded-card border-2 border-line bg-card p-5 text-sm text-text-2">
        {problem}
      </pre>
    </main>
  );
}
