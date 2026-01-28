import { apiGet, apiPost } from "./client";

export const TOKEN_KEY = "apex_access_token";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export async function login({ email, password }) {
  const res = await apiPost("/auth/login", { email, password }, { auth: false });
  setAccessToken(res.accessToken);
  return res;
}

export async function logout() {
  // best-effort server logout (revokes jti); then clear local token
  try {
    await apiPost("/auth/logout", {}, { auth: true });
  } finally {
    setAccessToken(null);
  }
}

export async function getMe() {
  return apiGet("/me", { auth: true });
}
