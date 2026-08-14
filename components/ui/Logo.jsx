/** @format */

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SITE_NAME } from '@/lib/constants';
import Image from 'next/image';

/**
 * Text-based brand mark. Replace the monogram span with an <Image> once a
 * real logo asset is available — the surrounding markup/props stay stable.
 */
export default function Logo({
  tone = 'dark',
  footerImage = '',
  className,
  imageClassName = '',
}) {
  return (
    <Link
      href='/'
      className={cn(
        'inline-flex items-center gap-2 font-heading text-lg font-semibold tracking-tight sm:text-xl',
        tone === 'dark' ? 'text-navy-900' : 'text-cream-50',
        className,
      )}>
      {
        <Image
          className={`w-32 h-full object-contain ${imageClassName}`}
          src={footerImage ? footerImage : '/logo.png'}
          width={100}
          height={100}
          unoptimized
          alt='Logo'
        />
      }
    </Link>
  );
}
