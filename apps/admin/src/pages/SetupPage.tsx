/**
 * Shown instead of the admin when its `.env` is missing or wrong, so a fresh checkout explains itself instead of
 * showing a blank page. The message names variables, never their values.
 */
export function SetupPage({ problem }: { problem: string }) {
  return (
    <main>
      <h1>The admin isn't set up yet</h1>
      <p>
        Copy <code>apps/admin/.env.example</code> to <code>apps/admin/.env</code>, fill in the Supabase URL and anon
        key (ask a VP of Engineering), and restart the dev server.
      </p>
      <pre role="alert">{problem}</pre>
    </main>
  );
}
