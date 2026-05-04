import HeroSection from "@/components/HeroSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import ActivitySection from "@/components/ActivitySection";
import EvolutionSection from "@/components/EvolutionSection";
import JournalSection from "@/components/JournalSection";
import ProjectsSection from "@/components/ProjectsSection";
import ResearchSection from "@/components/ResearchSection";

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <ExpertiseSection />
      <ActivitySection />
      <EvolutionSection />
      <ProjectsSection />
      <ResearchSection />
      <JournalSection />
    </div>
  );
}
