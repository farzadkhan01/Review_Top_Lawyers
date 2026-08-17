/** @format */

/**
 * Mock data-access layer for practice areas. Same replacement contract as
 * lib/admin/lawyers.js — swap internals for real backend calls later.
 */

import sourcePracticeAreas from "@/data/practiceAreas";
import sourceLawyers from "@/data/lawyers";

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function seedPracticeAreas() {
  return sourcePracticeAreas.map((area) => ({
    ...area,
    id: area.slug,
    status: "active",
    lawyerCount: sourceLawyers.filter((lawyer) =>
      lawyer.practiceAreas.includes(area.slug)
    ).length,
    updatedAt: new Date().toISOString(),
  }));
}

let store = seedPracticeAreas();

export async function getPracticeAreas({ search = "" } = {}) {
  await delay();
  let results = [...store];

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    results = results.filter((area) => area.name.toLowerCase().includes(term));
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPracticeArea(id) {
  await delay(300);
  return store.find((area) => area.id === id) ?? null;
}

export async function createPracticeArea(data) {
  await delay(600);
  const slug =
    data.slug?.trim() ||
    data.name?.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
    `area-${Date.now()}`;

  const record = {
    lawyerCount: 0,
    status: "active",
    ...data,
    id: slug,
    slug,
    updatedAt: new Date().toISOString(),
  };

  store = [record, ...store];
  return record;
}

export async function updatePracticeArea(id, data) {
  await delay(600);
  let updated = null;

  store = store.map((area) => {
    if (area.id !== id) return area;
    updated = { ...area, ...data, updatedAt: new Date().toISOString() };
    return updated;
  });

  if (!updated) {
    throw new Error("Practice area not found.");
  }

  return updated;
}

export async function deletePracticeArea(id) {
  await delay(500);
  store = store.filter((area) => area.id !== id);
  return { success: true };
}
