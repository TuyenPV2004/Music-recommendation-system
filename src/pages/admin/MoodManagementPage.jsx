import React, { useState } from "react";
import {
  Smile,
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
const MOCK_MOODS = [
  { id: 1, name: "Vui vẻ", label: "Happy", songCount: 450 },
  { id: 2, name: "Buồn bã", label: "Sad", songCount: 320 },
  { id: 3, name: "Thư giãn", label: "Chill", songCount: 890 },
  { id: 4, name: "Sôi động", label: "Energetic", songCount: 512 },
  { id: 5, name: "Giận dữ", label: "Angry", songCount: 85 },
  { id: 6, name: "Cô đơn", label: "Lonely", songCount: 210 },
  { id: 7, name: "Lãng mạn", label: "Romantic", songCount: 640 },
  { id: 8, name: "Tập trung", label: "Focus", songCount: 335 },
];

export default function MoodManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMood, setEditingMood] = useState(null);
  const [moodName, setMoodName] = useState("");
  const [moodLabel, setMoodLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredMoods = MOCK_MOODS.filter(
    (mood) =>
      mood.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mood.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openCreateModal = () => {
    setEditingMood(null);
    setMoodName("");
    setMoodLabel("");
    setIsModalOpen(true);
  };

  const openEditModal = (mood) => {
    setEditingMood(mood);
    setMoodName(mood.name);
    setMoodLabel(mood.label);
    setIsModalOpen(true);
  };

  const handleSaveMood = async (e) => {
    e.preventDefault();
    if (!moodName.trim()) return;

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (editingMood) {
        toast.success(`Đã cập nhật cảm xúc thành "${moodName}"`);
      } else {
        toast.success(`Đã thêm cảm xúc mới "${moodName}"`);
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa cảm xúc "${name}" không?`)) {
      toast.info(`Đã xóa cảm xúc ${name}`);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Quản lý cảm xúc
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Định nghĩa các nhãn cảm xúc để AI phân loại bài hát.
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-black text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm transition-colors"
              placeholder="Tìm kiếm cảm xúc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full font-medium text-sm hover:focus:ring-green-700 hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
          >
            Thêm cảm xúc mới
          </button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap hidden sm:flex">
            <Filter className="w-4 h-4" /> Lọc:
          </div>
          <select className="bg-black border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block p-2 w-full sm:w-auto outline-none">
            <option>Nhãn</option>
            <option>Cảm xúc</option>
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
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400  tracking-wider w-24"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Tên cảm xúc
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Nhãn
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
              {filteredMoods.map((mood) => (
                <tr
                  key={mood.id}
                  className="hover:bg-gray-800/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">
                    #{mood.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          mood.name === "Vui vẻ"
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            : mood.name === "Buồn bã"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : mood.name === "Thư giãn"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : mood.name === "Sôi động"
                                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                  : mood.name === "Giận dữ"
                                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                    : mood.name === "Cô đơn"
                                      ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                      : mood.name === "Lãng mạn"
                                        ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                        : mood.name === "Tập trung"
                                          ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                          : "bg-gray-800 text-gray-300 border border-gray-700"
                        }`}
                      >
                        {mood.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        mood.label === "Happy"
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : mood.label === "Sad"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : mood.label === "Chill"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : mood.label === "Energetic"
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                : mood.label === "Angry"
                                  ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                  : mood.label === "Lonely"
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                    : mood.label === "Romantic"
                                      ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                      : mood.label === "Focus"
                                        ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                        : "bg-gray-800 text-gray-300 border border-gray-700"
                      }`}
                    >
                      {mood.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden sm:table-cell">
                    <span className="bg-gray-800 text-gray-300 py-1 px-3 rounded-full text-xs font-medium border border-gray-700">
                      {mood.songCount} bài
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(mood)}
                        className="text-gray-400 hover:text-yellow-500 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(mood.name)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1.5 hover:bg-gray-800 rounded-md"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredMoods.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 opacity-20 mb-3" />
                      <p>Không tìm thấy cảm xúc nào phù hợp.</p>
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
              {filteredMoods.length}
            </span>{" "}
            /{" "}
            <span className="font-medium text-white">{MOCK_MOODS.length}</span>{" "}
            cảm xúc
          </p>
        </div>
      </div>

      {/* Modal Cập nhật / Thêm Cảm xúc */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMood ? "Chỉnh sửa cảm xúc" : "Thêm cảm xúc mới"}
      >
        <form onSubmit={handleSaveMood}>
          <div className="space-y-4">
            <Input
              id="moodName"
              label="Tên cảm xúc"
              placeholder="Nhập tên cảm xúc"
              value={moodName}
              onChange={(e) => setMoodName(e.target.value)}
              autoFocus
              required
            />
            <Input
              id="moodLabel"
              label="Nhãn (Tiếng Anh)"
              placeholder="Ví dụ: Happy, Sad..."
              value={moodLabel}
              onChange={(e) => setMoodLabel(e.target.value)}
              required
            />
          </div>
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
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {editingMood ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
