/** @format */

import PlaceholderImage from '@/components/ui/PlaceholderImage';
import Reveal from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';

/**
 * Two-column editorial layout pairing arbitrary text content (passed as
 * children) with a supporting image. On mobile the text always leads,
 * followed by the image. On desktop, `reverse` flips which side the image
 * sits on so alternating sections don't feel repetitive.
 */
export default function ImageTextSection({
  image,
  imageAlt,
  reverse = false,
  className,
  children,
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16 w-full',
        className,
      )}>
      <div className={reverse ? 'lg:order-2' : 'lg:order-1'}>{children}</div>
      <div className={reverse ? 'lg:order-1' : 'lg:order-2'}>
        <Reveal delay={0.05}>
          <PlaceholderImage
            src={image}
            alt={imageAlt}
            sizes='(min-width: 1024px) 50vw, 100vw'
          />
        </Reveal>
      </div>
    </div>
  );
}
