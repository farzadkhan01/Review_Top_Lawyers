/** @format */

import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import {
  ScaleIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
} from '@/components/ui/icons';

const FEATURES = [
  {
    icon: ScaleIcon,
    title: 'Browse by Practice Area',
    description:
      'Filter lawyers by the type of legal help you need, from family law to business disputes.',
  },
  {
    icon: MapPinIcon,
    title: 'Find Lawyers Near You',
    description:
      'Narrow your search by location to find lawyers who serve your area.',
  },
  {
    icon: StarIcon,
    title: 'Read Ratings And Reviews',
    description:
      'Compare ratings and reviews to understand what past clients experienced.',
  },
  {
    icon: UsersIcon,
    title: 'Compare Profiles Side by Side',
    description:
      'Review experience, education, and specialties to find a lawyer that fits your needs.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className='bg-cream-50 py-20 sm:py-24'>
      <Container className='flex flex-col gap-12'>
        <SectionHeading
          eyebrow='Why Review Top Lawyers'
          title='A Clearer Way to Find Legal Help'
          description='Review Top Lawyers brings together practice areas, locations, and reviews in one place, so you can make an informed decision instead of starting from scratch.'
        />

        <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          {FEATURES.map((feature, index) => (
            <Reveal
              key={feature.title}
              delay={index * 0.05}>
              <div className='flex flex-col gap-3'>
                <span className='flex h-11 w-11 items-center justify-center rounded-full bg-navy-900/5 text-navy-800'>
                  <feature.icon className='h-5 w-5' />
                </span>
                <h3 className='font-heading text-lg font-semibold text-navy-900'>
                  {feature.title}
                </h3>
                <p className='text-sm leading-relaxed text-muted-600'>
                  {feature.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
