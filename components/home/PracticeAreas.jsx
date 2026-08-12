import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import PracticeAreaCard from "@/components/practice-areas/PracticeAreaCard";
import practiceAreas from "@/data/practiceAreas";

export default function PracticeAreas() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="Practice Areas"
          title="Explore by Practice Area"
          description="Find lawyers organized by the type of legal help you need, from personal injury to estate planning."
        />

        <ul className="grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {practiceAreas.map((area, index) => (
            <li key={area.id}>
              <Reveal delay={Math.min(index, 6) * 0.04} className="h-full">
                <PracticeAreaCard area={area} />
              </Reveal>
            </li>
          ))}
        </ul>

        <Button href="/directory" variant="secondary" className="self-start">
          Browse Full Directory
        </Button>
      </Container>
    </section>
  );
}
