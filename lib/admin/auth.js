/** @format */

/**
 * Mock authentication boundary for the admin frontend.
 * Replace the internals of these three functions with real backend calls —
 * the UI only ever imports getCurrentAdmin / login / logout from here.
 */

const STORAGE_KEY = "rtl_admin_session";

// Demo-only credentials for exercising the UI. Not a real security layer.
const MOCK_ADMIN = {
  id: "admin-1",
  name: "Jordan Casey",
  email: "admin@reviewtoplawyers.com",
  role: "Administrator",
  avatar: null,
};

const MOCK_PASSWORD = "admin123";

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export async function getCurrentAdmin() {
  await delay(200);
  return readSession() ? MOCK_ADMIN : null;
}

export async function login({ email, password, remember = false }) {
  await delay(700);

  if (
    email?.trim().toLowerCase() !== MOCK_ADMIN.email ||
    password !== MOCK_PASSWORD
  ) {
    const error = new Error("Invalid email or password.");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  writeSession({ email: MOCK_ADMIN.email, remember, issuedAt: Date.now() });
  return MOCK_ADMIN;
}

export async function logout() {
  await delay(200);
  clearSession();
}
