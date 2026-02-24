import React, { useState } from "react";
import {
  ListMusic,
  Search,
  Trash2,
  MoreVertical,
  Eye,
  Lock,
  Globe,
  Filter,
} from "lucide-react";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";

// Mock Data
const MOCK_PLAYLISTS = [
  {
    id: 1,
    name: "Nhạc Khích Lệ Tinh Thần",
    user: { id: 101, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com" },
    isPublic: true,
    songCount: 15,
    createdAt: "2023-11-20",
  },
  {
    id: 2,
    name: "Lofi Focus 99+",
    user: { id: 105, name: "Trần Thị B", email: "tranthib@yahoo.com" },
    isPublic: true,
    songCount: 42,
    createdAt: "2023-10-15",
  },
  {
    id: 3,
    name: "Tủ Nhạc Tập Gym Bí Mật",
    user: { id: 204, name: "Lê Hoàng C", email: "lehoangc@outlook.com" },
    isPublic: false,
    songCount: 28,
    createdAt: "2023-12-01",
  },
  {
    id: 4,
    name: "Top Hits 2024",
    user: { id: 101, name: "Nguyễn Văn A", email: "nguyenvana@gmail.com" },
    isPublic: true,
    songCount: 50,
    createdAt: "2024-01-05",
  },
  {
    id: 5,
    name: "Buồn Của Tôi",
    user: { id: 330, name: "Phạm Tấn D", email: "phamtd@gmail.com" },
    isPublic: false,
    songCount: 12,
    createdAt: "2024-02-10",
  },
];

export default function PlaylistManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPrivacy, setFilterPrivacy] = useState("");

  const filteredPlaylists = MOCK_PLAYLISTS.filter((playlist) => {
    const matchesSearch =
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrivacy = true;
    if (filterPrivacy === "public") matchesPrivacy = playlist.isPublic === true;
    if (filterPrivacy === "private")
      matchesPrivacy = playlist.isPublic === false;

    return matchesSearch && matchesPrivacy;
  });

  const handleDelete = (name) => {
    // In a real app, you'd show a confirmation modal first
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa Playlist "${name}" không? Hành động này sẽ xóa cả danh sách bài hát bên trong nó.`,
      )
    ) {
      toast.info(`Đã xóa Playlist "${name}" bởi Admin`);
    }
  };

  const handleInspect = (id) => {
    toast.info(
      `Tính năng xem chi tiết Playlist ID #${id} đang được phát triển.`,
    );
  };

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
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
          <div className="relative w-full lg:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-black text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 sm:text-sm transition-colors"
              placeholder="Tìm theo tên playlist, tên người dùng, email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() =>
              toast.info("Tính năng thêm Playlist mới đang được phát triển.")
            }
            className="flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-2 rounded-full font-medium text-sm hover:focus:ring-green-600 hover:bg-green-600 transition-colors shadow-sm whitespace-nowrap"
          >
            Thêm Playlist mới
          </button>
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
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400  tracking-wider"
                >
                  Tên Playlist
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden md:table-cell"
                >
                  Người tạo
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
              {filteredPlaylists.map((playlist) => (
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
                        <span className="text-xs text-gray-500 block">
                          {playlist.songCount} bài hát
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-300 font-medium">
                      {playlist.user.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {playlist.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell text-sm">
                    {playlist.isPublic ? (
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
                    {playlist.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleInspect(playlist.id)}
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
              ))}

              {filteredPlaylists.length === 0 && (
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
            /{" "}
            <span className="font-medium text-white">
              {MOCK_PLAYLISTS.length}
            </span>{" "}
            playlist
          </p>
        </div>
      </div>
    </div>
  );
}
