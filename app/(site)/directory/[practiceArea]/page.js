/** @format */

import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import ImageTextSection from '@/components/ui/ImageTextSection';
import LawyerFilters from '@/components/lawyers/LawyerFilters';
import PracticeAreaCard from '@/components/practice-areas/PracticeAreaCard';
import practiceAreas from '@/data/practiceAreas';
import lawyers from '@/data/lawyers';
import { PLACEHOLDER_IMAGE_ARCHITECTURE } from '@/lib/constants';

export function generateStaticParams() {
  return practiceAreas.map((area) => ({ practiceArea: area.slug }));
}

export async function generateMetadata({ params }) {
  const { practiceArea: slug } = await params;
  const area = practiceAreas.find((item) => item.slug === slug);

  if (!area) {
    return { title: 'Practice Area Not Found' };
  }

  return {
    title: `${area.name} Lawyers`,
    description: `Browse ${area.name.toLowerCase()} lawyers on Review Top Lawyers. ${area.description}`,
  };
}

export default async function PracticeAreaPage({ params }) {
  const { practiceArea: slug } = await params;
  const area = practiceAreas.find((item) => item.slug === slug);

  if (!area) {
    notFound();
  }

  const matchingLawyers = lawyers.filter((lawyer) =>
    lawyer.practiceAreas.includes(slug),
  );

  const relatedAreas = practiceAreas
    .filter((item) => item.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <section className='border-b border-cream-200 bg-cream-50 py-16 sm:py-20'>
        <Container>
          <ImageTextSection
            image={area.image}
            imageAlt='Placeholder illustration representing professional legal services'>
            <SectionHeading
              titleAs='h1'
              eyebrow='Practice Area'
              title={`${area.name} Lawyers`}
              description={`${area.description} ${matchingLawyers.length} lawyer${matchingLawyers.length === 1 ? '' : 's'} currently featured in this practice area.`}
            />
          </ImageTextSection>
        </Container>
      </section>

      <Container className='py-16'>
        <LawyerFilters
          lawyers={matchingLawyers}
          practiceAreas={practiceAreas}
          lockedPracticeArea={slug}
        />
      </Container>

      {relatedAreas.length > 0 && (
        <section className='border-t border-cream-200 bg-cream-50 py-16'>
          <Container>
            <h2 className='font-heading text-2xl font-semibold text-navy-900'>
              Related Practice Areas
            </h2>
            <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3'>
              {relatedAreas.map((related) => (
                <PracticeAreaCard
                  key={related.id}
                  area={related}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className='bg-navy-900 py-16 text-cream-50'>
        <Container className='flex flex-col items-start gap-4'>
          <h2 className='font-heading text-2xl font-semibold sm:text-3xl'>
            Looking for a different practice area?
          </h2>
          <p className='max-w-xl text-cream-100/80'>
            Browse the full directory to search across every practice area,
            location, and rating.
          </p>
          <Button
            href='/directory'
            variant='light'>
            Browse Full Directory
          </Button>
        </Container>
      </section>
    </>
  );
}
