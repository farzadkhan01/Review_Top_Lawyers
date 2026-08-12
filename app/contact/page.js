import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import ContactForm from "@/components/forms/ContactForm";
import { CONTACT_INFO, PLACEHOLDER_IMAGE_CONSULTATION } from "@/lib/constants";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the Review Top Lawyers team.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-cream-200 bg-cream-50 py-16 sm:py-20">
        <Container>
          <SectionHeading
            titleAs="h1"
            eyebrow="Contact"
            title="Get in Touch"
            description="Have a question about Review Top Lawyers, a practice area, or how the directory works? Send us a message and we will get back to you."
          />
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>

        <aside className="flex flex-col gap-6">
          <Reveal>
            <PlaceholderImage
              src={PLACEHOLDER_IMAGE_CONSULTATION}
              alt="Placeholder illustration representing a client consultation"
              sizes="(min-width: 1024px) 33vw, 100vw"
            />
          </Reveal>

          <Reveal delay={0.05}>
            <div className="rounded-lg border border-cream-200 bg-white p-6">
              <h2 className="font-heading text-lg font-semibold text-navy-900">
                Contact Information
              </h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-muted-400">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="rounded text-navy-900 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
                    >
                      {CONTACT_INFO.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-400">Phone</dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${CONTACT_INFO.phone.replace(/[^\d+]/g, "")}`}
                      className="rounded text-navy-900 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-400">Office</dt>
                  <dd className="mt-1 text-navy-900">
                    {CONTACT_INFO.addressLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-lg border border-cream-200 bg-cream-50 p-6">
              <h2 className="font-heading text-lg font-semibold text-navy-900">
                What to Expect
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-600">
                This is a demo contact experience. Messages are not sent to a live inbox yet,
                but this form is ready to connect to a real backend or email service.
              </p>
            </div>
          </Reveal>
        </aside>
      </Container>
    </>
  );
}
