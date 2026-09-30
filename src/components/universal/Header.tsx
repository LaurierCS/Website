import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SocialLinks from './SocialLinks';

export default function Header() {
  // Track scroll state for background blur effect
  const [isScrolled, setIsScrolled] = useState(false);
  // Track mobile menu open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isTestsPage = location.pathname === '/tests';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/10 ${
        isTestsPage
          ? 'bg-white/5 backdrop-blur-lg'
          : (isScrolled || isMobileMenuOpen
              ? 'backdrop-blur-lg bg-white/5'
              : 'bg-transparent')
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Logo - responsive sizing */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center shrink-0 bg-none border-none p-0 cursor-pointer"
          aria-label="Scroll to top"
        >
          <img
            src="/assets/logos/LCS_Logo_Long_White_SVG.svg"
            alt=""
            className="hidden md:block h-8 md:h-10"
          />
          <img
            src="/assets/logos/LCS_Icon_White_SVG.svg"
            alt=""
            className="block md:hidden h-8"
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8">
          <NavLink href="#about">About Us</NavLink>
          <NavLink href="#impact">Impact</NavLink>
          <NavLink href="#initiatives">Initiatives</NavLink>
          <NavLink href="#team">Our Team</NavLink>
          <NavLink href="/hack-to-the-future">Hackathon</NavLink>
        </nav>

        {/* Desktop Social Links */}
        <div className="hidden md:block">
          <SocialLinks />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-128 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col items-center gap-4 py-4 backdrop-blur-lg bg-white/5 border-t border-white/20">
          <NavLink href="#about" onClick={handleNavClick}>About Us</NavLink>
          <NavLink href="#impact" onClick={handleNavClick}>Impact</NavLink>
          <NavLink href="#initiatives" onClick={handleNavClick}>Initiatives</NavLink>
          <NavLink href="#team" onClick={handleNavClick}>Our Team</NavLink>
          <NavLink href="/hack-to-the-future" onClick={handleNavClick}>Hackathon</NavLink>
          <div className="border-t border-white/20 w-full pt-4 mt-4 flex justify-center">
            <SocialLinks />
          </div>
        </nav>
      </div>
    </header>
  );
}

// Individual nav link with random accent color on hover
function NavLink({ href, children, onClick }: { href: string; children: string; onClick?: () => void }) {
  const navigate = useNavigate();
  const [currentColor, setCurrentColor] = useState('');
  const [lastColor, setLastColor] = useState('');

  // Accent colors from CSS variables
  const accentColors = [
    '#FF9FC4', // pink
    '#FF9770', // orange
    '#FFD670', // yellow
    '#268AF9', // blue
    '#B1E0FF', // light-blue
  ];

  // Pick random color on each hover (exclude previous color)
  const handleMouseEnter = () => {
    const availableColors = accentColors.filter(color => color !== lastColor);
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    setCurrentColor(randomColor);
    setLastColor(randomColor);
  };

  const handleMouseLeave = () => {
    setCurrentColor('');
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const sectionId = href.slice(1);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
    }
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative text-white text-base md:text-lg font-medium transition-all duration-300 whitespace-nowrap cursor-pointer"
      style={{
        fontFamily: 'var(--font-dosis)',
        color: currentColor || 'white',
      }}
    >
      {children}
      {/* Animated underline */}
      <span
        className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300"
        style={{
          backgroundColor: currentColor,
          transform: currentColor ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />
    </a>
  );
}
