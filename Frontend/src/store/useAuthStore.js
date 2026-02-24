import { create } from "zustand";

// Simple auth store to hold user state
// In a real app, this would be initialized by checking localStorage/cookies for a valid token
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  // Action to log the user in
  login: (userData) => set({ user: userData, isAuthenticated: true }),

  // Action to log the user out
  logout: () => set({ user: null, isAuthenticated: false }),
}));

export default useAuthStore;
