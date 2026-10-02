import "../styles/fadeSlideUpAnimation.css";
import RevealOnScroll from "../universal/RevealOnScroll";
import { usePointerMotion } from "../../hooks/usePointerMotion";

const HTMLBox = () => {
  const { motionStyle, onMouseMove, onMouseLeave } = usePointerMotion({
    maxRotateX: 1.8,
    maxRotateY: 2.2,
    maxTranslate: 4,
    hoverScale: 1.005,
  });

  return (
    <RevealOnScroll
      visibleClassName="fadeSlideUpFromBottom"
      className="relative w-full max-w-3xl max-h-max mx-auto px-2 sm:px-4"
      rootMargin="50px"
      once={true}
    >
      {/* Bracket SVG - Left */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 -translate-x-26 w-27 opacity-75">
        <img src="/assets/doodles/Bracket.svg" alt="" className="w-full h-full" />
      </div>

      {/* macOS Window Container */}
      <div
        className="rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-[#2C3844] dynamic-hover-lift dynamic-sheen"
        style={motionStyle ?? undefined}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Title Bar */}
        <div className="relative flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-[#1e2429] border-b border-slate-700">
          {/* Control Buttons */}
          <div className="flex gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF9FC4] hover:brightness-110 transition-all idle-soft-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFD670] hover:brightness-110 transition-all idle-soft-pulse" style={{ animationDelay: '0.35s' }} />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#268AF9] hover:brightness-110 transition-all idle-soft-pulse" style={{ animationDelay: '0.55s' }} />
          </div>
          
          {/* Filename */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-slate-300 text-xs sm:text-base md:text-lg font-montserrat">
            lcs.html
          </div>
          
          {/* Spacer for layout balance */}
          <div className="w-8 sm:w-13" />
        </div>

        {/* Code Content */}
        <div className="p-3 sm:p-4 md:p-6 overflow-hidden">
          <div className="font-montserrat font-thin text-xs sm:text-base md:text-xl leading-relaxed wrap-break-word">
            {/* Line 1: Opening div tag */}
            <div className="flex">
              <span className="text-[#6B98C4]">&lt;div&nbsp;</span>
              <span className="text-[#FF9770]">id</span>
              <span className="text-white">=</span>
              <span className="text-[#FFD670]">"about-us"</span>
              <span className="text-[#6B98C4]">&gt;</span>
            </div>
            
            {/* Line 2: Opening p tag with indent guide */}
            <div className="flex">
              <span className="hidden sm:inline-block w-8 border-l-2 border-slate-600/30 ml-2" />
              <span className="sm:hidden inline-block w-4 ml-1" />
              <span className="text-[#6B98C4]">&lt;p&gt;</span>
            </div>
            
            {/* Line 3-6: Text content with deeper indent guide */}
            <div className="flex">
              <span className="hidden sm:inline-block w-8 border-l-2 border-slate-600/30 ml-2" />
              <span className="hidden sm:inline-block w-8 border-l-2 border-slate-600/30 ml-0" />
              <span className="sm:hidden inline-block w-4 ml-1" />
              <span className="text-slate-200 flex-1 wrap-break-word">The Laurier Computing Society (LCS) is Wilfrid Laurier University's official computer science club — the Laurier CS club for WLU students. We support students through academic help, career-building events, hackathons, and a strong tech-focused community.</span>
            </div>
            
            {/* Line 7: Closing p tag with indent guide */}
            <div className="flex">
              <span className="hidden sm:inline-block w-8 border-l-2 border-slate-600/30 ml-2" />
              <span className="sm:hidden inline-block w-4 ml-1" />
              <span className="text-[#6B98C4]">&lt;/p&gt;</span>
            </div>
            
            {/* Line 8: Closing div tag */}
            <div className="flex">
              <span className="text-[#6B98C4]">&lt;/div&gt;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bracket SVG - Right */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 translate-x-26 w-27 opacity-75 rotate-180">
        <img src="/assets/doodles/Bracket.svg" alt="" className="w-full h-full" />
      </div>
    </RevealOnScroll>
  );
};

export default HTMLBox;
