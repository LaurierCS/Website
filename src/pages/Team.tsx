import { useCache } from '../hooks/useCache';
import { supabase } from '../services/supabase';
import { TeamCard } from '../components/team/TeamCard';
import { ScrapbookText } from '../components/universal/ScrapbookText';
import { DEPARTMENTS, getDepartmentFromRole, getRoleHierarchy, type Department } from '../utils/departmentMap';

/**
 * Team Page with Department-Based Grouping
 * Displays all public team members grouped by their department
 * Each department has its own section with a header and member grid
 */

interface TeamMember {
  id: string;
  name: string;
  picture_url: string;
  role?: string;
  github_url?: string;
  linkedin_url?: string;
}

export function TeamSection() {
  const [teamMembers, loading, error] = useCache<TeamMember[]>(
    'team_cache',
    async () => {
      const { data, error: sbError } = await supabase
        .from('team')
        .select('id, name, role, picture_url, github_url, linkedin_url')
        .eq('is_public', true);

      if (sbError) throw sbError;
      return (data as TeamMember[]) ?? [];
    }
  );

  /**
   * Groups team members by their department based on role mapping
   * Returns an object with departments as keys and arrays of members as values
   * Members within each department are sorted by hierarchy (President → EVP → VP → Director)
   */
  const groupMembersByDepartment = (): Record<Department, TeamMember[]> => {
    const grouped: Record<Department, TeamMember[]> = {
      Admin: [],
      Finance: [],
      Marketing: [],
      Outreach: [],
      Events: [],
      Academics: [],
      Engineering: [],
    };

    const members = teamMembers ?? [];
    members.forEach((member) => {
      const dept = getDepartmentFromRole(member.role);
      grouped[dept as Department].push(member);
    });

    // Sort each department's members by hierarchy (lower number = higher rank)
    Object.keys(grouped).forEach((dept) => {
      grouped[dept as Department].sort((a, b) => {
        const hierarchyA = getRoleHierarchy(a.role);
        const hierarchyB = getRoleHierarchy(b.role);
        return hierarchyA - hierarchyB;
      });
    });

    return grouped;
  };

  const membersByDepartment = groupMembersByDepartment();

  return (
    <section className="w-full px-4 pt-48 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Main Team Header */}
        <div className="mb-16 sm:mb-8 text-center">
          <ScrapbookText
            text="Meet the Team"
            letterSize={110}
            mobileLetterSize={55}
            className="justify-center"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD670]"></div>
              <p className="mt-4 text-gray-400 font-montserrat">Loading team members...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 text-red-200 font-montserrat text-center">
            Failed to load team members. Please try again later.
          </div>
        )}

        {/* Team Grid - Grouped by Department */}
        {!loading && !error && (
          <div className="space-y-8">
            {DEPARTMENTS.map((dept) => {
              const deptMembers = membersByDepartment[dept];
              
              // Only show departments that have members
              if (deptMembers.length === 0) return null;

              return (
                <div key={dept} className="space-y-5">
                  {/* Department Header with ScrapbookText - Left Aligned */}
                  <div className="flex justify-start">
                    <ScrapbookText
                      text={dept}
                      letterSize={68}
                      mobileLetterSize={36}
                      className="justify-start"
                    />
                  </div>

                  {/* Department Members Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {deptMembers.map((member) => (
                      <TeamCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty State - No team members */}
            {Object.values(membersByDepartment).every((dept) => dept.length === 0) && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 font-montserrat">No team members found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
