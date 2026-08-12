import Hero from "@/components/home/Hero";
import PracticeAreas from "@/components/home/PracticeAreas";
import FeaturedLawyers from "@/components/home/FeaturedLawyers";
import RankingSection from "@/components/home/RankingSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PracticeAreas />
      <FeaturedLawyers />
      <RankingSection />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
