export const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type Params = Record<string, string | number | undefined>;

function buildQuery(params?: Params) {
  if (!params) return "";
  const esc = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join("&");
  return esc ? `?${esc}` : "";
}

export async function getTools(params?: Params) {
  const q = buildQuery(params);
  const res = await fetch(`${API_BASE}/api/tools${q}`);
  if (!res.ok) throw new Error(`Failed to fetch tools: ${res.status}`);
  return res.json();
}

export async function getTool(id: string) {
  const res = await fetch(`${API_BASE}/api/tools/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Failed to fetch tool ${id}: ${res.status}`);
  return res.json();
}

export async function getApprovedReviews(toolId: string) {
  const res = await fetch(
    `${API_BASE}/api/reviews/${encodeURIComponent(toolId)}`
  );
  if (!res.ok)
    throw new Error(`Failed to fetch reviews for ${toolId}: ${res.status}`);
  return res.json();
}

// Admin: fetch pending reviews across all tools
export async function getPendingReviews(token?: string) {
  const res = await fetch(`${API_BASE}/api/admin/reviews/pending`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to fetch pending reviews: ${res.status}`);
  }

  return res.json();
}

export async function updateReviewStatus(
  reviewId: string,
  status: string,
  token?: string
) {
  const url = `${API_BASE}/api/admin/reviews/${encodeURIComponent(
    reviewId
  )}?status=${encodeURIComponent(status)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      text || `Failed to update review ${reviewId}: ${res.status}`
    );
  }

  return res.json();
}

// Placeholder for authenticated endpoints (create tool, post review) — left for later
export async function postReview(toolId: string, body: any, token?: string) {
  const res = await fetch(
    `${API_BASE}/api/reviews/${encodeURIComponent(toolId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    }
  );
  return res.json();
}

// ----------------------
// Admin / tools management
// ----------------------
export async function createTool(body: any, token?: string) {
  const res = await fetch(`${API_BASE}/api/tools`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Create tool failed: ${res.status}`);
  }

  return res.json();
}

export async function updateToolApi(id: string, body: any, token?: string) {
  const res = await fetch(`${API_BASE}/api/tools/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Update tool failed: ${res.status}`);
  }

  return res.json();
}

export async function deleteToolApi(id: string, token?: string) {
  const res = await fetch(`${API_BASE}/api/tools/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Delete tool failed: ${res.status}`);
  }

  return res.json();
}

// ----------------------
// Auth helpers
// ----------------------
function urlBase64Decode(str: string) {
  // replace url-safe chars and pad
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  try {
    return decodeURIComponent(
      atob(s)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  } catch (e) {
    return atob(s);
  }
}

export function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const json = urlBase64Decode(payload);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

export async function signup(
  username: string,
  password: string,
  role: string = "user"
) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });
  if (!res.ok) throw new Error(`Signup failed: ${res.status}`);
  return res.json();
}

export async function loginApi(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Login failed: ${res.status}`);
  }
  return res.json();
}
