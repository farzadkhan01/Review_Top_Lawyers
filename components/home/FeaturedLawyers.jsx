/** @format */

import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import LawyerGrid from '@/components/lawyers/LawyerGrid';

async function getFeaturedLawyers() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const res = await fetch(
      `${baseUrl}/api/public/lawyers?featured=true&visibility=public&limit=6`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch featured lawyers:', error);
    return [];
  }
}

export default async function FeaturedLawyers() {
  const lawyers = await getFeaturedLawyers();

  return (
    <section className='bg-cream-50 py-20 sm:py-24'>
      <Container className='flex flex-col gap-10'>
        <SectionHeading
          eyebrow='Featured Lawyers'
          title='Meet Highly Rated Lawyers'
          description='A sample of lawyer profiles from directory, highlighted by rating. Explore the full directory to see every practice area and location.'
        />

        <LawyerGrid lawyers={lawyers} />

        <Button
          href='/directory'
          variant='secondary'
          className='self-start'>
          View All Lawyers
        </Button>
      </Container>
    </section>
  );
}
