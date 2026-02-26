import React, { useState, useEffect, useCallback } from "react";
import {
  ListMusic,
  Search,
  Trash2,
  Eye,
  Lock,
  Globe,
  Filter,
  Loader2,
  Music,
} from "lucide-react";
import { toast } from "react-toastify";
import { adminAPI, playlistAPI } from "../../services/api";
import Swal from "sweetalert2";
import Modal from "../../components/ui/Modal";

export default function PlaylistManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPrivacy, setFilterPrivacy] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [detailPlaylist, setDetailPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.playlists({ page, limit });
      setPlaylists(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  // Client-side filtering
  const filteredPlaylists = playlists.filter((playlist) => {
    const matchesSearch =
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (playlist.user_id || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    let matchesPrivacy = true;
    if (filterPrivacy === "public")
      matchesPrivacy = playlist.is_public === true;
    if (filterPrivacy === "private")
      matchesPrivacy = playlist.is_public === false;

    return matchesSearch && matchesPrivacy;
  });

  const totalPages = Math.ceil(total / limit);

  const handleDelete = async (name) => {
    const result = await Swal.fire({
      title: "Xóa Playlist?",
      text: `Bạn có chắc chắn muốn xóa Playlist "${name}" không? Hành động này sẽ xóa cả danh sách bài hát bên trong nó.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      background: "#1D1D1D",
      color: "#fff",
    });

    if (result.isConfirmed) {
      toast.info(`Đã xóa Playlist "${name}" bởi Admin`);
    }
  };

  const handleInspect = async (id, name, songCount) => {
    setDetailPlaylist({ id, name, songCount });
    setLoadingSongs(true);
    setPlaylistSongs([]);
    try {
      const res = await playlistAPI.detail(id);
      const songs = res.data?.songs || [];
      setPlaylistSongs(songs);
    } catch (err) {
      console.error("Failed to fetch songs for playlist:", err);
      toast.error("Không thể tải danh sách bài hát");
    } finally {
      setLoadingSongs(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Quản lý Playlists
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Quản trị và kiểm duyệt danh sách phát do người dùng tạo ra trên hệ
            thống.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 flex-1">
          <div className="relative w-full lg:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-black text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-colors"
              placeholder="Tìm theo tên playlist, user ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap hidden sm:flex">
            <Filter className="w-4 h-4" /> Lọc:
          </div>
          <select
            className="bg-black border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block p-2 w-full sm:w-auto outline-none"
            value={filterPrivacy}
            onChange={(e) => setFilterPrivacy(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="public">Hiển thị Public</option>
            <option value="private">Hiển thị Private</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-950/50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider w-16"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Tên Playlist
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden sm:table-cell"
                >
                  Bài hát
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden md:table-cell"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden sm:table-cell"
                >
                  Khả năng truy cập
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden lg:table-cell"
                >
                  Ngày tạo
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
                      <span className="ml-3 text-gray-400">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPlaylists.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 opacity-20 mb-3" />
                      <p>Không tìm thấy danh sách phát nào.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPlaylists.map((playlist) => (
                  <tr
                    key={playlist.id}
                    className="hover:bg-gray-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">
                      #{playlist.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-sm font-bold text-white block">
                            {playlist.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">
                      <span className="bg-gray-800 text-gray-300 py-1 px-3 rounded-full text-xs font-medium border border-gray-700">
                        {playlist.songCount ?? 0} bài
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div
                        className="text-sm text-gray-300 font-mono truncate max-w-[150px]"
                        title={playlist.user_id}
                      >
                        {playlist.user_id
                          ? playlist.user_id.substring(0, 12) + "..."
                          : "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell text-sm">
                      {playlist.is_public ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                          <Globe className="w-3.5 h-3.5" /> Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-gray-800 text-gray-400 border-gray-700">
                          <Lock className="w-3.5 h-3.5" /> Private
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden lg:table-cell">
                      {playlist.created_at || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleInspect(
                              playlist.id,
                              playlist.name,
                              playlist.songCount,
                            )
                          }
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                          title="Xem chi tiết các bài hát"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(playlist.name)}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                          title="Xóa Playlist (Kiểm duyệt)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-950/50 px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Hiển thị{" "}
            <span className="font-medium text-white">
              {filteredPlaylists.length}
            </span>{" "}
            / <span className="font-medium text-white">{total}</span> playlist
            (Trang {page}/{totalPages || 1})
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </button>
            <span className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium border border-green-500 shadow-sm">
              {page}
            </span>
            <button
              className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Tiếp
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      <Modal
        isOpen={!!detailPlaylist}
        onClose={() => setDetailPlaylist(null)}
        title={`Chi tiết Playlist: ${detailPlaylist?.name}`}
        maxWidth="max-w-2xl"
        className="bg-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                <ListMusic className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">{detailPlaylist?.name}</h3>
                <p className="text-sm text-gray-400 text-left">
                  ID: #{detailPlaylist?.id}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {detailPlaylist?.songCount || 0}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Bài hát
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              Danh sách bài hát thuộc Playlist
            </h4>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden max-h-[40vh] overflow-y-auto scrollbar-hide">
              {loadingSongs ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
                </div>
              ) : playlistSongs.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Playlist này chưa có bài hát nào.
                </div>
              ) : (
                <ul className="divide-y divide-gray-800">
                  {playlistSongs.map((song) => (
                    <li
                      key={song.id}
                      className="p-3 hover:bg-gray-800/50 flex items-center gap-3 transition-colors"
                    >
                      <div className="w-10 h-10 rounded shadow-sm bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <Music className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {song.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {song.artist}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
