import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Library,
  Plus,
  Search,
  MoreVertical,
  Play,
  Trash2,
  Loader2,
  Music2,
} from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { toast } from "react-toastify";
import { playlistAPI } from "../../services/api";
import useAuthStore from "../../store/useAuthStore";

export default function PlaylistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchPlaylists = async () => {
      try {
        const res = await playlistAPI.list();
        setPlaylists(res.data || res || []);
      } catch (error) {
        toast.error("Không thể tải danh sách playlist.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaylists();
  }, [isAuthenticated]);

  const filteredPlaylists = playlists.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setIsCreating(true);
    try {
      const res = await playlistAPI.create({
        name: newPlaylistName,
        is_public: false, // Defaulting to private for now
      });
      const data = res.data || res;
      setPlaylists([...playlists, data]);
      toast.success(`Đã tạo Playlist "${newPlaylistName}" thành công!`);
      setIsModalOpen(false);
      setNewPlaylistName("");
    } catch (error) {
      toast.error("Tạo Playlist thất bại. Hãy thử lại!");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-green-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Library className="w-16 h-16 text-gray-500 mb-2" />
        <h2 className="text-2xl font-bold text-white">Bạn chưa đăng nhập</h2>
        <p className="text-gray-400 max-w-md">
          Vui lòng đăng nhập để tạo và quản lý danh sách phát các bài hát yêu
          thích của bạn.
        </p>
        <Button onClick={() => navigate("/login")} className="mt-4">
          Đăng nhập ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 lg:p-10 relative overflow-y-auto scrollbar-hide">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-20">
        {filteredPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            className="group relative bg-gray-900/40 hover:bg-gray-800 p-4 rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-700/50"
            onClick={() => navigate(`/playlists/${playlist.id}`)}
          >
            <div className="relative mb-4 aspect-square rounded-lg overflow-hidden shadow-lg bg-gray-800 flex items-center justify-center">
              <Music2 className="w-12 h-12 text-gray-500 group-hover:scale-110 transition-transform duration-500" />
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
              {playlist.songCount || 0} bài hát
            </p>
          </div>
        ))}
        {filteredPlaylists.length === 0 && playlists.length > 0 && (
          <div className="col-span-full py-12 text-center text-gray-400">
            Không tìm thấy playlist nào phù hợp.
          </div>
        )}
        {playlists.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 flex flex-col items-center justify-center space-y-3">
            <Library className="w-12 h-12 text-gray-600 mb-2" />
            <p>Bạn chưa có Playlist nào. Hãy tạo mới một Playlist nhé!</p>
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
