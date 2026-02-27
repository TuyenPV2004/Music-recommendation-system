import React, { useState, useEffect } from "react";
import { Smile, Search, Edit, Trash2, Filter, Loader2 } from "lucide-react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import { adminAPI } from "../../services/api";
import Swal from "sweetalert2";

export default function MoodManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMood, setEditingMood] = useState(null);
  const [moodName, setMoodName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMoods = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.moods();
      setMoods(res.data || []);
    } catch (err) {
      console.error("Failed to fetch moods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const filteredMoods = moods.filter((mood) =>
    mood.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openCreateModal = () => {
    setEditingMood(null);
    setMoodName("");
    setIsModalOpen(true);
  };

  const openEditModal = (mood) => {
    setEditingMood(mood);
    setMoodName(mood.name);
    setIsModalOpen(true);
  };

  const handleSaveMood = async (e) => {
    e.preventDefault();
    if (!moodName.trim()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (editingMood) {
        toast.success(`Đã cập nhật cảm xúc thành "${moodName}"`);
      } else {
        toast.success(`Đã thêm cảm xúc mới "${moodName}"`);
      }
      setIsModalOpen(false);
      fetchMoods();
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (name) => {
    const result = await Swal.fire({
      title: "Xóa Cảm xúc?",
      text: `Bạn có chắc chắn muốn xóa cảm xúc "${name}" không?`,
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
      toast.info(`Đã xóa cảm xúc ${name}`);
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
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
          <div className="relative w-full sm:w-72">
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
            className="flex items-center justify-center gap-2 bg-green-600 text-black px-5 py-2 rounded-full font-medium text-sm hover:focus:ring-green-700 hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
          >
            Thêm cảm xúc mới
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
                  Tên cảm xúc
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
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
                      <span className="ml-3 text-gray-400">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredMoods.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 opacity-20 mb-3" />
                      <p>Không tìm thấy cảm xúc nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMoods.map((mood) => (
                  <tr
                    key={mood.id}
                    className="hover:bg-gray-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400">
                      #{mood.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          {mood.name}
                        </span>
                      </div>
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
              {filteredMoods.length}
            </span>{" "}
            / <span className="font-medium text-white">{moods.length}</span> cảm
            xúc
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
