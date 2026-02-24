import { create } from "zustand";

const usePlayerStore = create((set) => ({
  currentSong: null,
  isPlaying: false,
  playlist: [],

  // Action to set and play a specific song
  playSong: (song) => set({ currentSong: song, isPlaying: true }),

  // Actions for playback control
  togglePlay: () =>
    set((state) => ({
      isPlaying: state.currentSong ? !state.isPlaying : false,
    })),

  // Future actions (e.g. queue, next, previous)
  setPlaylist: (songs) => set({ playlist: songs }),

  // Action to close the player
  closePlayer: () => set({ currentSong: null, isPlaying: false }),
}));

export default usePlayerStore;
