/**
 * The Team section as a crew board: everyone on the team, hidden members included, as lanyard badges under
 * their department, in the site's order. It counts the crew, links to adding someone, and on each badge shows or
 * hides them on the site, edits or deletes them.
 */
import { Plus, RotateCw } from 'lucide-react';
import { DOODLES } from '../assets/brand';
import { DepartmentHeading } from '../components/team/DepartmentHeading';
import { MemberBadge } from '../components/team/MemberBadge';
import { Button } from '../components/ui/Button';
import { ButtonLink } from '../components/ui/ButtonLink';
import { ScrapbookWord } from '../components/ui/ScrapbookWord';
import { StateBlock } from '../components/ui/StateBlock';
import { useTeam } from '../hooks/useTeam';
import { messageFor } from '../lib/errors';
import { PATHS } from '../paths';
import { groupByDepartment, type TeamMember } from '../types/team';

export function TeamPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1>
            <ScrapbookWord word="Team" className="text-hero" />
          </h1>
          <img src={DOODLES.asterisk} alt="" className="hidden h-10 w-auto sm:block" />
        </div>
        <AddMemberLink />
      </div>
      <div className="mt-6">
        <TeamResults />
      </div>
    </main>
  );
}

/** The crew by department, or why it isn't shown: still loading, failed, or nobody yet. */
function TeamResults() {
  const team = useTeam();

  switch (team.status) {
    case 'pending':
      return <CrewBoardSkeleton />;
    case 'error':
      return (
        <StateBlock
          tone="failed"
          mascot="doug"
          title={messageFor(team.error)}
          body="Check your connection, then try again. Nothing was changed."
          action={
            <Button variant="primary" size="small" icon={<RotateCw aria-hidden="true" className="size-4" />} onClick={() => void team.refetch()}>
              Try again
            </Button>
          }
        />
      );
    case 'success': {
      if (team.data.length === 0) {
        return (
          <StateBlock
            tone="calm"
            mascot="krill"
            title="No team members yet."
            body="The first one you add will show up here."
            action={<AddMemberLink />}
          />
        );
      }
      const groups = groupByDepartment(team.data);
      return (
        <>
          <p className="font-display text-xs font-bold tracking-widest text-text-2 uppercase">{countLine(team.data, groups.length)}</p>
          <div className="mt-8 grid gap-10">
            {groups.map(({ department, members }, index) => (
              <section key={department ?? 'none'} aria-label={department ?? 'No department'}>
                <DepartmentHeading
                  name={department ?? 'No department'}
                  index={index}
                  crew={members.length}
                  hidden={members.filter((member) => !member.isPublic).length}
                />
                <ul className="mt-4 grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] sm:gap-5">
                  {members.map((member, place) => (
                    <MemberBadge key={member.id} member={member} index={place} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      );
    }
  }
}

/** "15 crew · 7 departments · 2 hidden from the site". */
function countLine(members: readonly TeamMember[], departments: number): string {
  const hidden = members.filter((member) => !member.isPublic).length;
  const parts = [`${members.length} crew`, `${departments} ${departments === 1 ? 'department' : 'departments'}`];
  return [...parts, ...(hidden > 0 ? [`${hidden} hidden from the site`] : [])].join(' · ');
}

/** Grey badges in the shape of the real ones, shown while the team loads. */
function CrewBoardSkeleton() {
  return (
    <div role="status" aria-label="Loading the team" aria-busy="true" className="grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] sm:gap-5">
      {[0, 1, 2, 3].map((badge) => (
        <div key={badge} className="animate-pulse overflow-hidden rounded-card bg-card motion-reduce:animate-none">
          <div className="hidden h-11 bg-slate sm:block" />
          <div className="flex items-center gap-3 p-4 sm:flex-col sm:p-6">
            <div className="size-14 shrink-0 rounded-full bg-slate sm:size-21" />
            <div className="grid flex-1 gap-2 sm:w-full sm:justify-items-center">
              <div className="h-4 w-2/3 rounded-full bg-slate" />
              <div className="h-3 w-1/2 rounded-full bg-slate" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddMemberLink() {
  return (
    <ButtonLink to={PATHS.newMember} variant="primary" size="small" icon={<Plus aria-hidden="true" className="size-4" />}>
      Add member
    </ButtonLink>
  );
}
