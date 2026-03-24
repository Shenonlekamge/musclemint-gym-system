// src/lib/auth.js
export const AUTH_KEY = "MuscleMint_auth";

export function saveAuth(data) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function authHeader() {
  const a = getAuth();
  return a?.token ? { Authorization: `Bearer ${a.token}` } : {};
}