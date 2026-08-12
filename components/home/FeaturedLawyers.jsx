import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import LawyerGrid from "@/components/lawyers/LawyerGrid";
import lawyers from "@/data/lawyers";

export default function FeaturedLawyers() {
  const featuredLawyers = [...lawyers].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <section className="bg-cream-50 py-20 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Featured Lawyers"
          title="Meet Highly Rated Lawyers"
          description="A sample of lawyer profiles from our demo directory, highlighted by rating. Explore the full directory to see every practice area and location."
        />

        <LawyerGrid lawyers={featuredLawyers} />

        <Button href="/directory" variant="secondary" className="self-start">
          View All Lawyers
        </Button>
      </Container>
    </section>
  );
}
