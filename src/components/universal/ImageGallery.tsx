import { useState, useEffect, useCallback } from 'react';

/**
 * ImageGallery Component
 * A reusable customizable image gallery
 * 
 * @param images - Array of image paths to display
 * @param captions - Optional array of caption strings (parallel to images array)
 * @param className - Optional additional CSS classes for the container
 * @param width - Optional width (e.g., '100%', '400px', 'max-w-md')
 * @param aspectRatio - Optional aspect ratio (default: '16/10', try '4/3', 'square', '16/9')
 * @param autoScrollInterval - Optional auto-scroll interval in ms (0 = disabled, default = 0)
 * @param showCounter - Optional show image counter (default: true)
 * @param showDots - Optional show dot navigation (default: true)
 */

interface ImageGalleryProps {
  images: string[];
  captions?: (string | undefined)[];
  className?: string;
  width?: string;
  aspectRatio?: string;
  autoScrollInterval?: number;
  showCounter?: boolean;
  showDots?: boolean;
}

// Accent colors
const accentColors = ['#FF9FC4', '#FF9770', '#FFD670', '#268AF9', '#B1E0FF'];

export default function ImageGallery({ 
  images, 
  captions = [], 
  className = '',
  width = '100%',
  aspectRatio = '16/10',
  autoScrollInterval = 0,
  showCounter = true,
  showDots = true,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigate to a specific image
  const navigateTo = useCallback((index: number) => {
    setCurrentIndex((current) => {
      if (index === current) return current;
      return index;
    });
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateTo((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        navigateTo((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, navigateTo]);

  // Auto-scroll functionality
  useEffect(() => {
    if (autoScrollInterval <= 0 || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScrollInterval, images.length]);

  // Ensure we have valid data
  if (!images || images.length === 0) {
    return <div className="text-white/60 text-center py-8">No images to display</div>;
  }

  // Get lightened accent color for caption background
  const captionBgColor = accentColors[currentIndex % accentColors.length] + '99';

  return (
    <div className={`w-full ${className}`} style={{ maxWidth: width }}>
      {/* Main Image Container with Customizable Aspect Ratio */}
      <div 
        className="relative w-full bg-slate-800/50 rounded-lg overflow-hidden"
        style={{ aspectRatio }}
      >
        {/* Transition Effect */}
        <div className="relative w-full h-full">
          {images.map((image, index) => {
            const isActive = index === currentIndex;
            const isPrev = index === (currentIndex - 1 + images.length) % images.length;
            
            // Calculate transform based on position and direction
            let transform = 'translateX(100%) scale(0.8)';
            let opacity = 0;
            
            if (isActive) {
              transform = 'translateX(0) scale(1)';
              opacity = 1;
            } else if (isPrev) {
              transform = 'translateX(-100%) scale(0.8)';
              opacity = 0;
            }
            
            return (
              <img
                key={index}
                src={image}
                alt={captions[index] || `Image ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out"
                style={{
                  transform,
                  opacity,
                  zIndex: isActive ? 10 : 0,
                }}
              />
            );
          })}
        </div>

        {/* Caption Overlay */}
        {captions[currentIndex] && (
          <div 
            className="absolute bottom-0 left-0 right-0 px-6 py-4 text-white font-medium text-sm md:text-base transition-opacity duration-300 z-20 pointer-events-none"
            style={{ 
              background: `linear-gradient(to top, ${captionBgColor}, transparent)`,
            }}
          >
            <div className="backdrop-blur-sm bg-black/20 rounded px-3 py-2 inline-block">
              {captions[currentIndex]}
            </div>
          </div>
        )}

        {/* Image Counter - Top Right */}
        {showCounter && (
          <div 
            className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold tracking-wide shadow-lg transition-all duration-300 hover:scale-110 z-20 pointer-events-none"
            style={{
              borderLeft: `2px solid ${accentColors[currentIndex % accentColors.length]}`,
            }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Dot Navigation */}
      {showDots && (
        <div className="flex items-center justify-center gap-3 mt-6">
          {images.map((_, index) => {
            const isActive = index === currentIndex;
            
            return (
              <button
                key={index}
                onClick={() => navigateTo(index)}
                className="group relative transition-transform duration-200 hover:scale-125 focus:outline-none"
                aria-label={`Go to image ${index + 1}`}
                style={{
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                {/* Dot */}
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive ? 'w-8' : 'w-3'
                  }`}
                  style={{
                    backgroundColor: isActive 
                      ? accentColors[index % accentColors.length]
                      : '#ffffff40',
                  }}
                />
                
                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
                  style={{
                    backgroundColor: accentColors[index % accentColors.length],
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
