import Rating from "@/components/lawyers/Rating";

function formatReviewDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ReviewList({ reviews }) {
  if (!reviews?.length) {
    return <p className="text-sm text-muted-600">No reviews yet.</p>;
  }

  return (
    <ul className="divide-y divide-cream-200">
      {reviews.map((review, index) => (
        <li key={`${review.reviewerName}-${index}`} className="py-6 first:pt-0 last:pb-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-navy-900">{review.reviewerName}</p>
            <time dateTime={review.date} className="text-sm text-muted-400">
              {formatReviewDate(review.date)}
            </time>
          </div>
          <Rating rating={review.rating} size="sm" showCount={false} className="mt-1" />
          <p className="mt-3 break-words text-sm leading-relaxed text-muted-600">{review.text}</p>
        </li>
      ))}
    </ul>
  );
}
