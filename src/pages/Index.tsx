import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import ExtendedProjects from "@/components/ExtendedProjects";
import JourneySection from "@/components/JourneySection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <JourneySection />
        <ExtendedProjects />
        <FeaturedProjects />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
