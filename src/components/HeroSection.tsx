import { useState, useEffect, useRef } from "react";
import one3 from "@/assets/one 3.jpg";
import one2 from "@/assets/one 2.jpeg";
import photo3 from "@/assets/photo-3.png";
import photo4 from "@/assets/photo-4.png";
import one4 from "@/assets/one 4.jpeg";
import one1 from "@/assets/one 1.jpeg";

const HeroSection = () => {
  const roles = ["Video Editor", "Filmmaker", "Part-time Graphic Designer and Photo editor"];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = useState<number | null>(null);
  const journeyHeadingRef = useRef<HTMLHeadingElement>(null);
  const journeyPara1Ref = useRef<HTMLParagraphElement>(null);
  const journeyPara2Ref = useRef<HTMLParagraphElement>(null);
  const journeyPara3Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    
    const cycleRoles = () => {
      // Start fade out
      setIsVisible(false);
      
      // After fade out completes, change role and fade in
      timeoutId = setTimeout(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        // Small delay to ensure React has updated the DOM
        setTimeout(() => {
          setIsVisible(true);
        }, 50);
      }, 1000); // Match animation duration (1s)
    };

    // Start cycling after initial display (3 seconds)
    const startInterval = setTimeout(() => {
      cycleRoles(); // Start first cycle
      intervalId = setInterval(cycleRoles, 3000); // Then repeat every 3 seconds
    }, 3000);

    return () => {
      if (startInterval) clearTimeout(startInterval);
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [roles.length]);

  // Scroll animation for journey section - line by line
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
          const delay = parseFloat(entry.target.getAttribute('data-delay') || '0') * 1000;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
        }
      });
    }, observerOptions);

    const elements = [
      journeyHeadingRef.current,
      journeyPara1Ref.current,
      journeyPara2Ref.current,
      journeyPara3Ref.current
    ];

    elements.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      elements.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  // Photo arrangement matching original - 5 photos in fan layout
  const photos = [
    { src: one3, rotation: -12, width: "w-28 md:w-36 lg:w-40", height: "h-40 md:h-52 lg:h-56" },
    { src: one2, rotation: -6, width: "w-28 md:w-36 lg:w-40", height: "h-40 md:h-52 lg:h-56" },
    { src: photo3, rotation: 0, width: "w-28 md:w-36 lg:w-40", height: "h-40 md:h-52 lg:h-56" },
    { src: one4, rotation: 6, width: "w-28 md:w-36 lg:w-40", height: "h-40 md:h-52 lg:h-56" },
    { src: one1, rotation: 12, width: "w-28 md:w-36 lg:w-40", height: "h-44 md:h-56 lg:h-64" },
  ];

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-28 pb-20 md:pb-24 lg:pb-32 px-4">
      <div className="text-center mb-14 animate-fade-up">
        {/* Agency name at top - smaller with liquid glass box */}
        <div className="mb-8 flex justify-center">
          <div className="liquid-glass-box inline-block px-4 py-2 md:px-6 md:py-3 rounded-xl">
            <p className="text-sm md:text-base lg:text-lg font-semibold text-foreground glow-text">
              Video Edition Agency
            </p>
          </div>
        </div>
        
        {/* Name - large white text */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-foreground mb-8 tracking-tight font-sans">
          Hi, I'm <span className="font-semibold">Aditya Barod</span>
        </h1>
        
        {/* Animated role text - blue with Cooper font - smaller */}
        <div className="h-12 md:h-16 lg:h-20 xl:h-24 flex items-center justify-center overflow-hidden mb-4">
          <div 
            key={currentRoleIndex}
            className={`flex items-center justify-center flex-wrap ${
              isVisible ? 'particle-dissolve-in' : 'animate-dissolve-out'
            }`}
          >
            {roles[currentRoleIndex].split('').map((char, charIndex) => {
              const delay = charIndex * 0.03;
              return (
                <span
                  key={charIndex}
                  className={`text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold cooper-font gradient-text inline-block particle-char ${
                    char === ' ' ? 'w-2 md:w-3' : ''
                  }`}
                  style={{
                    letterSpacing: '0.02em',
                    animationDelay: `${delay}s`
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center mb-20">
        <div className="flex items-end photo-container">
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`photo-card relative photo-zoom-in ${
                hoveredPhotoIndex !== null && hoveredPhotoIndex !== index 
                  ? 'photo-blurred' 
                  : hoveredPhotoIndex === index 
                  ? 'photo-hovered' 
                  : ''
              }`}
              style={{
                '--photo-rotation': `${photo.rotation}deg`,
                marginLeft: index > 0 ? "-20px" : "0",
                marginRight: index < photos.length - 1 ? "-20px" : "0",
                zIndex: hoveredPhotoIndex === index ? 20 : (index === 2 ? 10 : 5 - Math.abs(index - 2)),
                animationDelay: `${index * 0.15}s`,
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredPhotoIndex(index)}
              onMouseLeave={() => setHoveredPhotoIndex(null)}
            >
              <img
                src={photo.src}
                alt={`Portfolio photo ${index + 1}`}
                className={`${photo.width} ${photo.height} object-cover rounded-2xl`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl text-center animate-fade-up px-4 mt-24 md:mt-32 lg:mt-40" style={{ animationDelay: "0.3s" }}>
        <h2 ref={journeyHeadingRef} className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-8 olivia-script-font scroll-fade-in" data-delay="0">
          My journey
        </h2>
        <p ref={journeyPara1Ref} className="text-foreground/90 text-sm md:text-base lg:text-lg leading-relaxed scroll-fade-in" data-delay="0.15">
          With one hand on the mouse and the other wrapped around hot coffee, editing taught me <strong className="text-foreground">Pablo</strong> — my word for gentleness. Gentleness in cuts, intention in transitions, and control in motion to make every frame feel right. From fast-paced short-form content to long-form film timelines, I learned that editing isn't just a job for me — <strong className="text-foreground">it's an emotion.</strong>
        </p>
        <p ref={journeyPara2Ref} className="mt-6 text-foreground/90 text-sm md:text-base lg:text-lg leading-relaxed scroll-fade-in" data-delay="0.3">
          <strong className="text-foreground">My philosophy?</strong> The best edits feel invisible — until you realize how deeply they moved you.
        </p>
        <p ref={journeyPara3Ref} className="mt-4 text-muted-foreground italic text-xs md:text-sm lg:text-base scroll-fade-in" data-delay="0.45">
          Fun fact: Every clean cut here was powered by late nights, strong coffee, and one "this timeline is getting too long" moment.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
