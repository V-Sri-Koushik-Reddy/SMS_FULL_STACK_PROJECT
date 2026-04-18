// =====================================================
// auth.js
// Token helpers + authenticated fetch wrapper.
// Imported by both auth.html and index.html.
// =====================================================

const BASE_URL = "http://localhost:5004";

/* ── Token storage ─────────────────────────────────── */

/** Save the JWT and optional user object to localStorage */
function saveAuth(token, user) {
  localStorage.setItem("scholar_token", token);
  if (user) localStorage.setItem("scholar_user", JSON.stringify(user));
}

/** Retrieve the JWT string, or null if not present */
function getToken() {
  return localStorage.getItem("scholar_token");
}

/** Retrieve the stored user object, or null */
function getUser() {
  const raw = localStorage.getItem("scholar_user");
  try { return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}

/** Remove all auth data and redirect to login */
function logout() {
  localStorage.removeItem("scholar_token");
  localStorage.removeItem("scholar_user");
  window.location.href = "auth.html";
}

/** Return true when a token exists in storage (no verification — that's the server's job) */
function isLoggedIn() {
  return !!getToken();
}

/* ── Auth guard ────────────────────────────────────── */

/**
 * Call at the top of any page that requires authentication.
 * Redirects to auth.html if no token is found.
 */
function requireAuth() {
  if (!isLoggedIn()) {
window.location.href = "auth.html";
  }
}

/**
 * Call at the top of auth.html.
 * If a token already exists, skip straight to the dashboard.
 */
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = "index.html";
  }
}

/* ── Authenticated fetch wrapper ───────────────────── */

/**
 * A drop-in replacement for fetch() that automatically:
 *   • Attaches Authorization: Bearer <token>
 *   • Sets Content-Type: application/json for non-GET requests
 *   • On 401 → clears storage and redirects to login
 *
 * @param {string} path   API path relative to BASE_URL  (e.g. "/students")
 * @param {object} opts   Standard fetch options (method, body, etc.)
 * @returns {Promise<Response>}
 */
async function authFetch(path, opts = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...opts, headers });

  // Token expired / invalid — force re-login
  if (res.status === 401) {
    logout();
    return res;  // unreachable after redirect, but keeps TypeScript happy
  }

  return res;
}

/* ── Login API call ────────────────────────────────── */

/**
 * POST /auth/login with email and password.
 * On success, saves auth data and returns { success, token, user }.
 * On failure, throws an Error with the server's message.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success:boolean, token:string, user:object }>}
 */
async function apiLogin(email, password) {
  const res  = await fetch(`${BASE_URL}/auth/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, password }),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message || "Login failed.");

  saveAuth(json.token, json.user);
  return json;
}

/* ── Register API call ─────────────────────────────── */

async function apiRegister(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const json = await res.json();

  if (!res.ok) throw new Error(json.message || "Registration failed.");

  return json;
}
