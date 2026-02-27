import { create } from "zustand";

const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  playlist: [],
  currentRating: 0,
  isShuffle: false,
  repeatMode: "off", // "off" | "all" | "one"

  // Action to set and play a specific song
  playSong: (song) =>
    set({ currentSong: song, isPlaying: true, currentRating: 0 }),

  // Actions for playback control
  togglePlay: () =>
    set((state) => ({
      isPlaying: state.currentSong ? !state.isPlaying : false,
    })),

  // Playlist management
  setPlaylist: (songs) => set({ playlist: songs }),

  // Play next song
  playNext: () => {
    const { playlist, currentSong, isShuffle } = get();
    if (!playlist.length) return;

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      set({
        currentSong: playlist[randomIndex],
        isPlaying: true,
        currentRating: 0,
      });
      return;
    }

    const currentIndex = playlist.findIndex((s) => s.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    set({
      currentSong: playlist[nextIndex],
      isPlaying: true,
      currentRating: 0,
    });
  },

  // Play previous song
  playPrevious: () => {
    const { playlist, currentSong } = get();
    if (!playlist.length) return;

    const currentIndex = playlist.findIndex((s) => s.id === currentSong?.id);
    const prevIndex =
      currentIndex <= 0 ? playlist.length - 1 : currentIndex - 1;
    set({
      currentSong: playlist[prevIndex],
      isPlaying: true,
      currentRating: 0,
    });
  },

  // Toggle shuffle
  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

  // Cycle repeat mode: off -> all -> one -> off
  toggleRepeat: () =>
    set((state) => ({
      repeatMode:
        state.repeatMode === "off"
          ? "all"
          : state.repeatMode === "all"
            ? "one"
            : "off",
    })),

  // Action to set rating (shared between MusicPlayer and SongDetailPage)
  setRating: (rating) => set({ currentRating: rating }),

  // Action to close the player
  closePlayer: () =>
    set({ currentSong: null, isPlaying: false, currentRating: 0 }),
}));

export default usePlayerStore;
