/** @format */

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function estimateReadingTime(content = "") {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export async function getArticles({
  search = "",
  category = "",
  status = "",
  limit = 50,
  offset = 0,
} = {}) {
  const params = new URLSearchParams({ limit, offset });
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (category) params.append("category", category);

  const res = await fetch(`/api/admin/articles?${params}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch articles");
  const data = await res.json();
  return data.data || [];
}

export async function getArticle(id) {
  const res = await fetch(`/api/admin/articles/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch article");
  const data = await res.json();
  return data.data;
}

export async function createArticle(articleData) {
  const res = await fetch("/api/admin/articles", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(articleData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create article");
  }
  const data = await res.json();
  return data.data;
}

export async function updateArticle(id, articleData) {
  const res = await fetch(`/api/admin/articles/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(articleData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update article");
  }
  const data = await res.json();
  return data.data;
}

export async function deleteArticle(id) {
  const res = await fetch(`/api/admin/articles/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete article");
  return true;
}

export function getCategoryOptions() {
  return [
    { value: "legal-news", label: "Legal News" },
    { value: "practice-guide", label: "Practice Guide" },
    { value: "case-study", label: "Case Study" },
  ];
}
