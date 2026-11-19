/**
 * Shown instead of the admin when its `.env` is missing or wrong, so a fresh checkout explains itself instead of
 * showing a blank page. The message names variables, never their values.
 */
import { MASCOTS } from '../assets/brand';

export function SetupPage({ problem }: { problem: string }) {
  return (
    <main className="mx-auto grid min-h-dvh max-w-2xl content-center gap-6 px-4 py-16">
      <img src={MASCOTS.doug} alt="" className="h-32 w-auto self-start justify-self-start -rotate-6" />
      <h1 className="text-5xl font-extrabold">The admin isn't set up yet.</h1>
      <p className="text-lg font-light text-text-2">
        It needs its Supabase settings before it can open the door. Copy{' '}
        <code className="rounded bg-card px-1.5 py-0.5 text-yellow">apps/admin/.env.example</code> to{' '}
        <code className="rounded bg-card px-1.5 py-0.5 text-yellow">apps/admin/.env</code>, fill in{' '}
        <code className="rounded bg-card px-1.5 py-0.5 text-yellow">DATABASE_URL</code> and{' '}
        <code className="rounded bg-card px-1.5 py-0.5 text-yellow">DATABASE_KEY</code> (ask a VP of Engineering), and
        restart the dev server.
      </p>
      <pre role="alert" className="overflow-x-auto rounded-card border-2 border-line bg-card p-5 text-sm text-text-2">
        {problem}
      </pre>
    </main>
  );
}
