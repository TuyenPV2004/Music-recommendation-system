import { create } from "zustand";

import { userAPI } from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
  isCheckingAuth: true,

  // Action to log the user in
  login: (userData, token) => {
    localStorage.setItem("token", token);
    set({ user: userData, isAuthenticated: true });
  },

  // Action to log the user out
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },

  // Check valid token on app start
  checkAuth: async () => {
    console.log("[Auth] Starting checkAuth...");
    try {
      const token = localStorage.getItem("token");
      console.log("[Auth] Token found:", !!token);
      if (!token) {
        set({ isCheckingAuth: false, isAuthenticated: false });
        console.log("[Auth] No token, set isCheckingAuth: false");
        return;
      }
      console.log("[Auth] Fetching getMe()...");
      const userData = await userAPI.getMe();
      console.log("[Auth] getMe success");
      set({
        user: userData.data || userData,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.error("[Auth] getMe error:", error);
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
}));

export default useAuthStore;
