const API_BASE = "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: authHeaders(),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Lỗi hệ thống");
  }
  return data;
}

// ── Authentication ──────────────────────────────────────
export const authAPI = {
  register: (body) =>
    request(`${API_BASE}/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body) =>
    request(`${API_BASE}/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  forgotPassword: (body) =>
    request(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  resetPassword: (body) =>
    request(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ── User Profile ────────────────────────────────────────
export const userAPI = {
  getMe: () => request(`${API_BASE}/users/me`),
  update: (body) =>
    request(`${API_BASE}/users/me`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};

// ── Songs ───────────────────────────────────────────────
export const songAPI = {
  list: (params = {}) =>
    request(`${API_BASE}/songs?${new URLSearchParams(params)}`),
  detail: (id) => request(`${API_BASE}/songs/${id}`),
};

// ── Genres ──────────────────────────────────────────────
export const genreAPI = {
  list: () => request(`${API_BASE}/genres`),
};

// ── Moods ───────────────────────────────────────────────
export const moodAPI = {
  list: () => request(`${API_BASE}/moods`),
};

// ── Interactions ────────────────────────────────────────
export const interactionAPI = {
  play: (body) =>
    request(`${API_BASE}/interactions/play`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  rate: (body) =>
    request(`${API_BASE}/interactions/rate`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};

// ── Playlists ───────────────────────────────────────────
export const playlistAPI = {
  list: () => request(`${API_BASE}/playlists`),
  create: (body) =>
    request(`${API_BASE}/playlists`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  detail: (id) => request(`${API_BASE}/playlists/${id}`),
  addSong: (playlistId, body) =>
    request(`${API_BASE}/playlists/${playlistId}/songs`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  removeSong: (playlistId, songId) =>
    request(`${API_BASE}/playlists/${playlistId}/songs/${songId}`, {
      method: "DELETE",
    }),
  delete: (id) =>
    request(`${API_BASE}/playlists/${id}`, {
      method: "DELETE",
    }),
};

// ── Recommendations ─────────────────────────────────────
export const recommendAPI = {
  mood: (body) =>
    request(`${API_BASE}/recommendations/mood`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  hybrid: (params = {}) =>
    request(
      `${API_BASE}/recommendations/hybrid?${new URLSearchParams(params)}`,
    ),
};

// ── Admin ───────────────────────────────────────────────
export const adminAPI = {
  stats: () => request(`${API_BASE}/admin/stats`),
  users: (params = {}) =>
    request(`${API_BASE}/admin/users?${new URLSearchParams(params)}`),
  songs: (params = {}) =>
    request(`${API_BASE}/admin/songs?${new URLSearchParams(params)}`),
  genres: () => request(`${API_BASE}/admin/genres`),
  moods: () => request(`${API_BASE}/admin/moods`),
  interactions: (params = {}) =>
    request(`${API_BASE}/admin/interactions?${new URLSearchParams(params)}`),
  playlists: (params = {}) =>
    request(`${API_BASE}/admin/playlists?${new URLSearchParams(params)}`),
};
