import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import characterVideo from "@/assets/A1 character .mp4";

// Import bg port.mov - file must exist in src/assets/
// If error occurs, save bg port.mov to src/assets/ folder
import bgPortVideo from "@/assets/bg port.mov";

const IntroWrapper = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const characterVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Always show intro on every page load/refresh
    setShowIntro(true);
    setIsVisible(false);
    setIsTransitioning(false);

    // Force videos to reload and play on every mount
    const loadVideos = () => {
      if (backgroundVideoRef.current) {
        // Force complete reload of the video by removing and re-adding sources
        const video = backgroundVideoRef.current;
        video.pause();
        video.currentTime = 0;
        
        // Clear all sources
        while (video.firstChild) {
          video.removeChild(video.firstChild);
        }
        
        // Re-add sources with bg port.mov
        const source1 = document.createElement('source');
        source1.src = bgPortVideo;
        source1.type = 'video/quicktime';
        video.appendChild(source1);
        
        const source2 = document.createElement('source');
        source2.src = bgPortVideo;
        source2.type = 'video/mp4';
        video.appendChild(source2);
        
        // Force reload
        video.load();
        
        // Small delay then play
        setTimeout(() => {
          if (video) {
            video.play().catch(() => {
              // Handle autoplay restrictions
            });
          }
        }, 200);
      }
      if (characterVideoRef.current) {
        characterVideoRef.current.currentTime = 0; // Reset to start
        characterVideoRef.current.load();
        characterVideoRef.current.play().catch(() => {
          // Handle autoplay restrictions
        });
      }
    };

    // Small delay to ensure refs are attached
    const videoTimer = setTimeout(loadVideos, 50);

    // Trigger fade-in animation after component mounts
    const fadeTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      clearTimeout(videoTimer);
      clearTimeout(fadeTimer);
    };
  }, [location.pathname]); // Re-run on every route change/refresh

  const handleButtonClick = () => {
    setIsTransitioning(true);
    // Wait for fade-out animation before showing content
    setTimeout(() => {
      setShowIntro(false);
      setIsTransitioning(false);
    }, 500);
  };

  if (showIntro) {
    return (
      <div
        className={`fixed inset-0 z-50 w-screen h-screen flex items-center justify-center transition-opacity duration-500 ease-in-out ${
          isTransitioning ? "opacity-0" : isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Background video - bg port.mov at 85% opacity */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            ref={backgroundVideoRef}
            key={`bg-port-video-${Date.now()}`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ opacity: 0.85 }}
            preload="auto"
            onLoadedData={() => {
              if (backgroundVideoRef.current) {
                backgroundVideoRef.current.play().catch(() => {
                  // Handle autoplay restrictions
                });
              }
            }}
          >
            <source src={bgPortVideo} type="video/quicktime" />
            <source src={bgPortVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Character video and Circular Button - Centered together */}
        <div className="absolute inset-0 flex items-center justify-center z-[10]">
          <div className="relative w-[248px] h-[248px] flex items-center justify-center">
            {/* Outer Circular Loading Animation - Rotating ring (around the button) */}
            <div 
              className="absolute w-full h-full rounded-full border-4 border-transparent border-t-white/90 border-r-white/70"
              style={{ 
                animation: 'spin 3s linear infinite',
                transformOrigin: 'center center',
                willChange: 'transform'
              }}
            ></div>

            {/* Circular Button Container */}
            <button
              onClick={handleButtonClick}
              className="relative w-[240px] h-[240px] rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-4 focus:ring-offset-transparent group cursor-pointer z-10"
              style={{ boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)' }}
            >
              {/* Character video inside the circle */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <video
                  ref={characterVideoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-full"
                >
                  <source src={characterVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 rounded-full"></div>

              {/* Text overlay - Welcome | Take a Look with better font */}
              <div className="relative z-10 flex flex-col items-center justify-center px-4">
                <span 
                  className="text-white font-semibold text-sm uppercase tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  WELCOME
                </span>
                <span 
                  className="text-white font-semibold text-sm uppercase tracking-wider drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  TAKE A LOOK
                </span>
              </div>

              {/* Inner circular loading ring */}
              <div 
                className="absolute inset-3 rounded-full border-2 border-transparent border-t-white/80 border-r-white/60"
                style={{ 
                  animation: 'spin 1.8s linear infinite reverse',
                  transformOrigin: 'center center'
                }}
              ></div>
            </button>

            {/* CLICK ME text around the circle with loading dots */}
            <div className="absolute w-[270px] h-[270px] pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 270 270"
              >
                <defs>
                  <path
                    id="circle-text-path"
                    d="M 135, 135 m -110, 0 a 110,110 0 1,1 220,0 a 110,110 0 1,1 -220,0"
                  />
                </defs>
                <text
                  fill="white"
                  fontSize="10"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                  letterSpacing="0.1em"
                  textAnchor="middle"
                  style={{ 
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))',
                    textTransform: 'lowercase'
                  }}
                >
                  <textPath
                    href="#circle-text-path"
                    startOffset="50%"
                    dominantBaseline="middle"
                  >
                    click me
                  </textPath>
                </text>
              </svg>
              
              {/* Loading dots positioned around the circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[270px] h-[270px]">
                  {/* Top dot */}
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      transform: 'translate(-50%, -50%)',
                      animation: 'bounce 1.4s ease-in-out infinite',
                      animationDelay: '0s'
                    }}
                  >
                    <span className="text-white text-xs font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">.</span>
                  </div>
                  
                  {/* Right dot */}
                  <div 
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                    style={{ 
                      transform: 'translate(50%, -50%)',
                      animation: 'bounce 1.4s ease-in-out infinite',
                      animationDelay: '0.35s'
                    }}
                  >
                    <span className="text-white text-xs font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">.</span>
                  </div>
                  
                  {/* Bottom dot */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                    style={{ 
                      transform: 'translate(-50%, 50%)',
                      animation: 'bounce 1.4s ease-in-out infinite',
                      animationDelay: '0.7s'
                    }}
                  >
                    <span className="text-white text-xs font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">.</span>
                  </div>
                  
                  {/* Left dot */}
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
                    style={{ 
                      transform: 'translate(-50%, -50%)',
                      animation: 'bounce 1.4s ease-in-out infinite',
                      animationDelay: '1.05s'
                    }}
                  >
                    <span className="text-white text-xs font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default IntroWrapper;
