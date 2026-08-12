import Image from "next/image";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Rating from "@/components/lawyers/Rating";
import { ArrowRightIcon } from "@/components/ui/icons";
import practiceAreasData from "@/data/practiceAreas";
import { getPracticeAreasForLawyer } from "@/lib/utils";

export default function LawyerCard({ lawyer }) {
  const areas = getPracticeAreasForLawyer(lawyer, practiceAreasData);
  const primaryArea = areas[0];

  return (
    <Card as="article" className="flex h-full flex-col gap-4 p-5">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-cream-100">
          <Image
            src={lawyer.image}
            alt={`Profile placeholder for ${lawyer.name}`}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-heading text-lg font-semibold text-navy-900">
            <Link
              href={`/lawyers/${lawyer.slug}`}
              className="rounded hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
            >
              {lawyer.name}
            </Link>
          </h3>
          <p className="truncate text-sm text-muted-600">{lawyer.title}</p>
          <p className="mt-1 truncate text-sm text-muted-400">{lawyer.location}</p>
        </div>
      </div>

      {primaryArea && <Badge variant="outline">{primaryArea.name}</Badge>}

      <Rating rating={lawyer.rating} reviewCount={lawyer.reviewCount} size="sm" />

      <p className="line-clamp-2 flex-1 break-words text-sm leading-relaxed text-muted-600">
        {lawyer.shortBio}
      </p>

      <Link
        href={`/lawyers/${lawyer.slug}`}
        className="mt-auto inline-flex items-center gap-1.5 rounded text-sm font-semibold text-navy-900 hover:text-gold-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        View Profile
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </Card>
  );
}
