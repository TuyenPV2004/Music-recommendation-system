import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Clock,
  MoreHorizontal,
  Trash2,
  Loader2,
  Music2,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import { playlistAPI } from "../../services/api";
import usePlayerStore from "../../store/usePlayerStore";
import useAuthStore from "../../store/useAuthStore";
import Swal from "sweetalert2";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { playSong } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchPlaylistDetail = async () => {
      try {
        const res = await playlistAPI.detail(id);
        setPlaylist(res.data || res);
      } catch (error) {
        toast.error("Không thể tải chi tiết playlist.");
        navigate("/playlists");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaylistDetail();
  }, [id, isAuthenticated, navigate]);

  const handleRemoveSong = async (songId, songTitle) => {
    const result = await Swal.fire({
      title: "Xóa bài hát?",
      text: `Bạn có chắc muốn xóa bài "${songTitle}" khỏi playlist này?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2DC275",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      background: "#1D1D1D",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await playlistAPI.removeSong(id, songId);
        setPlaylist((prev) => ({
          ...prev,
          songs: prev.songs.filter((s) => s.id !== songId),
        }));
        toast.success(`Đã xóa bài hát khỏi playlist.`);
      } catch (error) {
        toast.error("Không thể xóa bài hát. Hãy thử lại!");
      }
    }
  };

  const handleDeletePlaylist = async () => {
    const result = await Swal.fire({
      title: "Xóa Playlist?",
      text: `Bạn có thật sự muốn xóa vĩnh viễn Playlist "${playlist.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa vĩnh viễn",
      cancelButtonText: "Hủy",
      background: "#1D1D1D",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await playlistAPI.delete(id);
        toast.success("Đã xóa Playlist thành công!");
        navigate("/playlists");
      } catch (error) {
        toast.error("Xóa playlist thất bại. Hãy kiểm tra lại!");
      }
    }
  };

  const handlePlaySong = (song) => {
    playSong({
      ...song,
      id: song.id,
      name: song.title || song.name,
      author: song.artist || song.author,
      audio_link: song.cover || song.audio_link,
    });
  };

  const handlePlayAll = () => {
    if (playlist?.songs?.length > 0) {
      handlePlaySong(playlist.songs[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
      </div>
    );
  }

  if (!playlist) return null;

  return (
    <div className="h-full flex flex-col overflow-y-auto scrollbar-hide">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-gray-800 to-black p-6 lg:p-10 flex flex-col md:flex-row items-end gap-6 pt-10 md:pt-20">
        <div className="w-48 h-48 md:w-60 md:h-60 shadow-2xl bg-gray-800 rounded-none md:rounded-lg flex items-center justify-center">
          <Music2 className="w-20 h-20 text-gray-500" />
        </div>

        <div className="flex-1 w-full text-left">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-300">
            Playlist
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4 drop-shadow-lg">
            {playlist.name}
          </h1>
          <p className="text-gray-300 mb-2">{playlist.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-white font-medium hover:underline cursor-pointer">
              {playlist.creator}
            </span>
            <span>•</span>
            <span>{playlist.songs?.length || 0} bài hát</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 lg:px-10 py-6 flex items-center gap-6 border-b border-gray-800/50">
        <button
          onClick={handlePlayAll}
          disabled={!playlist.songs?.length}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black shadow-xl hover:scale-105 transition-transform hover:bg-green-400 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          <Play className="w-7 h-7 ml-1" fill="currentColor" />
        </button>
        <button
          onClick={handleDeletePlaylist}
          title="Xóa Playlist"
          className="text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-8 h-8" />
        </button>
      </div>

      {/* Songs List */}
      <div className="px-6 lg:px-10 pb-20 flex-1 pt-6">
        {/* Table Header */}
        <div className="flex items-center px-2 text-gray-400 border-b border-gray-800 pb-2 mb-4 text-sm font-medium tracking-wider">
          <div className="w-12 text-center">ID</div>
          <div className="flex-1">Tiêu đề</div>
          <div className="hidden lg:block w-48 text-left">Ngày thêm</div>
          <div className="w-32 flex justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div className="w-12"></div>
        </div>

        {/* Songe Items */}
        <div className="space-y-1">
          {playlist.songs?.map((song, index) => (
            <div
              key={song.id}
              onClick={() => handlePlaySong(song)}
              className="flex items-center group hover:bg-white/10 rounded-lg p-2 transition-colors cursor-pointer"
            >
              <div className="w-12 text-center text-gray-400 group-hover:hidden">
                #{index + 1}
              </div>
              <div className="w-12 text-center text-white hidden group-hover:flex items-center justify-center">
                <Play className="w-4 h-4" fill="currentColor" />
              </div>

              <div className="flex-1 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-gray-500" />
                </div>

                <div className="flex flex-col truncate pr-4">
                  <span className="text-white font-medium truncate">
                    {song.title}
                  </span>
                  <span className="text-gray-400 text-sm truncate group-hover:text-white">
                    {song.artist}
                  </span>
                </div>
              </div>

              <div className="hidden lg:block w-48 text-sm text-gray-400 text-left">
                {song.dateAdded || "—"}
              </div>
              <div className="w-32 text-center text-sm text-gray-400">
                {song.duration
                  ? `${Math.floor(song.duration / 60000)}:${Math.floor(
                      (song.duration % 60000) / 1000,
                    )
                      .toString()
                      .padStart(2, "0")}`
                  : "—"}
              </div>

              <div className="w-12 flex justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSong(song.id, song.title);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all p-2"
                  title="Xóa khỏi Playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {(!playlist.songs || playlist.songs.length === 0) && (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center space-y-4 shadow-sm border border-gray-800/50 rounded-2xl bg-gray-900/20">
              <Music2 className="w-12 h-12 opacity-50" />
              <p>
                Playlist này chưa có bài hát nào. Hãy tìm nhạc và thêm vào nhé!
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/");
                }}
                variant="outline"
                className="mt-2"
              >
                Khám phá ngay
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
