import { useState, useEffect, useRef } from "react";
import { Briefcase, User, GraduationCap, Phone, Instagram, Mail } from "lucide-react";

const JourneySection = () => {
  const boxes = [
    {
      title: "EXPERIENCE",
      icon: Briefcase,
      items: [
        { label: "Freelance Video Editor & Filmmaker", value: "1+ Year Experience" },
        { label: "Short-form & long-form content", value: "" },
        { label: "End-to-end editing workflow", value: "" },
      ],
    },
    {
      title: "PERSONAL SKILLS",
      icon: User,
      items: [
        { label: "Core Skills", value: "" },
        { label: "Time Management", value: "" },
        { label: "Teamwork & Leadership", value: "" },
        { label: "Execution & Concept Development", value: "" },
      ],
    },
    {
      title: "EDUCATION",
      icon: GraduationCap,
      items: [
        { label: "Education", value: "" },
        { label: "B.Tech (CSE) — Medi-Caps University", value: "2022 – 2026" },
      ],
    },
    {
      title: "CONTACT",
      icon: Phone,
      items: [
        { label: "Contact", value: "" },
        { label: "Phone", value: "8319692224", icon: Phone, link: "tel:8319692224" },
        { label: "Instagram", value: "@adi_tya_71", icon: Instagram, link: "https://instagram.com/adi_tya_71" },
        { label: "Email", value: "adityabarod807@gmail.com", icon: Mail, link: "mailto:adityabarod807@gmail.com" },
      ],
    },
  ];

  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
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

    boxRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      boxRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section id="journey" className="py-32 md:py-40 px-4 md:px-8 max-w-5xl mx-auto">
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent -translate-x-1/2 hidden md:block" />
        
        <div className="space-y-8">
          {boxes.map((box, index) => {
            const IconComponent = box.icon;
            return (
            <div
              key={index}
                ref={(el) => (boxRefs.current[index] = el)}
                className={`relative flex flex-col md:flex-row items-center gap-6 scroll-fade-in ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
                data-delay={index * 0.1}
            >
              <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                <div className="project-card p-6 group">
                    <div className={`flex items-center gap-3 mb-4 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"} justify-center`}>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className={`text-lg font-bold text-foreground font-serif ${index % 2 === 0 ? "md:text-right" : "md:text-left"} text-center`}>
                        {box.title}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {box.items.map((item, itemIndex) => {
                        const ItemIcon = item.icon;
                        const content = (
                          <div className={`flex items-start gap-3 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                            {ItemIcon && (
                              <ItemIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className={`text-foreground font-medium text-sm ${index % 2 === 0 ? "md:text-right" : "md:text-left"} text-center`}>
                                {item.label}
                              </div>
                              {item.value && (
                                <div className={`text-muted-foreground text-sm mt-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} text-center`}>
                                  {item.value}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                        
                        if (item.link) {
                          return (
                            <a
                              key={itemIndex}
                              href={item.link}
                              target={item.link.startsWith('http') ? '_blank' : undefined}
                              rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="block hover:text-primary transition-colors"
                            >
                              {content}
                            </a>
                          );
                        }
                        
                        return <div key={itemIndex}>{content}</div>;
                      })}
                    </div>
                </div>
              </div>
              
              <div className="relative z-10 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/30 hidden md:block" />
              
              <div className="flex-1 hidden md:block" />
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;
