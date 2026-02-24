import React, { useState } from "react";
import {
  Disc,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
} from "lucide-react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";

// Mock Data
const MOCK_GENRES = [
  { id: 1, name: "Pop", songCount: 1245 },
  { id: 2, name: "Ballad", songCount: 890 },
  { id: 3, name: "Rap/Hip-Hop", songCount: 520 },
  { id: 4, name: "R&B", songCount: 340 },
  { id: 5, name: "EDM", songCount: 412 },
  { id: 6, name: "Rock", songCount: 156 },
  { id: 7, name: "Indie", songCount: 680 },
  { id: 8, name: "Lofi", songCount: 920 },
];

export default function GenreManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [genreName, setGenreName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredGenres = MOCK_GENRES.filter((genre) =>
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

  const handleSaveGenre = async (e) => {
    e.preventDefault();
    if (!genreName.trim()) return;

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (editingGenre) {
        toast.success(`Đã cập nhật thể loại thành "${genreName}"`);
      } else {
        toast.success(`Đã thêm thể loại mới "${genreName}"`);
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (name) => {
    // In a real app, you'd show a confirmation modal first
    if (window.confirm(`Bạn có chắc chắn muốn xóa thể loại "${name}" không?`)) {
      toast.info(`Đã xóa thể loại ${name}`);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
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
          <div className="relative w-full sm:w-96">
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
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full font-medium text-sm hover:focus:ring-green-700 hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
          >
            Thêm thể loại mới
          </button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap hidden sm:flex">
            <Filter className="w-4 h-4" /> Lọc:
          </div>
          <select className="bg-black border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2 w-full sm:w-auto outline-none">
            <option>Thể loại</option>
            <option>Số lượng bài hát</option>
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
              {filteredGenres.map((genre) => (
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
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          genre.name === "Pop"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : genre.name === "Ballad"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : genre.name === "Rap/Hip-Hop"
                                ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                : genre.name === "R&B"
                                  ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                  : genre.name === "EDM"
                                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                    : genre.name === "Rock"
                                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                      : "bg-gray-800 text-gray-300 border border-gray-700"
                        }`}
                      >
                        {genre.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">
                    <span className="bg-gray-800 text-gray-300 py-1 px-3 rounded-full text-xs font-medium border border-gray-700">
                      {genre.songCount} bài
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(genre)}
                        className="text-gray-400 hover:text-purple-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
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
              ))}

              {filteredGenres.length === 0 && (
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
            /{" "}
            <span className="font-medium text-white">{MOCK_GENRES.length}</span>{" "}
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
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {editingGenre ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
