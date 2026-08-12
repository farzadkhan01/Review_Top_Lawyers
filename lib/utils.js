/**
 * Joins conditional class names, skipping falsy values.
 * Kept dependency-free since Tailwind class conflicts are rare in this codebase.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/** Resolves a lawyer's practice-area slugs to their full practice-area records. */
export function getPracticeAreasForLawyer(lawyer, practiceAreas) {
  return practiceAreas.filter((area) => lawyer.practiceAreas.includes(area.slug));
}

/** Other lawyers sharing a practice area or location, best-rated first. */
export function getRelatedLawyers(lawyer, allLawyers, limit = 3) {
  return allLawyers
    .filter((candidate) => candidate.slug !== lawyer.slug)
    .filter(
      (candidate) =>
        candidate.practiceAreas.some((area) => lawyer.practiceAreas.includes(area)) ||
        candidate.location === lawyer.location
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/**
 * Other articles in the same category, padded with the most recent
 * remaining articles so the section is never empty just because the
 * demo dataset has few articles per category.
 */
export function getRelatedArticles(article, allArticles, limit = 3) {
  const others = allArticles.filter((candidate) => candidate.slug !== article.slug);
  const sameCategory = others.filter((candidate) => candidate.category === article.category);

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const remaining = others
    .filter((candidate) => candidate.category !== article.category)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return [...sameCategory, ...remaining].slice(0, limit);
}
