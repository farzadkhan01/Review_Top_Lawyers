/** @format */

import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { SearchIcon } from '@/components/ui/icons';
import lawyers from '@/data/lawyers';
import practiceAreas from '@/data/practiceAreas';
import ImageTextSection from '@/components/ui/ImageTextSection';

export default function Hero() {
  return (
    <section className='border-b border-cream-200 bg-cream-50 py-20 sm:py-28'>
      <Container className='flex flex-col items-start gap-6'>
        <ImageTextSection
          image={'/home-image.png'}
          imageAlt='Placeholder illustration representing a professional office setting'>
          <div className='space-y-6'>
            <Badge variant='gold'>Trusted Legal Directory</Badge>

            <h1 className='max-w-2xl font-heading text-4xl font-semibold tracking-tight text-navy-900 sm:text-5xl lg:text-6xl'>
              Find the Right Lawyer With Confidence
            </h1>

            <p className='max-w-xl text-lg leading-relaxed text-muted-600'>
              Discover lawyers by practice area and location, compare ratings
              and reviews, and make a confident decision about who represents
              you.
            </p>

            <form
              action='/directory'
              method='GET'
              role='search'
              className='relative w-full max-w-xl'>
              <label
                htmlFor='hero-search'
                className='sr-only'>
                Search lawyers, practice areas, or locations
              </label>
              <SearchIcon className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-400' />
              <input
                id='hero-search'
                type='search'
                name='q'
                placeholder='Search by name, practice area, or location...'
                className='w-full rounded-md border border-navy-900/15 bg-white py-3.5 pl-12 pr-24 text-base text-navy-900 placeholder:text-muted-400 focus:border-navy-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600 sm:pr-28'
              />
              <button
                type='submit'
                className='absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-navy-900 px-3 py-2 text-sm font-medium text-cream-50 transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600 sm:px-4'>
                Search
              </button>
            </form>

            <div className='flex flex-col gap-3 sm:flex-row'>
              <Button
                href='/directory'
                variant='primary'
                size='lg'>
                Explore Top Lawyers
              </Button>
              <Button
                href='/directory?sort=rating'
                variant='secondary'
                size='lg'>
                View Rankings
              </Button>
            </div>

            <p className='text-sm text-muted-400'>
              {lawyers.length} lawyer profiles across {practiceAreas.length}{' '}
              practice areas.
            </p>
          </div>
        </ImageTextSection>
      </Container>
    </section>
  );
}
