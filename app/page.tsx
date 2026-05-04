import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ExpertiseSection from "@/components/ExpertiseSection";
import ActivitySection from "@/components/ActivitySection";
import EvolutionSection from "@/components/EvolutionSection";
import JournalSection from "@/components/JournalSection";
import ProjectsSection from "@/components/ProjectsSection";
import ResearchSection from "@/components/ResearchSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="pt-24 space-y-0">
        <HeroSection />
        <ExpertiseSection />
        <ActivitySection />
        <EvolutionSection />
        <ProjectsSection />
        <ResearchSection />
        <JournalSection />
      </main>
      <Footer />
    </>
  );
}
