import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Clock, MoreHorizontal, Trash2, ArrowLeft } from "lucide-react";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";

const MOCK_PLAYLIST = {
  id: "1",
  name: "Nhạc Chill mỗi tối",
  description:
    "Bộ sưu tập những bài nhạc Lofi nhẹ nhàng để thư giãn sau một ngày dài.",
  cover:
    "https://i.ytimg.com/vi/hLxB984tHhg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLChhSEIB64t5xGSSOHwQJCA_4ZT0w",
  creator: "Nguyễn Văn A",
  songs: [
    {
      id: 104,
      title: "Thức Giấc",
      artist: "Da LAB",
      duration: "4:28",
      dateAdded: "2 ngày trước",
      album: "Đêm Nai Tơ",
      cover: "https://i.ytimg.com/vi/R3trO4a49go/maxresdefault.jpg",
    },
    {
      id: 105,
      title: "Bài Này Chill Phết",
      artist: "Đen, Min",
      duration: "4:36",
      dateAdded: "5 ngày trước",
      album: "Lofi Chilly",
      cover:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmyP9nU0GVx2QQv9xuCV7KX1P3gQFFh9HsdQ&s",
    },
    {
      id: 108,
      title: "Trời Giấu Trời Mang Đi",
      artist: "AMEE, ViruSs",
      duration: "4:15",
      dateAdded: "1 tuần trước",
      album: "Singles",
      cover: "https://i.ytimg.com/vi/YXkp77tR9vw/maxresdefault.jpg",
    },
  ],
};

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(MOCK_PLAYLIST); // in real app, fetch by id

  const handleRemoveSong = (songId, songTitle) => {
    // Mock API call DELETE /api/playlists/{id}/songs/{song_id}
    if (
      window.confirm(
        `Bạn có chắc muốn xóa bài "${songTitle}" khỏi playlist này?`,
      )
    ) {
      setPlaylist((prev) => ({
        ...prev,
        songs: prev.songs.filter((s) => s.id !== songId),
      }));
      toast.success(`Đã xóa bài hát khỏi playlist.`);
    }
  };

  const handleDeletePlaylist = () => {
    // Mock API call DELETE /api/playlists/{id}
    if (
      window.confirm(
        `Bạn có thật sự muốn xóa vĩnh viễn Playlist "${playlist.name}"?`,
      )
    ) {
      toast.success("Đã xóa Playlist thành công!");
      navigate("/playlists");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-gray-800 to-black p-6 lg:p-10 flex flex-col md:flex-row items-end gap-6 pt-10 md:pt-20">
        <img
          src={playlist.cover}
          alt={playlist.name}
          className="w-48 h-48 md:w-60 md:h-60 shadow-2xl object-cover rounded-none md:rounded-lg"
        />
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
            <span>{playlist.songs.length} bài hát</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 lg:px-10 py-6 flex items-center gap-6">
        <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black shadow-xl hover:scale-105 transition-transform hover:bg-green-400">
          <Play className="w-7 h-7 ml-1" fill="currentColor" />
        </button>
        <button
          onClick={handleDeletePlaylist}
          title="Xóa Playlist"
          className="text-gray-400 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-8 h-8" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-8 h-8" />
        </button>
      </div>

      {/* Songs List */}
      <div className="px-6 lg:px-10 pb-10 flex-1">
        {/* Table Header */}
        <div className="flex items-center text-gray-400 border-b border-gray-800 pb-2 mb-4 text-sm font-medium tracking-wider">
          <div className="w-12 text-center">#</div>
          <div className="flex-1">Tiêu đề</div>
          <div className="hidden md:block w-48 text-left">Album</div>
          <div className="hidden lg:block w-48 text-left">Ngày thêm</div>
          <div className="w-32 flex justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div className="w-12"></div>
        </div>

        {/* Songe Items */}
        <div className="space-y-1">
          {playlist.songs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center group hover:bg-white/10 rounded-lg p-2 transition-colors cursor-pointer"
            >
              <div className="w-12 text-center text-gray-400 group-hover:hidden">
                {index + 1}
              </div>
              <div className="w-12 text-center text-white hidden group-hover:flex items-center justify-center">
                <Play className="w-4 h-4" fill="currentColor" />
              </div>

              <div className="flex-1 flex items-center gap-4">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex flex-col truncate pr-4">
                  <span className="text-white font-medium truncate">
                    {song.title}
                  </span>
                  <span className="text-gray-400 text-sm truncate group-hover:text-white">
                    {song.artist}
                  </span>
                </div>
              </div>

              <div className="hidden md:block w-48 text-sm text-gray-400 text-left truncate pr-2">
                {song.album}
              </div>
              <div className="hidden lg:block w-48 text-sm text-gray-400 text-left">
                {song.dateAdded}
              </div>
              <div className="w-32 text-center text-sm text-gray-400">
                {song.duration}
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

          {playlist.songs.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              Playlist này chưa có bài hát nào. Hãy tìm nhạc và thêm vào nhé!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
