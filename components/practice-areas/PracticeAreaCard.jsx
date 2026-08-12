import Link from "next/link";
import Card from "@/components/ui/Card";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function PracticeAreaCard({ area }) {
  return (
    <Card as="article" className="h-full p-5">
      <Link
        href={`/directory/${area.slug}`}
        className="flex h-full flex-col gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-600"
      >
        <h3 className="font-heading text-lg font-semibold text-navy-900">{area.name}</h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-600">{area.description}</p>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-700">
          Browse Lawyers
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </Link>
    </Card>
  );
}
