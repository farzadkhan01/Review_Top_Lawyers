/** @format */

import Link from 'next/link';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Rating from '@/components/lawyers/Rating';
import Reveal from '@/components/ui/Reveal';
import lawyers from '@/data/lawyers';

export default function RankingSection() {
  const rankedLawyers = [...lawyers]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);

  return (
    <section className='bg-white py-20 sm:py-24'>
      <Container className='flex flex-col gap-10'>
        <SectionHeading
          eyebrow='Platform Highlights'
          title='Find a Top-Rated Lawyer Today'
          description='These lawyers currently have the most reviews in directory. This reflects activity within Review Top Lawyers only, not an independent or verified ranking.'
        />

        <ol className='flex flex-col divide-y divide-cream-200 rounded-lg border border-cream-200 bg-cream-50'>
          {rankedLawyers.map((lawyer, index) => (
            <li key={lawyer.id}>
              <Reveal delay={index * 0.05}>
                <Link
                  href={`/lawyers/${lawyer.slug}`}
                  className='flex flex-wrap items-center gap-4 rounded-md px-5 py-4 transition-colors hover:bg-whitefocus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-gold-600 sm:flex-nowrap'>
                  <span className='font-heading text-xl font-semibold text-gold-700'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate font-semibold text-navy-900'>
                      {lawyer.name}
                    </p>
                    <p className='truncate text-sm text-muted-600'>
                      {lawyer.title} · {lawyer.location}
                    </p>
                  </div>
                  <Rating
                    rating={lawyer.rating}
                    reviewCount={lawyer.reviewCount}
                    size='sm'
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>

        <Button
          href='/directory?sort=reviews'
          variant='secondary'
          className='self-start'>
          View Full Rankings
        </Button>
      </Container>
    </section>
  );
}
