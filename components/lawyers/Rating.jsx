import { StarIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

function StarRow({ className }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon key={index} className={className} />
      ))}
    </div>
  );
}

export default function Rating({ rating, reviewCount, size = "md", showCount = true, className }) {
  const starClass = SIZE_CLASSES[size];
  const fillPercentage = Math.max(0, Math.min(100, (rating / 5) * 100));
  const hasReviewCount = typeof reviewCount === "number";
  const label = `Rated ${rating.toFixed(1)} out of 5${
    hasReviewCount ? ` based on ${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}` : ""
  }`;

  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      role="img"
      aria-label={label}
    >
      <div className="relative inline-flex">
        <StarRow className={cn(starClass, "text-navy-900/10")} />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
          <StarRow className={cn(starClass, "text-gold-500")} />
        </div>
      </div>
      <span className="text-sm font-semibold text-navy-900">{rating.toFixed(1)}</span>
      {showCount && hasReviewCount && (
        <span className="text-sm text-muted-600">
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
}
