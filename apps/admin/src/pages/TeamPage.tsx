/**
 * The Team section: everyone on the team, hidden members included, grouped by department, with a link to add
 * someone and, on each person, showing or hiding them on the site, editing and deleting.
 */
import { Link } from 'react-router';
import { MemberCard } from '../components/team/MemberCard';
import { Button } from '../components/ui/Button';
import { useTeam } from '../hooks/useTeam';
import { messageFor } from '../lib/errors';
import { PATHS } from '../paths';
import { groupByDepartment } from '../types/team';

export function TeamPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-hero font-extrabold">Team</h1>
        <Link
          to={PATHS.newMember}
          className="inline-flex min-h-11 items-center rounded-full bg-pink px-6 font-display text-lg font-bold text-ink"
        >
          Add member
        </Link>
      </div>
      <div className="mt-8">
        <TeamResults />
      </div>
    </main>
  );
}

/** The team by department, or why it isn't shown: still loading, failed, or nobody yet. */
function TeamResults() {
  const team = useTeam();

  switch (team.status) {
    case 'pending':
      return (
        <div role="status" aria-label="Loading the team" className="grid gap-3">
          {[0, 1, 2].map((row) => (
            <div key={row} className="h-24 animate-pulse rounded-card bg-card motion-reduce:animate-none" />
          ))}
        </div>
      );
    case 'error':
      return (
        <div role="alert">
          <p className="text-text-2">{messageFor(team.error)}</p>
          <Button variant="quiet" className="mt-4 px-4 py-2 text-base" onClick={() => void team.refetch()}>
            Try again
          </Button>
        </div>
      );
    case 'success':
      if (team.data.length === 0) {
        return <p className="text-text-2">No team members yet. The first one you add will show up here.</p>;
      }
      return (
        <div className="grid gap-10">
          {groupByDepartment(team.data).map(({ department, members }) => (
            <section key={department ?? 'none'} aria-label={department ?? 'No department'}>
              <h2 className="font-display text-2xl font-extrabold">{department ?? 'No department'}</h2>
              <ul className="mt-3 grid gap-3">
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      );
  }
}
