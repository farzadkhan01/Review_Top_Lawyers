import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Rating from "@/components/lawyers/Rating";
import ReviewList from "@/components/lawyers/ReviewList";
import LawyerGrid from "@/components/lawyers/LawyerGrid";
import ArticleGrid from "@/components/articles/ArticleGrid";
import { getPracticeAreasForLawyer } from "@/lib/utils";

export default function LawyerProfile({ lawyer, practiceAreas, relatedLawyers, relevantArticles = [] }) {
  const areas = getPracticeAreasForLawyer(lawyer, practiceAreas);
  const primaryArea = areas[0];

  return (
    <>
      <section className="border-b border-cream-200 bg-cream-50 py-16 sm:py-20">
        <Container className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-cream-100 sm:h-40 sm:w-40">
            <Image
              src={lawyer.image}
              alt={`Profile placeholder for ${lawyer.name}`}
              fill
              sizes="160px"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex-1">
            {primaryArea && <Badge variant="gold">{primaryArea.name}</Badge>}
            <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              {lawyer.name}
            </h1>
            <p className="mt-1 text-lg text-muted-600">{lawyer.title}</p>
            <p className="mt-1 text-sm text-muted-400">{lawyer.location}</p>

            <div className="mt-4">
              <Rating rating={lawyer.rating} reviewCount={lawyer.reviewCount} size="lg" />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button href="/contact" variant="primary">
                Request a Consultation
              </Button>
              <a
                href={`tel:${lawyer.phone.replace(/[^\d+]/g, "")}`}
                className="rounded text-sm font-medium text-navy-800 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                Call {lawyer.phone}
              </a>
              <a
                href={`mailto:${lawyer.email}`}
                className="rounded text-sm font-medium text-navy-800 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
              >
                Email {lawyer.email}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-12 lg:col-span-2">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="font-heading text-2xl font-semibold text-navy-900">
              About {lawyer.name.split(" ")[0]}
            </h2>
            <p className="mt-4 break-words text-base leading-relaxed text-muted-600">{lawyer.fullBio}</p>
          </section>

          <section aria-labelledby="reviews-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="reviews-heading" className="font-heading text-2xl font-semibold text-navy-900">
                Reviews
              </h2>
              <Rating rating={lawyer.rating} reviewCount={lawyer.reviewCount} />
            </div>
            <p className="mt-2 text-xs text-muted-400">
              Reviews shown are fictional demo content and do not represent real clients.
            </p>
            <div className="mt-6">
              <ReviewList reviews={lawyer.reviews} />
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-lg border border-cream-200 bg-white p-6">
            <h2 className="font-heading text-lg font-semibold text-navy-900">
              Professional Information
            </h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="font-medium text-muted-400">Years of Experience</dt>
                <dd className="mt-1 text-navy-900">{lawyer.yearsOfExperience} years</dd>
              </div>
              {areas.length > 0 && (
                <div>
                  <dt className="font-medium text-muted-400">Practice Areas</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {areas.map((area) => (
                      <Link
                        key={area.slug}
                        href={`/directory/${area.slug}`}
                        className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
                      >
                        <Badge variant="outline" className="hover:bg-navy-900/5">
                          {area.name}
                        </Badge>
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
              {lawyer.education?.length > 0 && (
                <div>
                  <dt className="font-medium text-muted-400">Education</dt>
                  <dd className="mt-1 space-y-1 text-navy-900">
                    {lawyer.education.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </dd>
                </div>
              )}
              {lawyer.languages?.length > 0 && (
                <div>
                  <dt className="font-medium text-muted-400">Languages</dt>
                  <dd className="mt-1 text-navy-900">{lawyer.languages.join(", ")}</dd>
                </div>
              )}
            </dl>
          </div>
        </aside>
      </Container>

      {relatedLawyers.length > 0 && (
        <section className="border-t border-cream-200 bg-cream-50 py-16">
          <Container>
            <h2 className="font-heading text-2xl font-semibold text-navy-900">Related Lawyers</h2>
            <div className="mt-8">
              <LawyerGrid lawyers={relatedLawyers} />
            </div>
          </Container>
        </section>
      )}

      {relevantArticles.length > 0 && (
        <section className="border-t border-cream-200 bg-white py-16">
          <Container>
            <h2 className="font-heading text-2xl font-semibold text-navy-900">
              Related Articles
            </h2>
            <div className="mt-8">
              <ArticleGrid articles={relevantArticles} />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
