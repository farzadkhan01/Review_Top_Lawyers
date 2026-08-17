/** @format */

/**
 * Mock data-access layer for reviews, flattened from each lawyer's embedded
 * review list. Same replacement contract as the other lib/admin modules.
 */

import sourceLawyers from "@/data/lawyers";

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function seedReviews() {
  const statuses = ["published", "published", "pending", "hidden"];
  let counter = 0;

  return sourceLawyers.flatMap((lawyer) =>
    (lawyer.reviews ?? []).map((review) => {
      const status = statuses[counter % statuses.length];
      counter += 1;
      return {
        id: `review-${counter}`,
        lawyerId: lawyer.slug,
        lawyerName: lawyer.name,
        reviewerName: review.reviewerName,
        rating: review.rating,
        text: review.text,
        date: review.date,
        status,
      };
    })
  );
}

let store = seedReviews();

export async function getReviews({ search = "", status = "", lawyerId = "" } = {}) {
  await delay();
  let results = [...store];

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    results = results.filter((review) =>
      [review.reviewerName, review.lawyerName, review.text].some((field) =>
        field?.toLowerCase().includes(term)
      )
    );
  }

  if (status) results = results.filter((review) => review.status === status);
  if (lawyerId) results = results.filter((review) => review.lawyerId === lawyerId);

  return [...results].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function updateReviewStatus(id, status) {
  await delay(500);
  let updated = null;

  store = store.map((review) => {
    if (review.id !== id) return review;
    updated = { ...review, status };
    return updated;
  });

  if (!updated) {
    throw new Error("Review not found.");
  }

  return updated;
}

export async function deleteReview(id) {
  await delay(500);
  store = store.filter((review) => review.id !== id);
  return { success: true };
}
