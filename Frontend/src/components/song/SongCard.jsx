import React, { useState } from "react";
import { Play } from "lucide-react";
import usePlayerStore from "../../store/usePlayerStore";

export default function SongCard({ song }) {
  const [isHovered, setIsHovered] = useState(false);
  const playSong = usePlayerStore((state) => state.playSong);

  const handlePlayClick = () => {
    playSong(song);
  };

  return (
    <div
      className="bg-gray-900/40 hover:bg-gray-800 p-4 rounded-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-gray-700/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4 aspect-square">
        <img
          src={song.cover}
          alt={song.title}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />

        {/* Play Button Overlay */}
        <button
          className={`absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center pl-[3px] text-black shadow-xl transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          } hover:scale-105 hover:bg-green-400`}
          onClick={handlePlayClick}
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
          className="text-sm text-gray-400 truncate hover:underline"
          title={song.artist}
        >
          {song.artist}
        </p>
      </div>
    </div>
  );
}
