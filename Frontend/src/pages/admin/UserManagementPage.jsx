import React, { useState } from "react";
import {
  Users,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Filter,
} from "lucide-react";

// Mock Data
const MOCK_USERS = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    birthDate: "15/04/1998",
    role: "User",
    status: "Active",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib.work@yahoo.com",
    birthDate: "22/11/2001",
    role: "User",
    status: "Active",
  },
  {
    id: 3,
    name: "Lê Hoàng C",
    email: "lehoangc2005@outlook.com",
    birthDate: "05/01/2005",
    role: "User",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Admin Tổng",
    email: "admin@moodify.com",
    birthDate: "01/01/1990",
    role: "Admin",
    status: "Active",
  },
  {
    id: 5,
    name: "Phạm Tấn D",
    email: "phamtd@gmail.com",
    birthDate: "12/08/1995",
    role: "User",
    status: "Banned",
  },
];

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Quản lý người dùng
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Xem, tìm kiếm và quản lý tài khoản thành viên trong hệ thống.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 flex-1">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-full leading-5 bg-black text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="Tìm theo tên, email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-green-500 text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-green-600 transition-colors shadow-sm whitespace-nowrap">
            Thêm người dùng
          </button>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap hidden sm:flex">
            <Filter className="w-4 h-4" /> Lọc:
          </div>
          <div className="relative w-full sm:w-auto">
            <select className="bg-black border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2 pr-8 w-full sm:w-auto outline-none appearance-none cursor-pointer">
              <option>Tất cả trạng thái</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Banned</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
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
                  Người dùng
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden sm:table-cell"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden md:table-cell"
                >
                  Vai trò
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider hidden lg:table-cell"
                >
                  Ngày sinh
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-400 tracking-wider text-center"
                >
                  Trạng thái
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-green-600 flex items-center justify-center text-white font-bold shadow-inner">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.role === "Admin"
                          ? "bg-red-500/10 text-red-500 border-red-500/20"
                          : "bg-gray-800 text-gray-300 border-gray-700"
                      }`}
                    >
                      {user.role === "Admin" && (
                        <Shield className="w-3.5 h-3.5" />
                      )}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      {user.birthDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === "Active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : user.status === "Inactive"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="text-gray-400 hover:text-blue-400 transition-colors p-1"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-400 transition-colors p-1"
                        title="Xóa tài khoản"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-8 h-8 opacity-20 mb-3" />
                      <p>Không tìm thấy người dùng nào phù hợp với tìm kiếm.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-gray-950/50 px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Hiển thị{" "}
            <span className="font-medium text-white">
              {filteredUsers.length}
            </span>{" "}
            /{" "}
            <span className="font-medium text-white">{MOCK_USERS.length}</span>{" "}
            người dùng
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50"
              disabled
            >
              Trước
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium border border-blue-500 shadow-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-700 rounded-md text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
              Tiếp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
