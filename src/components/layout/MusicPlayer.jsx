import React, { useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Star,
  X,
  Shuffle,
  Repeat,
  MonitorSpeaker,
  Volume2,
  Maximize,
} from "lucide-react";
import usePlayerStore from "../../store/usePlayerStore";

export default function MusicPlayer() {
  const [rating, setRating] = useState(0);
  const [volume, setVolume] = useState(80);
  const [showRatingMenu, setShowRatingMenu] = useState(false);
  const { currentSong, isPlaying, togglePlay, closePlayer } = usePlayerStore();

  if (!currentSong) return null;

  return (
    <div className="h-24 bg-gray-950 border-t border-gray-800 flex items-center justify-between px-4 md:px-6 w-full text-white">
      {/* 1. Song Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <img
          src={
            currentSong.cover ||
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop"
          }
          alt="Album Cover"
          className="w-14 h-14 rounded-md shadow-lg object-cover"
        />
        <div className="overflow-hidden">
          <h4 className="font-semibold text-sm truncate hover:underline cursor-pointer">
            {currentSong.title}
          </h4>
          <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer">
            {currentSong.artist || currentSong.author}
          </p>
        </div>
      </div>

      {/* 2. Player Controls */}
      <div className="flex flex-col items-center justify-center w-2/4 max-w-[700px]">
        <div className="flex items-center gap-6 mb-2">
          {/* Shuffle */}
          <button
            className="text-gray-400 hover:text-white transition-colors"
            title="Phát ngẫu nhiên"
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Previous */}
          <button
            className="text-gray-400 hover:text-white transition-colors"
            title="Bài trước"
          >
            <SkipBack className="w-5 h-5" fill="currentColor" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center pl-[2px] bg-white text-black rounded-full hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 -ml-[2px]" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4" fill="currentColor" />
            )}
          </button>

          {/* Next */}
          <button
            className="text-gray-400 hover:text-white transition-colors"
            title="Bài tiếp theo"
          >
            <SkipForward className="w-5 h-5" fill="currentColor" />
          </button>

          {/* Repeat */}
          <button
            className="text-gray-400 hover:text-white transition-colors"
            title="Lặp lại"
          >
            <Repeat className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 group">
          <span className="text-xs text-gray-400">0:00</span>
          <div className="h-1.5 flex-1 bg-gray-600 rounded-full overflow-hidden flex self-center relative cursor-pointer group">
            <div className="h-full bg-white group-hover:bg-green-500 transition-colors w-0"></div>
          </div>
          <span className="text-xs text-gray-400">
            {currentSong.duration || "4:15"}
          </span>
        </div>
      </div>

      {/* 3. Rating & Extra Controls */}
      <div className="flex items-center justify-end w-1/4 min-w-[250px] gap-4">
        {/* Device View */}
        <button
          className="text-gray-400 hover:text-white transition-colors"
          title="Thiết bị"
        >
          <MonitorSpeaker className="w-5 h-5" />
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-2 group w-24">
          <button
            className="text-gray-400 hover:text-white transition-colors"
            title="Âm lượng"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <div className="h-1.5 flex-1 bg-gray-600 rounded-full overflow-hidden flex self-center relative cursor-pointer group-hover:bg-gray-500">
            <div className="h-full bg-white group-hover:bg-green-500 transition-colors w-4/5"></div>
          </div>
        </div>

        {/* Rating Menu (Single Star) */}
        <div className="relative">
          <button
            className={`text-gray-400 hover:text-green-400 transition-colors ${rating > 0 ? "text-green-400" : ""}`}
            title="Đánh giá"
            onClick={() => setShowRatingMenu(!showRatingMenu)}
          >
            <Star
              className="w-5 h-5"
              fill={rating > 0 ? "currentColor" : "none"}
            />
          </button>

          {/* Popover Rating Tab */}
          {showRatingMenu && (
            <div className="absolute bottom-full right-0 mb-4 bg-gray-800 p-3 rounded-xl shadow-2xl border border-gray-700 flex flex-col gap-2 z-50 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-xs text-gray-400 font-semibold mb-1 w-max">
                Đánh giá bài hát
              </p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      setRating(star);
                      setShowRatingMenu(false);
                    }}
                    className={`${star <= rating ? "text-green-400" : "text-gray-600"} hover:text-green-300 hover:scale-110 transition-all`}
                  >
                    <Star
                      className="w-5 h-5"
                      fill={star <= rating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen */}
        <button
          className="text-gray-400 hover:text-white transition-colors"
          title="Toàn màn hình"
        >
          <Maximize className="w-5 h-5" />
        </button>

        {/* Close specific to global player mockup */}
        <button
          onClick={closePlayer}
          className="text-gray-400 hover:text-red-400 transition-colors"
          title="Đóng trình phát"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
