/**
 * Case-insensitive substring filter across a set of object keys.
 * Used by the directory's local filter experience against the demo dataset.
 */
export function filterBySearchTerm(items, term, keys) {
  const normalized = term.trim().toLowerCase();

  if (!normalized) {
    return items;
  }

  return items.filter((item) =>
    keys.some((key) => String(item[key] ?? "").toLowerCase().includes(normalized))
  );
}
