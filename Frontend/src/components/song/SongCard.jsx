import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Music } from "lucide-react";
import usePlayerStore from "../../store/usePlayerStore";

export default function SongCard({ song }) {
  const [isHovered, setIsHovered] = useState(false);
  const playSong = usePlayerStore((state) => state.playSong);
  const navigate = useNavigate();

  const handlePlayClick = (e) => {
    e.stopPropagation();
    playSong({
      ...song,
      id: song.id || song.song_id,
      name: song.name || song.title,
      author: song.author || song.artist,
      audio_link: song.audio_link || song.cover,
    });
  };

  const handleCardClick = () => {
    navigate(`/songs/${song.id || song.song_id}`);
  };

  return (
    <div
      className="bg-gray-900/40 hover:bg-gray-800 p-4 rounded-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-gray-700/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="relative mb-4 aspect-square">
        <div className="w-full h-full rounded-lg shadow-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
          <Music className="w-12 h-12 text-white" />
        </div>

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
          title={song.name || song.title}
        >
          {song.name || song.title}
        </h3>
        <p
          className="text-sm text-gray-400 truncate hover:underline"
          title={song.author || song.artist}
        >
          {song.author || song.artist}
        </p>
      </div>
    </div>
  );
}
