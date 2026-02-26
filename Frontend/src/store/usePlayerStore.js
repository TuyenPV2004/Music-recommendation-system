import { create } from "zustand";

const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  playlist: [],
  currentIndex: -1,

  // Phát một bài, tuỳ chọn truyền cả playlist để bật next/prev
  playSong: (song, playlist = null) => {
    const list = playlist || get().playlist;
    const index = list.findIndex((s) => s.id === song.id);
    set({ currentSong: song, isPlaying: true, playlist: list, currentIndex: index });
  },

  // Lưu playlist (gọi từ trang kết quả trước khi playSong)
  setPlaylist: (songs) => set({ playlist: songs }),

  togglePlay: () =>
    set((state) => ({
      isPlaying: state.currentSong ? !state.isPlaying : false,
    })),

  nextSong: () => {
    const { playlist, currentIndex } = get();
    if (!playlist.length) return;
    const next = (currentIndex + 1) % playlist.length;
    set({ currentSong: playlist[next], isPlaying: true, currentIndex: next });
  },

  prevSong: () => {
    const { playlist, currentIndex } = get();
    if (!playlist.length) return;
    const prev = (currentIndex - 1 + playlist.length) % playlist.length;
    set({ currentSong: playlist[prev], isPlaying: true, currentIndex: prev });
  },

  closePlayer: () => set({ currentSong: null, isPlaying: false }),
}));

export default usePlayerStore;
