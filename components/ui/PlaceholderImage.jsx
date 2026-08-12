/** @format */

import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Base image block for placeholder/editorial imagery. A fixed aspect ratio
 * wrapper avoids layout shift; swap `src` for a real client asset later —
 * no other markup needs to change.
 */
export default function PlaceholderImage({
  src,
  alt,
  aspect = 'aspect-[4/3]',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  className,
}) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg bg-cream-100',
        aspect,
        className,
      )}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className='object-cover'
        unoptimized
      />
    </div>
  );
}
