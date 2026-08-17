/** @format */

/**
 * Mock data-access layer for article records. Same replacement contract as
 * lib/admin/lawyers.js — the admin UI only ever imports these functions, so
 * a backend developer can swap the internals for real API calls later.
 */

import sourceArticles from "@/data/articles";
import practiceAreas from "@/data/practiceAreas";

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

function seedArticles() {
  return sourceArticles.map((article, index) => ({
    ...article,
    status: index >= sourceArticles.length - 2 ? "draft" : "published",
    seoTitle: article.title,
    seoDescription: article.excerpt,
    createdAt: new Date(Date.now() - (index + 10) * 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - index * 3 * 86400000).toISOString(),
  }));
}

let articlesStore = seedArticles();

export async function getArticles({
  search = "",
  category = "",
  status = "",
  sort = "updated",
} = {}) {
  await delay();

  let results = [...articlesStore];

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    results = results.filter((article) =>
      [article.title, article.author].some((field) => field?.toLowerCase().includes(term))
    );
  }

  if (category) {
    results = results.filter((article) => article.category === category);
  }

  if (status) {
    results = results.filter((article) => article.status === status);
  }

  results = [...results].sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "published") return new Date(b.publishedAt) - new Date(a.publishedAt);
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return results;
}

export async function getArticle(id) {
  await delay(300);
  return articlesStore.find((article) => article.id === id) ?? null;
}

export async function createArticle(data) {
  await delay(700);

  const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title || "") || `article-${Date.now()}`;
  const now = new Date().toISOString();

  const record = {
    ...data,
    id: slug,
    slug,
    readingTime: estimateReadingTime(data.content),
    publishedAt: data.publishedAt || now.slice(0, 10),
    createdAt: now,
    updatedAt: now,
  };

  articlesStore = [record, ...articlesStore];
  return record;
}

export async function updateArticle(id, data) {
  await delay(700);
  let updated = null;

  articlesStore = articlesStore.map((article) => {
    if (article.id !== id) return article;
    updated = {
      ...article,
      ...data,
      readingTime: data.content !== undefined ? estimateReadingTime(data.content) : article.readingTime,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });

  if (!updated) {
    throw new Error("Article not found.");
  }

  return updated;
}

export async function deleteArticle(id) {
  await delay(600);
  articlesStore = articlesStore.filter((article) => article.id !== id);
  return { success: true };
}

export function getCategoryOptions() {
  return practiceAreas.map((area) => ({ value: area.name, label: area.name }));
}
