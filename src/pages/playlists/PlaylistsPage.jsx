import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Library,
  Plus,
  Search,
  MoreVertical,
  Play,
  Trash2,
} from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { toast } from "react-toastify";

// Mock Data
const MOCK_PLAYLISTS = [
  {
    id: "1",
    name: "Nhạc Chill mỗi tối",
    songCount: 15,
    cover:
      "https://i.ytimg.com/vi/hLxB984tHhg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLChhSEIB64t5xGSSOHwQJCA_4ZT0w",
  },
  {
    id: "2",
    name: "Nhạc Tik Tok",
    songCount: 20,
    cover:
      "https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Knms/di-dong/nhac-tren-tiktok-duoc-nhieu-nguoi-dung-yeu-thich.jpg",
  },
  {
    id: "3",
    name: "Nhạc Lofi",
    songCount: 42,
    cover:
      "https://baochauelec.com/cdn/images/lofi-15.jpg",
  },
];

export default function PlaylistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  const filteredPlaylists = MOCK_PLAYLISTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setIsCreating(true);
    try {
      // Mock API call POST /api/playlists
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(`Đã tạo Playlist "${newPlaylistName}" thành công!`);
      setIsModalOpen(false);
      setNewPlaylistName("");
    } catch (error) {
      toast.error("Tạo Playlist thất bại. Hãy thử lại!");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 lg:p-10 relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            Playlist của tôi
          </h1>
          <p className="text-gray-400">
            Tạo và quản lý danh sách phát các bài hát yêu thích của bạn.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Tạo Playlist Mới
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 w-full max-w-sm relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-700/50 rounded-lg leading-5 bg-gray-900/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm transition-colors duration-200"
          placeholder="Tìm playlist nhạc yêu thích"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {filteredPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            className="group relative bg-gray-900/40 hover:bg-gray-800 p-4 rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-700/50"
            onClick={() => navigate(`/playlists/${playlist.id}`)}
          >
            <div className="relative mb-4 aspect-square rounded-lg overflow-hidden shadow-lg">
              <img
                src={playlist.cover}
                alt={playlist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black shadow-xl hover:scale-105 hover:bg-green-400 transition-transform">
                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
            <h3
              className="text-base font-semibold text-white truncate mb-1"
              title={playlist.name}
            >
              {playlist.name}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {playlist.songCount} bài hát
            </p>
          </div>
        ))}
        {filteredPlaylists.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            Không tìm thấy playlist nào phù hợp.
          </div>
        )}
      </div>

      {/* Modal Creating Playlist */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tạo Playlist mới"
      >
        <form onSubmit={handleCreatePlaylist}>
          <Input
            id="playlistName"
            label="Tên Playlist"
            placeholder="Nhập tên playlist của bạn..."
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            autoFocus
            required
          />
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isCreating}
            >
              Hủy
            </Button>
            <Button type="submit" isLoading={isCreating}>
              Tạo Playlist
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
