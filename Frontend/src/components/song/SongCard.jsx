import React, { useState } from "react";
import { Play, Music } from "lucide-react";
import usePlayerStore from "../../store/usePlayerStore";

export default function SongCard({ song, playlist }) {
  const [isHovered, setIsHovered] = useState(false);
  const { playSong } = usePlayerStore();

  const handlePlayClick = () => {
    // Truyền cả playlist để bật next/prev
    playSong(song, playlist || null);
  };

  return (
    <div
      className="bg-gray-900/40 hover:bg-gray-800 p-4 rounded-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-gray-700/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4 aspect-square">
        {/* Cover art: dùng ảnh thật nếu có, ngược lại hiển thị placeholder */}
        <div className="w-full h-full rounded-lg shadow-lg bg-gray-800 flex items-center justify-center overflow-hidden">
          {song.cover ? (
            <img
              src={song.cover}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="w-10 h-10 text-gray-600" />
          )}
        </div>

        {/* Play Button Overlay */}
        <button
          className={`absolute bottom-2 right-2 w-12 h-12 ${
            song.preview_url
              ? "bg-green-500 hover:scale-105 hover:bg-green-400"
              : "bg-gray-600 cursor-not-allowed"
          } rounded-full flex items-center justify-center pl-[3px] text-black shadow-xl transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          onClick={song.preview_url ? handlePlayClick : undefined}
          title={song.preview_url ? "ĐẠng bài" : "Không có bản demo"}
        >
          <Play className="w-6 h-6" fill="currentColor" />
        </button>
      </div>

      <div>
        <h3
          className="text-base font-semibold text-white truncate mb-1"
          title={song.title}
        >
          {song.title}
        </h3>
        <p
          className="text-sm text-gray-400 truncate"
          title={song.artist}
        >
          {song.artist}
        </p>
      </div>
    </div>
  );
}
