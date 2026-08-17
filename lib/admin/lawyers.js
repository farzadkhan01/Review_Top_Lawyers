/** @format */

/**
 * Mock data-access layer for lawyer records. Every export here is the
 * intended replacement point for real backend calls — the admin UI never
 * touches the in-memory store directly.
 */

import sourceLawyers from "@/data/lawyers";
import practiceAreas from "@/data/practiceAreas";

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function seedLawyers() {
  return sourceLawyers.map((lawyer, index) => ({
    id: lawyer.slug,
    slug: lawyer.slug,
    name: lawyer.name,
    title: lawyer.title,
    image: lawyer.image,
    shortBio: lawyer.shortBio,
    fullBio: lawyer.fullBio,
    practiceAreas: [...lawyer.practiceAreas],
    location: lawyer.location,
    firm: "Independent Practice",
    yearsOfExperience: lawyer.yearsOfExperience,
    education: [...lawyer.education],
    languages: [...lawyer.languages],
    barAdmissions: `${lawyer.location.split(", ")[1] ?? ""} State Bar`.trim(),
    email: lawyer.email,
    phone: lawyer.phone,
    website: "",
    featured: index < 3,
    status: index === sourceLawyers.length - 1 ? "inactive" : "active",
    isPublic: true,
    seoTitle: `${lawyer.name} — ${lawyer.specialty}`,
    seoDescription: lawyer.shortBio,
    rating: lawyer.rating,
    reviewCount: lawyer.reviewCount,
    updatedAt: new Date(Date.now() - index * 2 * 86400000).toISOString(),
  }));
}

let lawyersStore = seedLawyers();

export async function getLawyers({
  search = "",
  practiceArea = "",
  status = "",
  location = "",
  sort = "updated",
} = {}) {
  await delay();

  let results = [...lawyersStore];

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    results = results.filter((lawyer) =>
      [lawyer.name, lawyer.location, lawyer.title].some((field) =>
        field?.toLowerCase().includes(term)
      )
    );
  }

  if (practiceArea) {
    results = results.filter((lawyer) =>
      lawyer.practiceAreas.includes(practiceArea)
    );
  }

  if (status) {
    results = results.filter((lawyer) => lawyer.status === status);
  }

  if (location) {
    results = results.filter((lawyer) => lawyer.location === location);
  }

  results = [...results].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "rating") return b.rating - a.rating;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return results;
}

export async function getLawyer(id) {
  await delay(300);
  return lawyersStore.find((lawyer) => lawyer.id === id) ?? null;
}

export async function createLawyer(data) {
  await delay(700);
  const slug =
    data.slug?.trim() ||
    data.name?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
    `lawyer-${Date.now()}`;

  const record = {
    rating: 0,
    reviewCount: 0,
    ...data,
    id: slug,
    slug,
    updatedAt: new Date().toISOString(),
  };

  lawyersStore = [record, ...lawyersStore];
  return record;
}

export async function updateLawyer(id, data) {
  await delay(700);
  let updated = null;

  lawyersStore = lawyersStore.map((lawyer) => {
    if (lawyer.id !== id) return lawyer;
    updated = { ...lawyer, ...data, updatedAt: new Date().toISOString() };
    return updated;
  });

  if (!updated) {
    throw new Error("Lawyer not found.");
  }

  return updated;
}

export async function deleteLawyer(id) {
  await delay(600);
  lawyersStore = lawyersStore.filter((lawyer) => lawyer.id !== id);
  return { success: true };
}

export function getPracticeAreaOptions() {
  return practiceAreas.map((area) => ({ value: area.slug, label: area.name }));
}

export function getLocationOptions() {
  return Array.from(new Set(sourceLawyers.map((lawyer) => lawyer.location))).sort();
}
