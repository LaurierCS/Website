/**
 * TeamCard Component
 * Displays a team member's profile with photo, name, and optional social links
 * Styled with dark theme and accent color hover effects
 */

import { useState } from 'react';
import RevealOnScroll from '../universal/RevealOnScroll';

interface TeamMember {
  id: string;
  name: string;
  picture_url: string;
  role?: string;
  github_url?: string;
  linkedin_url?: string;
}

interface TeamCardProps {
  member: TeamMember;
}

// SVG Icons
const showGithub = true;
const showLinkedin = true;

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c2.6-.4 5.6-1.3 5.6-6a4.7 4.7 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.3s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.4 4.4 0 0 0-.1 3.3A4.7 4.7 0 0 0 4 9.5c0 4.6 3 5.6 5.6 6a4.8 4.8 0 0 0-1 3.5v4" />
    <path d="M9 18c-4.51 2-5-2.5-7-2.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function TeamCard({ member }: TeamCardProps) {
  const [hoverColor, setHoverColor] = useState<string | null>(null);

  const accentColorMap = [
    { border: '#FF9FC4', shadow: 'rgba(255,159,196,0.3)' },    // Pink
    { border: '#FF9770', shadow: 'rgba(255,151,112,0.3)' },    // Orange
    { border: '#FFD670', shadow: 'rgba(255,214,112,0.3)' },    // Yellow
    { border: '#268AF9', shadow: 'rgba(38,138,249,0.3)' },     // Blue
  ];
  
  const colorIndex = member.id.charCodeAt(0) % accentColorMap.length;
  const staticColor = accentColorMap[colorIndex];
  const displayColor = hoverColor || staticColor.border;

  const handleMouseEnter = () => {
    const randomColor = accentColorMap[Math.floor(Math.random() * accentColorMap.length)];
    setHoverColor(randomColor.border);
  };

  const handleMouseLeave = () => {
    setHoverColor(null);
  };

  return (
    <RevealOnScroll visibleClassName="fadeSlideUpFast" rootMargin="30px" once={true}>
      <div
        className="group relative flex items-center gap-4 md:gap-5 py-4 px-4 md:px-6 transition-all duration-300 cursor-pointer hover:scale-105"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Container - Circular with colored border */}
        <div 
          className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 shrink-0 rounded-full overflow-hidden border-3 md:border-4 group-hover:scale-110 transition-transform duration-300"
          style={{ borderColor: staticColor.border }}
        >
        {member.picture_url ? (
          <img
            src={member.picture_url}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#2C3844]">
            <span
              className="font-bold text-3xl md:text-4xl transition-colors duration-200"
              style={{ fontFamily: 'var(--font-dosis)', color: displayColor }}
            >
              {member.name.trim().charAt(0).toUpperCase() || '?'}
            </span>
          </div>
        )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Member Name */}
          <h3
            className="font-dosis font-bold text-white text-base sm:text-lg md:text-xl transition-colors duration-200 wrap-break-word leading-tight"
            style={{ color: hoverColor ? displayColor : 'white' }}
          >
            {member.name}
          </h3>
          
          {/* Member Role */}
          {member.role && (
            <p className="font-montserrat font-thin text-gray-400 text-sm md:text-base wrap-break-word leading-tight">
              {member.role}
            </p>
          )}

          {/* Social Links Container */}
          {(member.github_url || member.linkedin_url) && (
            <div className="flex gap-2 mt-1">
              {/* GitHub Link */}
              {showGithub && member.github_url && (
                <a
                  href={member.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded transition-all duration-200 text-white hover:text-[#FF9FC4]"
                  title="GitHub"
                >
                  <GitHubIcon />
                </a>
              )}

              {/* LinkedIn Link */}
              {showLinkedin && member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded transition-all duration-200 text-white hover:text-[#268AF9]"
                  title="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </RevealOnScroll>
  );
}
