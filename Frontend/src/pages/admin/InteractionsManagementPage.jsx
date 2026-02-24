import React, { useState } from "react";
import {
  Activity,
  Search,
  Download,
  Star,
  Clock,
  Filter,
  Key,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";

// Mock Data (Representing user_song_interactions table)
const MOCK_INTERACTIONS = [
  {
    id: 1,
    userId: 101,
    userName: "Nguyễn Văn A",
    songId: 1,
    songTitle: "Chắc Ai Đó Sẽ Về",
    listenCount: 45,
    listenDuration: 8500, // seconds
    rate: 5,
    lastListenAt: "2024-02-24 09:15:22",
  },
  {
    id: 2,
    userId: 105,
    userName: "Trần Thị B",
    songId: 4,
    songTitle: "Lửng Lơ",
    listenCount: 12,
    listenDuration: 2100,
    rate: 4,
    lastListenAt: "2024-02-23 20:45:10",
  },
  {
    id: 3,
    userId: 204,
    userName: "Lê Hoàng C",
    songId: 2,
    songTitle: "Nấu Ăn Cho Em",
    listenCount: 8,
    listenDuration: 1850,
    rate: 0, // Not rated yet
    lastListenAt: "2024-02-22 15:30:00",
  },
  {
    id: 4,
    userId: 101,
    userName: "Nguyễn Văn A",
    songId: 3,
    songTitle: "Có Chàng Trai Viết Lên Cây",
    listenCount: 22,
    listenDuration: 4500,
    rate: 5,
    lastListenAt: "2024-02-20 08:20:15",
  },
  {
    id: 5,
    userId: 330,
    userName: "Phạm Tấn D",
    songId: 1,
    songTitle: "Chắc Ai Đó Sẽ Về",
    listenCount: 2,
    listenDuration: 400,
    rate: 2,
    lastListenAt: "2024-02-18 19:10:05",
  },
];

export default function InteractionsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredInteractions = MOCK_INTERACTIONS.filter((interaction) => {
    const matchesSearch =
      interaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.songTitle.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (filterType === "rated") matchesFilter = interaction.rate > 0;
    if (filterType === "high_engagement")
      matchesFilter = interaction.listenCount >= 20;

    return matchesSearch && matchesFilter;
  });

  const handleExportData = () => {
    // In a real application, this would trigger an API call to generate and download a CSV/JSON
    toast.success(
      "Đang chuẩn bị dữ liệu. File dataset.csv sẽ được tải xuống tự động.",
    );

    // Fake download delay
    setTimeout(() => {
      toast.info(
        "Tải xuống dataset thành công! Sẵn sàng cho quá trình huấn luyện LightFM.",
      );
    }, 2000);
  };

  // Helper to format seconds to HR:MIN:SEC
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
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
              placeholder="Tìm user hoặc tên bài hát"
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
                  Người dùng
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  ID Người dùng
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  Bài hát
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider"
                >
                  ID Bài hát
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semimedium text-gray-400 tracking-wider hidden sm:table-cell"
                >
                  Tần suất
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semimedium text-gray-400 tracking-wider hidden md:table-cell"
                >
                  Tổng thời lượng
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-xs font-semimedium text-gray-400 tracking-wider"
                >
                  Đánh giá
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-right text-xs font-semimedium text-gray-400 tracking-wider hidden lg:table-cell"
                >
                  Cập nhật lần cuối
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-800">
              {filteredInteractions.map((interaction) => (
                <tr
                  key={interaction.id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white max-w-[150px] truncate">
                      {interaction.userName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                    #{interaction.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-white max-w-[200px] truncate">
                      {interaction.songTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                    #{interaction.songId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300 font-medium hidden sm:table-cell">
                    <span className="bg-gray-800 px-2.5 py-1 rounded text-gray-300">
                      {interaction.listenCount} lần
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      {formatDuration(interaction.listenDuration)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {interaction.rate > 0 ? (
                      <div className="flex justify-center items-center gap-1">
                        <span className="text-white font-medium text-sm">
                          {interaction.rate}
                        </span>
                        <Star
                          className="w-4 h-4 text-green-500"
                          fill="currentColor"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-600 text-xs italic">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 hidden lg:table-cell font-mono">
                    {interaction.lastListenAt}
                  </td>
                </tr>
              ))}

              {filteredInteractions.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
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
            <span className="font-medium text-white">450,212</span> records
          </p>
        </div>
      </div>
    </div>
  );
}
