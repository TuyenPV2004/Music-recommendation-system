import axios from "axios";

const API_BASE = "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.detail || error.message || "Lỗi hệ thống";
    return Promise.reject(new Error(message));
  },
);

// ── Authentication ──────────────────────────────────────
export const authAPI = {
  register: (body) => apiClient.post("/auth/register", body),
  login: (body) => apiClient.post("/auth/login", body),
  forgotPassword: (body) => apiClient.post("/auth/forgot-password", body),
  resetPassword: (body) => apiClient.post("/auth/reset-password", body),
};

// ── User Profile ────────────────────────────────────────
export const userAPI = {
  getMe: () => apiClient.get("/users/me"),
  update: (body) => apiClient.put("/users/me", body),
};

// ── Songs ───────────────────────────────────────────────
export const songAPI = {
  list: (params = {}) => apiClient.get("/songs", { params }),
  detail: (id) => apiClient.get(`/songs/${id}`),
  similar: (id, params = {}) => apiClient.get(`/songs/${id}/similar`, { params }),
};

// ── Genres ──────────────────────────────────────────────
export const genreAPI = {
  list: () => apiClient.get("/genres"),
};

// ── Moods ───────────────────────────────────────────────
export const moodAPI = {
  list: () => apiClient.get("/moods"),
};

// ── Interactions ────────────────────────────────────────
export const interactionAPI = {
  play: (body) => apiClient.post("/interactions/play", body),
  rate: (body) => apiClient.post("/interactions/rate", body),
};

// ── Playlists ───────────────────────────────────────────
export const playlistAPI = {
  list: () => apiClient.get("/playlists"),
  create: (body) => apiClient.post("/playlists", body),
  detail: (id) => apiClient.get(`/playlists/${id}`),
  addSong: (playlistId, body) =>
    apiClient.post(`/playlists/${playlistId}/songs`, body),
  removeSong: (playlistId, songId) =>
    apiClient.delete(`/playlists/${playlistId}/songs/${songId}`),
  delete: (id) => apiClient.delete(`/playlists/${id}`),
};

// ── Recommendations ─────────────────────────────────────
export const recommendAPI = {
  mood: (body, params = {}) =>
    apiClient.post("/recommendations/mood", body, { params }),
  hybrid: ( params = {}) =>
    apiClient.get(`/recommendations/recommend`, { params }),
};

// ── Admin ───────────────────────────────────────────────
export const adminAPI = {
  stats: () => apiClient.get("/admin/stats"),
  users: (params = {}) => apiClient.get("/admin/users", { params }),
  songs: (params = {}) => apiClient.get("/admin/songs", { params }),
  genres: () => apiClient.get("/admin/genres"),
  moods: () => apiClient.get("/admin/moods"),
  interactions: (params = {}) =>
    apiClient.get("/admin/interactions", { params }),
  playlists: (params = {}) => apiClient.get("/admin/playlists", { params }),
};
