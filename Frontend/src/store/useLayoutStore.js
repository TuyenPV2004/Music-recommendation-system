import { create } from "zustand";

const useLayoutStore = create((set) => ({
  isExpanded: true,
  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
  setIsExpanded: (val) => set({ isExpanded: val }),
}));

export default useLayoutStore;
