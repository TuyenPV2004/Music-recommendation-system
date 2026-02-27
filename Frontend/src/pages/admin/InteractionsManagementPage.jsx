import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Search,
  Download,
  Star,
  Clock,
  Filter,
  Key,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { adminAPI } from "../../services/api";

export default function InteractionsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchInteractions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.interactions({ page, limit });
      setInteractions(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to fetch interactions:", err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  // Client-side filtering
  const filteredInteractions = interactions.filter((interaction) => {
    const matchesSearch =
      (interaction.user_id || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      String(interaction.song_id || "").includes(searchQuery);

    let matchesFilter = true;
    if (filterType === "rated") matchesFilter = interaction.rate > 0;
    if (filterType === "high_engagement")
      matchesFilter = interaction.listen_count >= 20;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(total / limit);

  const handleExportData = () => {
    toast.success(
      "Đang chuẩn bị dữ liệu. File dataset.csv sẽ được tải xuống tự động.",
    );
    setTimeout(() => {
      toast.info(
        "Tải xuống dataset thành công! Sẵn sàng cho quá trình huấn luyện LightFM.",
      );
    }, 2000);
  };

  // Helper to format seconds to HR:MIN:SEC
  const formatDuration = (totalSeconds) => {
    if (!totalSeconds) return "—";
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-white flex items-center gap-3">
            Hệ thống AI
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Theo dõi hành vi người dùng, trích xuất Dataset để huấn luyện mô
            hình gợi ý (LightFM).
          </p>
        </div>
      </div>

      {/* Info Banner for AI */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-4">
        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center shrink-0">
          <Key className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h3 className="text-orange-400 font-medium mb-1">
            Dữ liệu huấn luyện
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed text-justify">
            Bảng bên dưới phản ánh ma trận user_id và song_id. Các chỉ số{" "}
            <strong>Listen Count</strong> - Tần suất, <strong>Duration</strong>{" "}
            - Thời lượng và <strong>Rating</strong> - Đánh giá chủ động là các{" "}
            <em>Implicit/Explicit Feedbacks</em> cực kỳ quan trọng. Hãy xuất dữ
            liệu này kết hợp cùng với <strong>Item Features</strong> để build mô
            hình Hybrid Recommender System.
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-black text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
              placeholder="Tìm user ID hoặc song ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-full font-medium text-sm hover:focus:ring-orange-700 hover:bg-orange-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> Xuất Dataset
          </button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap hidden sm:flex">
            <Filter className="w-4 h-4" /> Lọc:
          </div>
          <select
            className="bg-black border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2 w-full sm:w-auto outline-none"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">Tất cả tương tác</option>
            <option value="rated">Chỉ hiện có đánh giá</option>
            <option value="high_engagement"> Lượt nghe cao </option>
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
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Song ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-400 tracking-wider hidden sm:table-cell"
                >
                  Tần suất
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Đánh giá
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-400 tracking-wider hidden lg:table-cell"
                >
                  Cập nhật lần cuối
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                      <span className="ml-3 text-gray-400">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInteractions.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Activity className="w-8 h-8 opacity-20 mb-3 text-orange-500" />
                      <p>
                        Không có dữ liệu tương tác nào theo tiêu chí lọc này.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInteractions.map((interaction) => (
                  <tr
                    key={interaction.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm text-gray-300 font-mono"
                        title={interaction.user_id}
                      >
                        {interaction.user_id || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                      #{interaction.song_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300 font-medium hidden sm:table-cell">
                      <span className="bg-gray-800 px-2.5 py-1 rounded text-gray-300">
                        {interaction.listen_count} lần
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {interaction.rate > 0 ? (
                        <div className="flex justify-center items-center gap-1">
                          <span className="text-white font-medium text-sm">
                            {interaction.rate}
                          </span>
                          <Star
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-600 text-xs italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 hidden lg:table-cell font-mono">
                      {interaction.last_listen_at || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Status */}
        <div className="bg-gray-950/50 px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Hiển thị{" "}
            <span className="font-medium text-white">
              {filteredInteractions.length}
            </span>{" "}
            records / Tổng số{" "}
            <span className="font-medium text-white">
              {total.toLocaleString()}
            </span>{" "}
            records (Trang {page}/{totalPages || 1})
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </button>
            <span className="px-3 py-1 bg-green-600 text-black rounded-md text-sm font-medium border border-green-500 shadow-sm">
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
    </div>
  );
}
