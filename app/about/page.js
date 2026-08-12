/** @format */

import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import ImageTextSection from '@/components/ui/ImageTextSection';
import { ScaleIcon, UsersIcon, StarIcon } from '@/components/ui/icons';
import lawyers from '@/data/lawyers';
import practiceAreas from '@/data/practiceAreas';
import articles from '@/data/articles';

import {
  PLACEHOLDER_IMAGE_OFFICE,
  PLACEHOLDER_IMAGE_DOCUMENTS,
} from '@/lib/constants';
import RankingSection from '@/components/home/RankingSection';

export const metadata = {
  title: 'About',
  description:
    "Learn what Review Top Lawyers is, how the directory works, and the platform's approach to helping you find a lawyer.",
};

const STEPS = [
  {
    icon: ScaleIcon,
    title: 'Browse by Practice Area',
    description:
      'Start with the type of legal help you need, from personal injury to estate planning.',
  },
  {
    icon: UsersIcon,
    title: 'Compare Profiles',
    description:
      'Review experience, education, and specialties across multiple lawyers at once.',
  },
  {
    icon: StarIcon,
    title: 'Reach Out With Confidence',
    description:
      'Contact the lawyer who feels like the right fit, backed by ratings and reviews.',
  },
];

const STATS = [
  { value: lawyers.length, label: 'Lawyer Profiles' },
  { value: practiceAreas.length, label: 'Practice Areas' },
  { value: articles.length, label: 'Articles & Guides' },
];

export default function AboutPage() {
  return (
    <>
      <section className='border-b border-cream-200 bg-cream-50 py-16 sm:py-20'>
        <Container className='flex flex-col gap-6'>
          <SectionHeading
            titleAs='h1'
            eyebrow='About'
            title='About Review Top Lawyers'
            description='Review Top Lawyers is a directory built to make finding the right lawyer more straightforward. Instead of starting from a blank search, you can browse by practice area, compare profiles side by side, and read ratings and reviews before deciding who to contact.'
          />

          <div className='flex flex-wrap gap-8 border-t border-cream-200 pt-6'>
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className='font-heading text-3xl font-semibold text-navy-900'>
                  {stat.value}
                </p>
                <p className='text-sm text-muted-600'>{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className='bg-white py-16 sm:py-20'>
        <Container className='flex flex-col gap-16 lg:gap-20'>
          <ImageTextSection
            image={'/image-1.png'}
            imageAlt='Placeholder illustration representing a professional office setting'>
            <Reveal>
              <h2 className='font-heading text-2xl font-semibold text-navy-900'>
                What We Do
              </h2>
              <p className='mt-4 text-base leading-relaxed text-muted-600'>
                Review Top Lawyers organizes lawyer information into a
                consistent, easy-to-scan format. Every profile includes practice
                areas, location, experience, education, and reviews, so you can
                compare lawyers on the details that matter to your situation
                instead of piecing together information from scattered sources.
              </p>
            </Reveal>
          </ImageTextSection>

          <ImageTextSection
            image={'/image2.png'}
            imageAlt='Placeholder illustration representing organized legal documents'
            reverse>
            <Reveal delay={0.05}>
              <h2 className='font-heading text-2xl font-semibold text-navy-900'>
                How the Directory Works
              </h2>
              <p className='mt-4 text-base leading-relaxed text-muted-600'>
                The directory groups lawyers by practice area and location, and
                lets you filter and sort by rating or activity. Each profile
                page includes a full biography, professional background, and
                reviews, giving you a fuller picture than a name and phone
                number alone.
              </p>
            </Reveal>
          </ImageTextSection>
        </Container>
      </section>

      <section className='bg-cream-50 py-16 sm:py-20'>
        <Container className='flex flex-col gap-10'>
          <SectionHeading
            eyebrow='How It Works'
            title='Three Steps to Finding a Lawyer'
          />

          <div className='grid grid-cols-1 gap-8 sm:grid-cols-3'>
            {STEPS.map((step, index) => (
              <Reveal
                key={step.title}
                delay={index * 0.05}>
                <div className='flex flex-col gap-3'>
                  <span className='flex h-11 w-11 items-center justify-center rounded-full bg-navy-900/5 text-navy-800'>
                    <step.icon className='h-5 w-5' />
                  </span>
                  <h3 className='font-heading text-lg font-semibold text-navy-900'>
                    {step.title}
                  </h3>
                  <p className='text-sm leading-relaxed text-muted-600'>
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Demo Data Note (Says that profiles and info in this website is demo) */}
      {/* <section className='bg-white py-16 sm:py-20'>
        <Container>
          <Reveal className='mx-auto max-w-2xl rounded-lg border border-cream-200 bg-cream-50 p-8 text-center'>
            <h2 className='font-heading text-xl font-semibold text-navy-900'>
              A Note on Our Current Content
            </h2>
            <p className='mt-3 text-sm leading-relaxed text-muted-600'>
              Review Top Lawyers is currently in active development. The lawyer
              profiles, reviews, and ratings shown today are fictional demo
              content used to build and test the platform, not verified
              real-world listings. As real lawyer data becomes available, it
              will replace this demo content using the same profile structure
              you see now.
            </p>
          </Reveal>
        </Container>
      </section> */}

      <section className='bg-navy-900 py-16 text-cream-50 sm:py-20'>
        <Container>
          <Reveal className='flex flex-col items-center gap-4'>
            <h2 className='font-heading text-2xl font-semibold sm:text-3xl'>
              Ready to Explore?
            </h2>
            <p className='max-w-xl text-cream-100/80 text-center'>
              Browse the directory to see practice areas, lawyer profiles, and
              reviews for yourself.
            </p>
            <Button
              href='/directory'
              variant='light'
              size='lg'>
              Browse the Directory
            </Button>
          </Reveal>
        </Container>
      </section>

      <RankingSection />
    </>
  );
}
