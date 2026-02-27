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
  Repeat1,
  MonitorSpeaker,
  Volume2,
  Maximize,
  Music2,
} from "lucide-react";
import { useRef, useEffect } from "react";
import usePlayerStore from "../../store/usePlayerStore";
import useAuthStore from "../../store/useAuthStore";
import { interactionAPI } from "../../services/api";
import { toast } from "react-toastify";

export default function MusicPlayer() {
  const [volume, setVolume] = useState(80);
  const [showRatingMenu, setShowRatingMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const {
    currentSong,
    isPlaying,
    togglePlay,
    closePlayer,
    currentRating: rating,
    setRating,
    playNext,
    playPrevious,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((e) => console.error("Playback failed: ", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = pos * duration;
    }
  };

  const handleRate = async (stars) => {
    setRating(stars);
    setShowRatingMenu(false);
    if (!currentSong) return;

    const songId = currentSong.id || currentSong.song_id;
    if (isAuthenticated && songId) {
      try {
        await interactionAPI.rate({ song_id: songId, rate: stars });
        toast.success(`Đã đánh giá ${stars} sao!`);
      } catch {
        toast.info(`Đánh giá ${stars} sao (chưa lưu).`);
      }
    } else {
      toast.info(`Đánh giá ${stars} sao (đăng nhập để lưu).`);
    }
  };

  if (!currentSong) return null;

  return (
    <div className="h-24 bg-[#000000] flex items-center justify-between px-4 md:px-6 w-full text-white">
      {/* Hidden Audio Element */}
      {currentSong.audio_link && (
        <audio
          ref={audioRef}
          src={currentSong.audio_link}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            if (repeatMode === "one") {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            } else if (repeatMode === "all" || isShuffle) {
              playNext();
            } else {
              playNext();
            }
          }}
        />
      )}

      {/* 1. Song Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <div className="w-14 h-14 rounded-md shadow-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0">
          <Music2 className="w-6 h-6 text-white" />
        </div>
        <div className="overflow-hidden">
          <h4 className="font-semibold text-sm truncate hover:underline cursor-pointer">
            {currentSong.name || currentSong.title}
          </h4>
          <p className="text-xs text-gray-400 truncate hover:underline cursor-pointer">
            {currentSong.author || currentSong.artist}
          </p>
        </div>
      </div>

      {/* 2. Player Controls */}
      <div className="flex flex-col items-center justify-center w-2/4 max-w-[700px]">
        <div className="flex items-center gap-6 mb-2">
          {/* Shuffle */}
          <button
            className={`transition-colors ${isShuffle ? "text-green-400" : "text-gray-400 hover:text-white"}`}
            title="Phát ngẫu nhiên"
            onClick={toggleShuffle}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Previous */}
          <button
            className="text-gray-400 hover:text-white transition-colors"
            title="Bài trước"
            onClick={playPrevious}
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
            onClick={playNext}
          >
            <SkipForward className="w-5 h-5" fill="currentColor" />
          </button>

          {/* Repeat */}
          <button
            className={`transition-colors relative ${repeatMode !== "off" ? "text-green-400" : "text-gray-400 hover:text-white"}`}
            title={
              repeatMode === "one"
                ? "Lặp 1 bài"
                : repeatMode === "all"
                  ? "Lặp tất cả"
                  : "Lặp lại"
            }
            onClick={toggleRepeat}
          >
            {repeatMode === "one" ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2 group">
          <span className="text-xs text-gray-400">
            {formatTime(currentTime)}
          </span>
          <div
            className="h-1.5 flex-1 bg-gray-600 rounded-full overflow-hidden flex self-center relative cursor-pointer group"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-white group-hover:bg-green-500 transition-colors"
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              }}
            ></div>
          </div>
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Rating & Extra Controls */}
      <div className="flex items-center justify-end w-1/4 min-w-[250px] gap-3">
        {/* Device View */}
        <button
          className="flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          title="Thiết bị"
        >
          <MonitorSpeaker className="w-5 h-5" />
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-2 group w-28">
          <button
            className="flex items-center justify-center text-gray-400 hover:text-white transition-colors flex-shrink-0"
            title="Âm lượng"
            onClick={() => setVolume(volume === 0 ? 80 : 0)}
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <div
            className="h-1.5 flex-1 bg-gray-600 rounded-full overflow-hidden relative cursor-pointer group-hover:bg-gray-500"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              setVolume(Math.max(0, Math.min(100, pos * 100)));
            }}
          >
            <div
              className="h-full bg-white group-hover:bg-green-500 transition-colors"
              style={{ width: `${volume}%` }}
            ></div>
          </div>
        </div>

        {/* Rating Menu (Single Star) */}
        <div className="relative flex items-center">
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
                    onClick={() => handleRate(star)}
                    className={`${star <= rating ? "text-yellow-400" : "text-gray-600"} hover:text-yellow-300 hover:scale-110 transition-all`}
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
          className="flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          title="Toàn màn hình"
        >
          <Maximize className="w-5 h-5" />
        </button>

        {/* Close specific to global player mockup */}
        <button
          onClick={closePlayer}
          className="flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
          title="Đóng trình phát"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
