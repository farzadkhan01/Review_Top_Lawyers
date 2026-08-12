import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function CTASection() {
  return (
    <section className="bg-navy-900 py-20 text-cream-50 sm:py-24">
      <Container>
        <Reveal className="flex flex-col items-start gap-5">
          <h2 className="max-w-xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to Find the Right Lawyer?
          </h2>
          <p className="max-w-xl text-cream-100/80">
            Search our directory by practice area, location, and rating to find a lawyer who
            fits your needs.
          </p>
          <Button href="/directory" variant="light" size="lg">
            Explore the Directory
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
