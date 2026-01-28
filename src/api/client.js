import { getAccessToken, setAccessToken } from "./auth";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

export async function apiRequest(path, { method = "GET", body, auth = true } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    // If token is expired/invalid, force logout + redirect to login.
    // This keeps UX clean when backend returns 401/403 (common for expired JWT).
    if (auth && (res.status === 401 || res.status === 403)) {
      try {
        setAccessToken(null);
      } catch {
        // ignore
      }
      try {
        const base = process.env.NODE_ENV === "production" ? "/apex-platform" : "";
        const loginPath = `${base}/login`;
        if (!window.location.pathname.endsWith("/login")) {
          window.location.assign(loginPath);
        }
      } catch {
        // ignore (e.g. non-browser env)
      }
    }

    const msg =
      data?.message ||
      data?.error ||
      `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.details = data?.details;
    const retryAfter = res.headers.get("Retry-After");
    if (retryAfter) {
      const n = Number.parseInt(retryAfter, 10);
      if (!Number.isNaN(n)) err.retryAfterSeconds = n;
    }
    throw err;
  }

  return data;
}

export const apiGet = (path, opts) => apiRequest(path, { ...opts, method: "GET" });
export const apiPost = (path, body, opts) => apiRequest(path, { ...opts, method: "POST", body });
export const apiPut = (path, body, opts) => apiRequest(path, { ...opts, method: "PUT", body });
export const apiDelete = (path, opts) => apiRequest(path, { ...opts, method: "DELETE" });

