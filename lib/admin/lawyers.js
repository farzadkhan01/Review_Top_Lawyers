/** @format */

export async function getLawyers({
  search = "",
  practiceArea = "",
  status = "",
  location = "",
  sort = "updated",
  limit = 50,
  offset = 0,
} = {}) {
  const params = new URLSearchParams({
    limit,
    offset,
    sort,
  });
  if (search) params.append("search", search);
  if (practiceArea) params.append("practice_area_id", practiceArea);
  if (status) params.append("status", status);

  const res = await fetch(`/api/admin/lawyers?${params}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch lawyers");
  const data = await res.json();
  return data.data || [];
}

export async function getLawyer(id) {
  const res = await fetch(`/api/admin/lawyers/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch lawyer");
  const data = await res.json();
  return data.data;
}

export async function createLawyer(lawyerData) {
  const res = await fetch("/api/admin/lawyers", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lawyerData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create lawyer");
  }
  const data = await res.json();
  return data.data;
}

export async function updateLawyer(id, lawyerData) {
  const res = await fetch(`/api/admin/lawyers/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lawyerData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update lawyer");
  }
  const data = await res.json();
  return data.data;
}

export async function deleteLawyer(id) {
  const res = await fetch(`/api/admin/lawyers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete lawyer");
  return true;
}

export function getPracticeAreaOptions() {
  return [
    { value: "1", label: "Personal Injury" },
    { value: "2", label: "Auto Accident" },
    { value: "3", label: "Real Estate" },
    { value: "4", label: "Business Law" },
    { value: "5", label: "Family Law" },
    { value: "6", label: "Criminal Defense" },
    { value: "7", label: "Tax Law" },
    { value: "8", label: "Intellectual Property" },
    { value: "9", label: "Employment Law" },
    { value: "10", label: "Estate Planning" },
  ];
}

export function getLocationOptions() {
  return ["Austin, TX", "New York, NY", "Los Angeles, CA"];
}
