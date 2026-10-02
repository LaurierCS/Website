/**
 * Welcome Component
 * Displays "WELCOME TO" using decorative letter assets arranged in a scrapbook style,
 * followed by "Laurier Computing Society"
 * 
 * Now with scroll-reveal animations!
 */

import ScrapbookText from '../universal/ScrapbookText';
import Mascots from '../universal/Mascots';
import RevealOnScroll from '../universal/RevealOnScroll';
import '../styles/fadeSlideUpAnimation.css';

/**
 * Welcome Component
 * Main container component arranging letter assets and text
 */
export const Welcome: React.FC = () => {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-10">
      <div className="flex flex-col items-center justify-center py-8 ">
        {/* Scrapbook Letter Section */}
        <div className="max-w-4xl w-full px-4 pr-8 overflow-hidden">
          <ScrapbookText text="WELCOME TO" letterSize={112} mobileLetterSize={48} playAnimationOnMount={true} />
        </div>

        {/* Laurier Computing Society Text */}
        <RevealOnScroll
          visibleClassName="fadeSlideUpFromBottom"
          rootMargin="50px"
          once={true}
        >
          <h1
            className="font-bold text-white text-center md:pl-5 text-2xl sm:text-3xl md:text-5xl"
            style={{ fontFamily: 'var(--font-dosis)', lineHeight: '1.2' }}
          >
            LAURIER COMPUTING SOCIETY
          </h1>
        </RevealOnScroll>
      </div>
      {/* Mascots Section */}
      <div className="hidden md:flex">
        <Mascots mascotSize={180}/>
      </div>
    </div>
  );
};

export default Welcome;
