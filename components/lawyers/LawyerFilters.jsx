/** @format */

'use client';

import { useMemo, useState } from 'react';
import { filterBySearchTerm } from '@/lib/search';
import LawyerGrid from '@/components/lawyers/LawyerGrid';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { SearchIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'name', label: 'Name A–Z' },
];

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value);

const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '4.8', label: '4.8 & up' },
  { value: '4.5', label: '4.5 & up' },
  { value: '4', label: '4.0 & up' },
];

const FIELD_CLASSES =
  'w-full rounded-md border border-navy-900/15 bg-white px-3 py-2.5 text-sm text-navy-900 focus:border-navy-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-600';

function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className='mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-600'>
      {children}
    </label>
  );
}

export default function LawyerFilters({
  lawyers,
  practiceAreas,
  initialSearch = '',
  initialSort = 'rating',
  initialPracticeArea = '',
  lockedPracticeArea,
}) {
  const [search, setSearch] = useState(initialSearch);
  const [practiceArea, setPracticeArea] = useState(
    lockedPracticeArea ?? initialPracticeArea,
  );
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState(
    SORT_VALUES.includes(initialSort) ? initialSort : 'rating',
  );

  const locations = useMemo(
    () => Array.from(new Set(lawyers.map((lawyer) => lawyer.location))).sort(),
    [lawyers],
  );

  const results = useMemo(() => {
    let list = filterBySearchTerm(lawyers, search, [
      'name',
      'location',
      'specialty',
      'title',
      'practiceAreas',
    ]);

    if (practiceArea) {
      list = list.filter((lawyer) =>
        lawyer.practiceAreas.includes(practiceArea),
      );
    }

    if (location) {
      list = list.filter((lawyer) => lawyer.location === location);
    }

    if (minRating) {
      list = list.filter((lawyer) => lawyer.rating >= Number(minRating));
    }

    return [...list].sort((a, b) => {
      if (sort === 'reviews') return b.reviewCount - a.reviewCount;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return b.rating - a.rating;
    });
  }, [lawyers, search, practiceArea, location, minRating, sort]);

  const hasActiveFilters =
    Boolean(search) ||
    practiceArea !== (lockedPracticeArea ?? '') ||
    Boolean(location) ||
    Boolean(minRating) ||
    sort !== 'rating';

  function resetFilters() {
    setSearch('');
    setPracticeArea(lockedPracticeArea ?? '');
    setLocation('');
    setMinRating('');
    setSort('rating');
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='rounded-lg border border-cream-200 bg-white p-5 sm:p-6'>
        <div className='flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end'>
          <div className='flex-1 lg:min-w-55'>
            <FieldLabel htmlFor='directory-search'>Search</FieldLabel>
            <div className='relative'>
              <SearchIcon className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-400' />
              <input
                id='directory-search'
                type='search'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder='Name, practice area, or location...'
                className={cn(FIELD_CLASSES, 'pl-9')}
              />
            </div>
          </div>

          {!lockedPracticeArea && (
            <div className='lg:w-48'>
              <FieldLabel htmlFor='directory-practice-area'>
                Practice Area
              </FieldLabel>
              <select
                id='directory-practice-area'
                value={practiceArea}
                onChange={(event) => setPracticeArea(event.target.value)}
                className={FIELD_CLASSES}>
                <option value=''>All Practice Areas</option>
                {practiceAreas.map((area) => (
                  <option
                    key={area.slug}
                    value={area.slug}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className='lg:w-44'>
            <FieldLabel htmlFor='directory-location'>Location</FieldLabel>
            <select
              id='directory-location'
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className={FIELD_CLASSES}>
              <option value=''>All Locations</option>
              {locations.map((item) => (
                <option
                  key={item}
                  value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className='lg:w-40'>
            <FieldLabel htmlFor='directory-rating'>Rating</FieldLabel>
            <select
              id='directory-rating'
              value={minRating}
              onChange={(event) => setMinRating(event.target.value)}
              className={FIELD_CLASSES}>
              {RATING_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className='lg:w-44'>
            <FieldLabel htmlFor='directory-sort'>Sort By</FieldLabel>
            <select
              id='directory-sort'
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className={FIELD_CLASSES}>
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 pt-4'>
          <p
            aria-live='polite'
            className='text-sm text-muted-600'>
            {results.length} lawyer{results.length === 1 ? '' : 's'} found
          </p>
          {hasActiveFilters && (
            <Button
              type='button'
              variant='ghost'
              onClick={resetFilters}>
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      <LawyerGrid
        lawyers={results}
        emptyState={
          <EmptyState
            title='No lawyers matched your search'
            description='Try adjusting or resetting your filters to see more results.'
            action={
              <Button
                type='button'
                variant='secondary'
                onClick={resetFilters}>
                Reset Filters
              </Button>
            }
          />
        }
      />
    </div>
  );
}
