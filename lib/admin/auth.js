/** @format */

export async function getCurrentAdmin() {
  try {
    const res = await fetch("/api/admin/auth/me", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function login({ email, password, remember = false }) {
  const res = await fetch("/api/admin/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Invalid email or password.");
  }

  const data = await res.json();
  return data.user;
}

export async function logout() {
  await fetch("/api/admin/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
