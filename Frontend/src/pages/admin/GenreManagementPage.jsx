import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  EllipsisVertical,
  Music,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import { adminAPI } from "../../services/api";
import { getGenreColorClass } from "../../utils/genreColors";
import Swal from "sweetalert2";

export default function GenreManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [genreName, setGenreName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailGenre, setDetailGenre] = useState(null);
  const [genreSongs, setGenreSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);

  const fetchGenres = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.genres();
      setGenres(res.data || []);
    } catch (err) {
      console.error("Failed to fetch genres:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, []);

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openCreateModal = () => {
    setEditingGenre(null);
    setGenreName("");
    setIsModalOpen(true);
  };

  const openEditModal = (genre) => {
    setEditingGenre(genre);
    setGenreName(genre.name);
    setIsModalOpen(true);
  };

  const openDetailModal = async (genre) => {
    setDetailGenre(genre);
    setLoadingSongs(true);
    setGenreSongs([]);
    try {
      const res = await adminAPI.songs({ genre: genre.id, limit: 100 });
      const songs = res.data || [];
      setGenreSongs(songs);
    } catch (err) {
      console.error("Failed to fetch songs for genre:", err);
      toast.error("Không thể tải danh sách bài hát");
    } finally {
      setLoadingSongs(false);
    }
  };

  const handleSaveGenre = async (e) => {
    e.preventDefault();
    if (!genreName.trim()) return;

    setIsSubmitting(true);
    try {
      // Mock API call (backend doesn't have create/update genre endpoints yet)
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (editingGenre) {
        toast.success(`Đã cập nhật thể loại thành "${genreName}"`);
      } else {
        toast.success(`Đã thêm thể loại mới "${genreName}"`);
      }
      setIsModalOpen(false);
      fetchGenres(); // Refresh
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (name) => {
    const result = await Swal.fire({
      title: "Xóa Thể loại?",
      text: `Bạn có chắc chắn muốn xóa thể loại "${name}" không?`,
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
      toast.info(`Đã xóa thể loại ${name}`);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Quản lý thể loại
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Tạo mới, chỉnh sửa và quản lý danh sách các thể loại âm nhạc.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 flex-1">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-black text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-colors"
              placeholder="Tìm kiếm thể loại"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-green-500 text-black px-5 py-2 rounded-full font-medium text-sm hover:focus:ring-green-600 hover:bg-green-400 transition-colors shadow-sm whitespace-nowrap"
          >
            Thêm thể loại mới
          </button>
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
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider w-24"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Tên thể loại
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden sm:table-cell"
                >
                  Số lượng bài hát
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
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                      <span className="ml-3 text-gray-400">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredGenres.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 opacity-20 mb-3" />
                      <p>Không tìm thấy thể loại nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredGenres.map((genre) => (
                  <tr
                    key={genre.id}
                    className="hover:bg-gray-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">
                      #{genre.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getGenreColorClass(genre.id)}`}
                        >
                          {genre.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">
                      <span className="bg-gray-800 text-gray-300 py-1 px-3 rounded-full text-xs font-medium border border-gray-700">
                        {genre.songCount ?? 0} bài
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(genre)}
                          className="text-gray-400 hover:text-blue-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDetailModal(genre)}
                          className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                          title="Xem chi tiết"
                        >
                          <EllipsisVertical className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(genre.name)}
                          className="text-gray-400 hover:text-red-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                          title="Xóa"
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
              {filteredGenres.length}
            </span>{" "}
            / <span className="font-medium text-white">{genres.length}</span>{" "}
            thể loại
          </p>
        </div>
      </div>

      {/* Modal Cập nhật / Thêm Thể loại */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGenre ? "Chỉnh sửa Thể loại" : "Thêm Thể loại mới"}
      >
        <form onSubmit={handleSaveGenre}>
          <Input
            id="genreName"
            label="Tên thể loại"
            placeholder="Nhập tên thể loại"
            value={genreName}
            onChange={(e) => setGenreName(e.target.value)}
            autoFocus
            required
          />
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {editingGenre ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DETAIL MODAL */}
      <Modal
        isOpen={!!detailGenre}
        onClose={() => setDetailGenre(null)}
        title={`Chi tiết thể loại: ${detailGenre?.name}`}
        maxWidth="max-w-2xl"
        className="bg-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                <Music className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">{detailGenre?.name}</h3>
                <p className="text-sm text-gray-400 text-left">
                  ID: #{detailGenre?.id}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {detailGenre?.songCount || 0}
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Bài hát
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">
              Danh sách bài hát thuộc phân loại
            </h4>
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden max-h-[40vh] overflow-y-auto scrollbar-hide">
              {loadingSongs ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                </div>
              ) : genreSongs.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Chưa có bài hát nào thuộc thể loại này.
                </div>
              ) : (
                <ul className="divide-y divide-gray-800">
                  {genreSongs.map((song) => (
                    <li
                      key={song.id}
                      className="p-3 hover:bg-gray-800/50 flex items-center gap-3 transition-colors"
                    >
                      {song.cover ? (
                        <img
                          src={song.cover}
                          alt=""
                          className="w-10 h-10 rounded shadow-sm object-cover bg-gray-800 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded shadow-sm bg-gray-800 flex items-center justify-center flex-shrink-0">
                          <Music className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {song.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {song.author}
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
